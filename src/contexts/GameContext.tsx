import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './WalletContext';

// Types for game data
export type Card = {
  suit: 'spades' | 'hearts' | 'diamonds' | 'clubs';
  value: number; // 1-13 (Ace is 1, Jack is 11, Queen is 12, King is 13)
};

export type Player = {
  address: string;
  cards: Card[];
  isActive: boolean;
  hasFolded: boolean;
  hasRevealed: boolean;
};

export enum GameStatus {
  Created = 'Created',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export type Game = {
  gameId: string;
  players: Player[];
  currentStake: number;
  totalPot: number;
  status: GameStatus;
  createdAt: number;
  winner?: string;
};

// Contract interfaces
const ZhajinhuaGameABI = [
  // Event methods
  'function createGame(uint256 stake) external payable returns (bytes32)',
  'function joinGame(bytes32 gameId) external payable',
  'function submitGameResult(bytes32 gameId, address winner, bytes32 gameHash) external',
  'function cancelGame(bytes32 gameId) external',
  'function getPlayerGames(address player) external view returns (bytes32[])',
  'function getGameDetails(bytes32 gameId) external view returns (tuple(bytes32,address[],uint256,uint8,uint256,tuple(address,uint256,uint256,bytes32)) memory)'
];

// Interface for our context
interface GameContextType {
  currentGame: Game | null;
  playerGames: string[];
  isLoading: boolean;
  error: string | null;
  createGame: (stake: string) => Promise<string | null>;
  joinGame: (gameId: string, stake: string) => Promise<boolean>;
  leaveGame: () => void;
  cancelGame: (gameId: string) => Promise<boolean>;
  submitResult: (gameId: string, winner: string) => Promise<boolean>;
  loadGame: (gameId: string) => Promise<void>;
  dealCards: () => void;
  revealCards: (playerIndex: number) => void;
  fold: (playerIndex: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

// Contract address on Somnia network (placeholder)
const GAME_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Replace with actual contract address

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { account, provider, signer, isConnected } = useWallet();
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [playerGames, setPlayerGames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gameContract, setGameContract] = useState<ethers.Contract | null>(null);

  // Initialize contract when provider and signer are available
  useEffect(() => {
    if (provider && signer) {
      try {
        const contract = new ethers.Contract(
          GAME_CONTRACT_ADDRESS,
          ZhajinhuaGameABI,
          signer
        );
        setGameContract(contract);
      } catch (err) {
        console.error('Error initializing game contract:', err);
        setError('Failed to initialize game contract');
      }
    }
  }, [provider, signer]);

  // Load player's games when account changes
  useEffect(() => {
    if (isConnected && account && gameContract) {
      loadPlayerGames();
    }
  }, [account, gameContract, isConnected]);

  // Load games that player is participating in
  const loadPlayerGames = async () => {
    if (!account || !gameContract) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const games = await gameContract.getPlayerGames(account);
      setPlayerGames(games);
    } catch (err) {
      console.error('Error loading player games:', err);
      setError('Failed to load your games');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new game
  const createGame = async (stake: string): Promise<string | null> => {
    if (!gameContract || !signer) {
      setError('Wallet not connected');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const stakeAmount = ethers.parseEther(stake);
      const tx = await gameContract.createGame(stakeAmount, {
        value: stakeAmount
      });
      
      const receipt = await tx.wait();
      
      // Get gameId from event logs
      const event = receipt.logs
        .filter((log: any) => log.topics[0] === ethers.id('GameCreated(bytes32,address,uint256)'))
        .map((log: any) => gameContract.interface.parseLog(log))[0];
      
      const gameId = event.args.gameId;
      
      // Initialize local game state
      const newGame: Game = {
        gameId,
        players: [{
          address: account!,
          cards: [],
          isActive: true,
          hasFolded: false,
          hasRevealed: false
        }],
        currentStake: Number(stake),
        totalPot: Number(stake),
        status: GameStatus.Created,
        createdAt: Date.now()
      };
      
      setCurrentGame(newGame);
      await loadPlayerGames();
      
      return gameId;
    } catch (err) {
      console.error('Error creating game:', err);
      setError('Failed to create game');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Join an existing game
  const joinGame = async (gameId: string, stake: string): Promise<boolean> => {
    if (!gameContract || !signer) {
      setError('Wallet not connected');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const stakeAmount = ethers.parseEther(stake);
      const tx = await gameContract.joinGame(gameId, {
        value: stakeAmount
      });
      
      await tx.wait();
      
      // Load the game details
      await loadGame(gameId);
      await loadPlayerGames();
      
      return true;
    } catch (err) {
      console.error('Error joining game:', err);
      setError('Failed to join game');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Leave current game (local action only)
  const leaveGame = () => {
    setCurrentGame(null);
  };

  // Cancel a game
  const cancelGame = async (gameId: string): Promise<boolean> => {
    if (!gameContract || !signer) {
      setError('Wallet not connected');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const tx = await gameContract.cancelGame(gameId);
      await tx.wait();
      
      if (currentGame && currentGame.gameId === gameId) {
        setCurrentGame({
          ...currentGame,
          status: GameStatus.Cancelled
        });
      }
      
      await loadPlayerGames();
      return true;
    } catch (err) {
      console.error('Error canceling game:', err);
      setError('Failed to cancel game');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Submit game result
  const submitResult = async (gameId: string, winner: string): Promise<boolean> => {
    if (!gameContract || !signer) {
      setError('Wallet not connected');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a game hash for verification
      const gameHash = ethers.keccak256(
        ethers.toUtf8Bytes(JSON.stringify(currentGame))
      );
      
      const tx = await gameContract.submitGameResult(gameId, winner, gameHash);
      await tx.wait();
      
      if (currentGame && currentGame.gameId === gameId) {
        setCurrentGame({
          ...currentGame,
          status: GameStatus.Completed,
          winner
        });
      }
      
      await loadPlayerGames();
      return true;
    } catch (err) {
      console.error('Error submitting result:', err);
      setError('Failed to submit game result');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load a specific game
  const loadGame = async (gameId: string): Promise<void> => {
    if (!gameContract) {
      setError('Contract not initialized');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const gameData = await gameContract.getGameDetails(gameId);
      
      // Convert the contract data to our Game type
      const game: Game = {
        gameId: gameData[0],
        players: gameData[1].map((address: string) => ({
          address,
          cards: [],
          isActive: true,
          hasFolded: false,
          hasRevealed: false
        })),
        currentStake: Number(ethers.formatEther(gameData[2])),
        totalPot: Number(ethers.formatEther(gameData[2])) * gameData[1].length,
        status: gameData[3],
        createdAt: Number(gameData[4]),
        winner: gameData[5].winner !== ethers.ZeroAddress ? gameData[5].winner : undefined
      };
      
      setCurrentGame(game);
    } catch (err) {
      console.error('Error loading game:', err);
      setError('Failed to load game details');
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side game logic functions

  // Deal cards to players (done client-side for MVP)
  const dealCards = () => {
    if (!currentGame) return;
    
    // Build a deck
    const suits: ('spades' | 'hearts' | 'diamonds' | 'clubs')[] = ['spades', 'hearts', 'diamonds', 'clubs'];
    const deck: Card[] = [];
    
    for (const suit of suits) {
      for (let value = 1; value <= 13; value++) {
        deck.push({ suit, value });
      }
    }
    
    // Shuffle deck using Fisher-Yates algorithm
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    // Deal 3 cards to each player
    const updatedPlayers = currentGame.players.map(player => {
      return {
        ...player,
        cards: [deck.pop()!, deck.pop()!, deck.pop()!]
      };
    });
    
    setCurrentGame({
      ...currentGame,
      players: updatedPlayers,
      status: GameStatus.Active
    });
  };

  // Reveal a player's cards
  const revealCards = (playerIndex: number) => {
    if (!currentGame) return;
    
    const updatedPlayers = [...currentGame.players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      hasRevealed: true
    };
    
    setCurrentGame({
      ...currentGame,
      players: updatedPlayers
    });
  };

  // Fold (player gives up)
  const fold = (playerIndex: number) => {
    if (!currentGame) return;
    
    const updatedPlayers = [...currentGame.players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      hasFolded: true,
      isActive: false
    };
    
    setCurrentGame({
      ...currentGame,
      players: updatedPlayers
    });
  };

  return (
    <GameContext.Provider
      value={{
        currentGame,
        playerGames,
        isLoading,
        error,
        createGame,
        joinGame,
        leaveGame,
        cancelGame,
        submitResult,
        loadGame,
        dealCards,
        revealCards,
        fold
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
