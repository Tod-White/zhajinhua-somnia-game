import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useWallet } from '../contexts/WalletContext';
import { useGame, GameStatus } from '../contexts/GameContext';
import GameTable from '../components/game/GameTable';
import GameControls from '../components/game/GameControls';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Styled components
const GameContainer = styled.div`
  padding: 2rem 0;
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  color: var(--text-color);
`;

const GameId = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-left: 1rem;
`;

const GameInfo = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 1rem;
  background-color: ${props => {
    switch (props.status) {
      case 'Created': return 'var(--primary-color)';
      case 'Active': return 'var(--success-color)';
      case 'Completed': return '#6b7280';
      case 'Cancelled': return 'var(--error-color)';
      default: return '#6b7280';
    }
  }};
  color: white;
`;

const StakeAmount = styled.span`
  color: var(--accent-color);
  font-weight: bold;
`;

const GameSection = styled.div`
  margin-bottom: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--card-color);
  border-radius: 8px;
  margin: 2rem 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--error-color);
  background-color: var(--card-color);
  border-radius: 8px;
  margin: 2rem 0;
`;

const ReturnButton = styled.button`
  background: var(--gradient-blue-purple);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  margin-top: 1rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

/**
 * Game Page Component
 * Main game interface with table, cards, and player interactions
 */
const Game: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { account, isConnected } = useWallet();
  const { 
    currentGame,
    loadGame,
    joinGame,
    dealCards,
    revealCards,
    fold,
    submitResult,
    isLoading,
    error
  } = useGame();
  
  const [playerIndex, setPlayerIndex] = useState<number | null>(null);
  const [canJoin, setCanJoin] = useState(false);
  const [canDeal, setCanDeal] = useState(false);
  const [canReveal, setCanReveal] = useState(false);
  const [canFold, setCanFold] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Load game data when component mounts
  useEffect(() => {
    if (gameId && isConnected) {
      loadGame(gameId);
    }
  }, [gameId, isConnected, loadGame]);

  // Update player index and available actions when game or account changes
  useEffect(() => {
    if (!currentGame || !account) return;
    
    // Find player index
    const index = currentGame.players.findIndex(p => p.address === account);
    setPlayerIndex(index !== -1 ? index : null);
    
    // Determine available actions
    const isInGame = index !== -1;
    const isGameCreated = currentGame.status === GameStatus.Created;
    const isGameActive = currentGame.status === GameStatus.Active;
    const isGameCompleted = currentGame.status === GameStatus.Completed;
    
    // Can join if not in game and game is in created state
    setCanJoin(!isInGame && isGameCreated && currentGame.players.length < 3);
    
    // Can deal if in game, game is created, and player is the creator (index 0)
    setCanDeal(isInGame && isGameCreated && index === 0 && currentGame.players.length >= 2);
    
    // Can reveal if in game, game is active, and player hasn't revealed cards
    setCanReveal(isInGame && isGameActive && !currentGame.players[index]?.hasRevealed);
    
    // Can fold if in game, game is active, and player hasn't folded or revealed
    setCanFold(isInGame && isGameActive && !currentGame.players[index]?.hasFolded && !currentGame.players[index]?.hasRevealed);
    
    // Check if game has started (for UI purposes)
    setGameStarted(isGameActive || isGameCompleted);
    
    // Check if game has a winner
    setWinner(currentGame.winner || null);
  }, [currentGame, account]);

  // Game action handlers
  const handleJoinGame = async () => {
    if (!gameId || !currentGame) return;
    try {
      await joinGame(gameId, currentGame.currentStake.toString());
    } catch (err) {
      console.error('Error joining game:', err);
    }
  };

  const handleDealCards = () => {
    dealCards();
  };

  const handleRevealCards = () => {
    if (playerIndex !== null) {
      revealCards(playerIndex);
    }
  };

  const handleFold = () => {
    if (playerIndex !== null) {
      fold(playerIndex);
    }
  };

  const handleDetermineWinner = async () => {
    if (!currentGame || !gameId) return;
    
    // In a real game, you'd determine the winner based on card rankings
    // For this MVP, we'll select the first player who hasn't folded
    const potentialWinners = currentGame.players.filter(p => !p.hasFolded);
    if (potentialWinners.length > 0) {
      const winner = potentialWinners[0].address;
      await submitResult(gameId, winner);
    }
  };

  // Format gameId for display
  const formatGameId = (id: string) => {
    return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
  };

  // Check if all active players have revealed their cards
  const allPlayersRevealed = () => {
    if (!currentGame) return false;
    
    const activePlayers = currentGame.players.filter(p => !p.hasFolded);
    return activePlayers.every(p => p.hasRevealed);
  };

  // Render different states based on loading, error, and game state
  if (!isConnected) {
    return (
      <GameContainer>
        <EmptyState>
          <h2>Connect your wallet to view this game</h2>
        </EmptyState>
      </GameContainer>
    );
  }

  if (isLoading) {
    return (
      <GameContainer>
        <LoadingSpinner size="large" message="Loading game data..." />
      </GameContainer>
    );
  }

  if (error) {
    return (
      <GameContainer>
        <ErrorState>
          <h2>Error loading game</h2>
          <p>{error}</p>
          <ReturnButton onClick={() => navigate('/lobby')}>
            Return to Lobby
          </ReturnButton>
        </ErrorState>
      </GameContainer>
    );
  }

  if (!currentGame) {
    return (
      <GameContainer>
        <EmptyState>
          <h2>Game not found</h2>
          <p>The game you're looking for doesn't exist or has been cancelled.</p>
          <ReturnButton onClick={() => navigate('/lobby')}>
            Return to Lobby
          </ReturnButton>
        </EmptyState>
      </GameContainer>
    );
  }

  return (
    <GameContainer className="animate-fade-in">
      <GameHeader>
        <div>
          <Title>
            Zhajinhua Game
            {gameId && <GameId>ID: {formatGameId(gameId)}</GameId>}
          </Title>
        </div>
        
        <GameInfo>
          <StatusBadge status={currentGame.status}>
            {currentGame.status}
          </StatusBadge>
          
          <StakeAmount>
            Stake: {currentGame.currentStake} ETH
          </StakeAmount>
        </GameInfo>
      </GameHeader>
      
      <GameSection>
        <GameTable 
          players={currentGame.players} 
          totalPot={currentGame.totalPot} 
          playerIndex={playerIndex}
        />
      </GameSection>
      
      <GameControls
        canJoin={canJoin}
        canDeal={canDeal}
        canReveal={canReveal}
        canFold={canFold}
        isCompleted={currentGame.status === GameStatus.Completed}
        winner={winner}
        totalPot={currentGame.totalPot}
        allPlayersRevealed={allPlayersRevealed()}
        isCreator={playerIndex === 0}
        isLoading={isLoading}
        onJoin={handleJoinGame}
        onDeal={handleDealCards}
        onReveal={handleRevealCards}
        onFold={handleFold}
        onDetermineWinner={handleDetermineWinner}
      />
    </GameContainer>
  );
};

export default Game;
