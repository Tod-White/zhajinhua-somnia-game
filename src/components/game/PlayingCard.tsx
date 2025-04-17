import React from 'react';
import styled from 'styled-components';
import { Card as CardType } from '../../contexts/GameContext';

// Card container with responsive sizing
const CardContainer = styled.div<{ revealed: boolean }>`
  width: 80px;
  height: 120px;
  border-radius: 8px;
  background-color: ${props => props.revealed ? 'white' : 'var(--primary-dark)'};
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }
  
  /* Card back pattern */
  ${props => !props.revealed && `
    background-image: linear-gradient(
      135deg, 
      var(--primary-dark) 25%, 
      var(--secondary-dark) 25%, 
      var(--secondary-dark) 50%, 
      var(--primary-dark) 50%, 
      var(--primary-dark) 75%, 
      var(--secondary-dark) 75%, 
      var(--secondary-dark) 100%
    );
    background-size: 20px 20px;
  `}
  
  @media (max-width: 768px) {
    width: 60px;
    height: 90px;
  }
`;

// Card value styling
const CardValue = styled.div<{ color: string }>`
  color: ${props => props.color};
  font-size: 1.8rem;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Top suit indicator
const CardSuitTop = styled.div<{ color: string }>`
  position: absolute;
  top: 8px;
  left: 8px;
  color: ${props => props.color};
  font-size: 1.2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    top: 5px;
    left: 5px;
  }
`;

// Bottom suit indicator (rotated)
const CardSuitBottom = styled.div<{ color: string }>`
  position: absolute;
  bottom: 8px;
  right: 8px;
  color: ${props => props.color};
  font-size: 1.2rem;
  transform: rotate(180deg);
  
  @media (max-width: 768px) {
    font-size: 1rem;
    bottom: 5px;
    right: 5px;
  }
`;

interface PlayingCardProps {
  card?: CardType;
  revealed: boolean;
}

/**
 * PlayingCard Component
 * Renders a playing card with either the card face or card back
 */
const PlayingCard: React.FC<PlayingCardProps> = ({ card, revealed }) => {
  // Return card back if not revealed or no card data
  if (!revealed || !card) {
    return <CardContainer revealed={false} />;
  }
  
  // Convert card value to display value (A, K, Q, J or number)
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

  // Convert suit to symbol
  const getCardSuit = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  // Get color based on suit (red or black)
  const getCardColor = (suit: string) => {
    return suit === 'hearts' || suit === 'diamonds' ? '#e11d48' : '#000';
  };
  
  const cardDisplay = getCardDisplay(card);
  const cardSuit = getCardSuit(card.suit);
  const cardColor = getCardColor(card.suit);

  return (
    <CardContainer revealed={true} className="animate-fade-in">
      <CardValue color={cardColor}>
        {cardDisplay}
      </CardValue>
      <CardSuitTop color={cardColor}>
        {cardSuit}
      </CardSuitTop>
      <CardSuitBottom color={cardColor}>
        {cardSuit}
      </CardSuitBottom>
    </CardContainer>
  );
};

export default PlayingCard;
