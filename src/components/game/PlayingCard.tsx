import React from 'react';
import styled from 'styled-components';
import { Card as CardType } from '../../contexts/GameContext';

const CardContainer = styled.div<{ revealed: boolean }>`
  width: 80px;
  height: 120px;
  border-radius: 8px;
  background-color: ${props => props.revealed ? 'white' : '#1e40af'};
  border: 1px solid #ccc;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  ${props => !props.revealed && `
    background-image: linear-gradient(45deg, #1e40af 25%, #0f172a 25%, #0f172a 50%, #1e40af 50%, #1e40af 75%, #0f172a 75%, #0f172a 100%);
    background-size: 20px 20px;
  `}
`;

const CardValue = styled.div<{ color: string }>`
  color: ${props => props.color};
  font-size: 2rem;
  font-weight: bold;
`;

const CardSuitTop = styled.div<{ color: string }>`
  position: absolute;
  top: 8px;
  left: 8px;
  color: ${props => props.color};
  font-size: 1.2rem;
`;

const CardSuitBottom = styled.div<{ color: string }>`
  position: absolute;
  bottom: 8px;
  right: 8px;
  color: ${props => props.color};
  font-size: 1.2rem;
  transform: rotate(180deg);
`;

interface PlayingCardProps {
  card?: CardType;
  revealed: boolean;
}

const PlayingCard: React.FC<PlayingCardProps> = ({ card, revealed }) => {
  // Return back of card if not revealed or no card
  if (!revealed || !card) {
    return <CardContainer revealed={false} />;
  }
  
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
    return suit === 'hearts' || suit === 'diamonds' ? '#e11d48' : '#000';
  };
  
  const cardDisplay = getCardDisplay(card);
  const cardSuit = getCardSuit(card.suit);
  const cardColor = getCardColor(card.suit);

  return (
    <CardContainer revealed={true}>
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
