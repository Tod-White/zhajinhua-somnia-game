import React from 'react';
import styled from 'styled-components';
import PlayerSeat from './PlayerSeat';
import { Player } from '../../contexts/GameContext';

const TableContainer = styled.div`
  background: linear-gradient(135deg, #15803d 0%, #166534 100%);
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
    border-width: 10px;
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
`;

const PlayersContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

interface GameTableProps {
  players: Player[];
  totalPot: number;
  playerIndex: number | null;
}

/**
 * GameTable Component
 * Displays the poker table with player positions and pot amount
 */
const GameTable: React.FC<GameTableProps> = ({ players, totalPot, playerIndex }) => {
  return (
    <TableContainer>
      <Pot className="animate-fade-in">
        Pot: {totalPot} ETH
      </Pot>
      
      <PlayersContainer>
        {players.map((player, index) => {
          // Reorder players so current player is always at bottom position (0)
          let displayPosition = index;
          if (playerIndex !== null) {
            displayPosition = (index - playerIndex + 3) % 3;
          }
          
          const isCurrentPlayer = index === playerIndex;
          
          return (
            <PlayerSeat 
              key={index} 
              player={player}
              position={displayPosition}
              isCurrentPlayer={isCurrentPlayer}
            />
          );
        })}
      </PlayersContainer>
    </TableContainer>
  );
};

export default GameTable;
