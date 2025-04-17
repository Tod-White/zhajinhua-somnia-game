import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ControlsContainer = styled.div`
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
  transition: all 0.3s ease;
  
  ${props => props.primary ? `
    background: var(--gradient-blue-purple);
    color: white;
    border: none;
    
    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
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
    background: #555;
    border-color: #555;
    color: #888;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--card-color);
  border-radius: 8px;
  margin: 2rem 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.5s ease-in-out;
`;

interface GameControlsProps {
  canJoin: boolean;
  canDeal: boolean;
  canReveal: boolean;
  canFold: boolean;
  isCompleted: boolean;
  winner: string | null;
  totalPot: number;
  allPlayersRevealed: boolean;
  isCreator: boolean;
  isLoading: boolean;
  onJoin: () => void;
  onDeal: () => void;
  onReveal: () => void;
  onFold: () => void;
  onDetermineWinner: () => void;
}

/**
 * GameControls Component
 * Displays the appropriate game control buttons based on game state
 */
const GameControls: React.FC<GameControlsProps> = ({ 
  canJoin,
  canDeal,
  canReveal,
  canFold,
  isCompleted,
  winner,
  totalPot,
  allPlayersRevealed,
  isCreator,
  isLoading,
  onJoin,
  onDeal,
  onReveal,
  onFold,
  onDetermineWinner
}) => {
  const navigate = useNavigate();
  
  // Format address for display
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <>
      <ControlsContainer>
        {canJoin && (
          <ControlButton primary onClick={onJoin} disabled={isLoading}>
            Join Game
          </ControlButton>
        )}
        
        {canDeal && (
          <ControlButton primary onClick={onDeal} disabled={isLoading}>
            Deal Cards and Start Game
          </ControlButton>
        )}
        
        {canReveal && (
          <ControlButton primary onClick={onReveal} disabled={isLoading}>
            Reveal Cards
          </ControlButton>
        )}
        
        {canFold && (
          <ControlButton onClick={onFold} disabled={isLoading}>
            Fold
          </ControlButton>
        )}
        
        {/* Show determine winner button when appropriate */}
        {allPlayersRevealed && isCreator && !isCompleted && (
          <ControlButton primary onClick={onDetermineWinner} disabled={isLoading}>
            Determine Winner
          </ControlButton>
        )}
        
        <ControlButton onClick={() => navigate('/lobby')}>
          Return to Lobby
        </ControlButton>
      </ControlsContainer>
      
      {/* Show winner if game is completed */}
      {isCompleted && winner && (
        <EmptyState>
          <h2>Game Completed</h2>
          <p>Winner: {formatAddress(winner)}</p>
          <p>Prize: {totalPot} ETH</p>
        </EmptyState>
      )}
    </>
  );
};

export default GameControls;
