import React from 'react';
import styled from 'styled-components';
import PlayingCard from './PlayingCard';
import { Player } from '../../contexts/GameContext';

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
  background-color: ${props => props.isActive ? 'rgba(30, 41, 59, 0.9)' : 'rgba(30, 41, 59, 0.6)'};
  padding: 1rem;
  border-radius: 8px;
  width: 220px;
  opacity: ${props => props.isActive ? 1 : 0.7};
  border: ${props => props.isActive ? '2px solid var(--accent-color)' : 'none'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  
  &:hover {
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 180px;
    padding: 0.75rem;
  }
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
      case 'active': return 'var(--success-color)';
      case 'folded': return 'var(--error-color)';
      case 'revealed': return 'var(--primary-color)';
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

interface PlayerSeatProps {
  player: Player;
  position: number;
  isCurrentPlayer: boolean;
}

/**
 * PlayerSeat Component
 * Displays a player's position at the game table with their cards and status
 */
const PlayerSeat: React.FC<PlayerSeatProps> = ({ player, position, isCurrentPlayer }) => {
  // Format player address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Determine player status for display
  const status: 'active' | 'folded' | 'revealed' = 
    player.hasFolded ? 'folded' : 
    player.hasRevealed ? 'revealed' : 'active';

  return (
    <PlayerPosition position={position} className="animate-slide-in">
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
          {player.cards.map((card, index) => (
            <PlayingCard 
              key={index} 
              card={card}
              revealed={player.hasRevealed || isCurrentPlayer}
            />
          ))}
          
          {/* Display placeholder cards if no cards yet */}
          {player.cards.length === 0 && (
            <>
              <PlayingCard revealed={false} />
              <PlayingCard revealed={false} />
              <PlayingCard revealed={false} />
            </>
          )}
        </CardsContainer>
      </PlayerInfo>
    </PlayerPosition>
  );
};

export default PlayerSeat;
