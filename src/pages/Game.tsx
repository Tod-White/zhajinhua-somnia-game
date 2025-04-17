import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useWallet } from '../contexts/WalletContext';
import { useGame, GameStatus, Card as CardType } from '../contexts/GameContext';

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

const GameStatus = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 1rem;
  background-color: ${props => {
    switch (props.status) {
      case 'Created': return '#3b82f6';
      case 'Active': return '#10b981';
      case 'Completed': return '#6b7280';
      case 'Cancelled': return '#ef4444';
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

const GameTable = styled.div`
  background-color: #15803d; // Poker table green
  border-radius: 50%;
  width: 100%;
  max-width: 800px;
  height: 400px;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  border: 15px solid #7f1d1d;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const Pot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--accent-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.2rem;
`;

const PlayersContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const PlayerPosition = styled.div<{ position: number }>`
  position: absolute;
  
  ${props => {
    switch (props.position) {
      case 0: // Bottom (current player)
        return `
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 1: // Top left
        return `
          top: 10%;
          left: 20%;
        `;
      case 2: // Top right
        return `
          top: 10%;
          right: 20%;
        `;
      default:
        return '';
    }
  }}
`;

const PlayerInfo = styled.div<{ isActive: boolean }>`
  background-color: ${props => props.isActive ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.6)'};
  padding: 1rem;
  border-radius: 8px;
  width: 220px;
  opacity: ${props => props.isActive ? 1 : 0.7};
  border: ${props => props.isActive ? '2px solid var(--accent-color)' : 'none'};
`;

const PlayerName = styled.div`
  font-size: 0.9rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlayerStatus = styled.span<{ status: 'active' | 'folded' | 'revealed' }>`
  font-size: 0.8rem;
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  color: white;
  background-color: ${props => {
    switch (props.status) {
      case 'active': return '#10b981';
      case 'folded': return '#ef4444';
      case 'revealed': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Card = styled.div<{ revealed: boolean }>`
  width: 60px;
  height: 90px;
  border-radius: 5px;
  background-color: ${props => props.revealed ? 'white' : '#1e40af'};
  border: 1px solid #ccc;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  
  ${props => !props.revealed && `
    background-image: linear-gradient(45deg, #1e40af 25%, #0f172a 25%, #0f172a 50%, #1e40af 50%, #1e40af 75%, #0f172a 75%, #0f172a 100%);
    background-size: 20px 20px;
  `}
`;

const CardValue = styled.div<{ color: string }>`
  color: ${props => props.color};
  font-size: 1.2rem;
  font-weight: bold;
`;

const CardSuit = styled.div<{ color: string }>`
  position: absolute;
  top: 5px;
  left: 5px;
  color: ${props => props.color};
  font-size: 1rem;
`;

const GameControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ControlButton = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  
  ${props => props.primary ? `
    background-color: var(--accent-color);
    color: #000;
    border: none;
    
    &:hover {
      background-color: #ffc107;
    }
  ` : `
    background-color: transparent;
    color: var(--accent-color);
    border: 2px solid var(--accent-color);
    
    &:hover {
      background-color: var(--accent-color);
      color: #000;
    }
  `}
  
  &:disabled {
    background-color: #555;
    border-color: #555;
    color: #888;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--card-color);
  border-radius: 8px;
  margin: 2rem 0;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--error-color);
  background-color: var(--card-color);
  border-radius: 8px;
  margin: 2rem 0;
`;

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

  // Format player address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Get card display value
  const getCardDisplay = (card: CardType) => {
    const value = card.value;
    switch (value) {
      case 1: return 'A';
      case 11: return 'J';
      case 12: return 'Q';
      case 13: return 'K';
      default: return value.toString();
    }
  };

  // Get card display suit
  const getCardSuit = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  // Get color based on suit
  const getCardColor = (suit: string) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
  };

  // Check if all active players have revealed their cards
  const allPlayersRevealed = () => {
    if (!currentGame) return false;
    
    const activePlayers = currentGame.players.filter(p => !p.hasFolded);
    return activePlayers.every(p => p.hasRevealed);
  };

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
        <LoadingState>Loading game data...</LoadingState>
      </GameContainer>
    );
  }

  if (error) {
    return (
      <GameContainer>
        <ErrorState>
          <h2>Error loading game</h2>
          <p>{error}</p>
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
          <ControlButton primary onClick={() => navigate('/lobby')}>
            Return to Lobby
          </ControlButton>
        </EmptyState>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <GameHeader>
        <div>
          <Title>
            Zhajinhua Game
            {gameId && <GameId>ID: {formatGameId(gameId)}</GameId>}
          </Title>
        </div>
        
        <GameInfo>
          <GameStatus status={currentGame.status}>
            {currentGame.status}
          </GameStatus>
          
          <StakeAmount>
            Stake: {currentGame.currentStake} ETH
          </StakeAmount>
        </GameInfo>
      </GameHeader>
      
      <GameSection>
        <GameTable>
          <Pot>
            Pot: {currentGame.totalPot} ETH
          </Pot>
          
          <PlayersContainer>
            {currentGame.players.map((player, index) => {
              // Reorder players so current player is always at bottom position (0)
              let displayPosition = index;
              if (playerIndex !== null) {
                displayPosition = (index - playerIndex + 3) % 3;
              }
              
              const isCurrentPlayer = index === playerIndex;
              const status: 'active' | 'folded' | 'revealed' = 
                player.hasFolded ? 'folded' : 
                player.hasRevealed ? 'revealed' : 'active';
              
              return (
                <PlayerPosition key={index} position={displayPosition}>
                  <PlayerInfo isActive={player.isActive}>
                    <PlayerName>
                      {formatAddress(player.address)}
                      {isCurrentPlayer && " (You)"}
                      <PlayerStatus status={status}>
                        {status === 'folded' ? 'Folded' : 
                          status === 'revealed' ? 'Revealed' : 'Active'}
                      </PlayerStatus>
                    </PlayerName>
                    
                    <CardsContainer>
                      {player.cards.length > 0 ? (
                        player.cards.map((card, cardIndex) => (
                          <Card key={cardIndex} revealed={player.hasRevealed || isCurrentPlayer}>
                            {(player.hasRevealed || isCurrentPlayer) && (
                              <>
                                <CardValue color={getCardColor(card.suit)}>
                                  {getCardDisplay(card)}
                                </CardValue>
                                <CardSuit color={getCardColor(card.suit)}>
                                  {getCardSuit(card.suit)}
                                </CardSuit>
                              </>
                            )}
                          </Card>
                        ))
                      ) : (
                        <>
                          <Card revealed={false} />
                          <Card revealed={false} />
                          <Card revealed={false} />
                        </>
                      )}
                    </CardsContainer>
                  </PlayerInfo>
                </PlayerPosition>
              );
            })}
          </PlayersContainer>
        </GameTable>
      </GameSection>
      
      <GameControls>
        {canJoin && (
          <ControlButton primary onClick={handleJoinGame} disabled={isLoading}>
            Join Game
          </ControlButton>
        )}
        
        {canDeal && (
          <ControlButton primary onClick={handleDealCards} disabled={isLoading}>
            Deal Cards and Start Game
          </ControlButton>
        )}
        
        {canReveal && (
          <ControlButton primary onClick={handleRevealCards} disabled={isLoading}>
            Reveal Cards
          </ControlButton>
        )}
        
        {canFold && (
          <ControlButton onClick={handleFold} disabled={isLoading}>
            Fold
          </ControlButton>
        )}
        
        {/* Show determine winner button when appropriate */}
        {currentGame.status === GameStatus.Active && 
         playerIndex === 0 && // Only game creator can determine winner
         allPlayersRevealed() && (
          <ControlButton primary onClick={handleDetermineWinner} disabled={isLoading}>
            Determine Winner
          </ControlButton>
        )}
        
        {/* Show winner if game is completed */}
        {currentGame.status === GameStatus.Completed && winner && (
          <EmptyState>
            <h2>Game Completed</h2>
            <p>Winner: {formatAddress(winner)}</p>
            <p>Prize: {currentGame.totalPot} ETH</p>
          </EmptyState>
        )}
        
        <ControlButton onClick={() => navigate('/lobby')}>
          Return to Lobby
        </ControlButton>
      </GameControls>
    </GameContainer>
  );
};

export default Game;
