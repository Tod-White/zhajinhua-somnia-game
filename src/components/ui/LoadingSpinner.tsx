import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animation keyframes
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Spinner container styles
const SpinnerContainer = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.size === 'small' ? '0.5rem' : props.size === 'medium' ? '1rem' : '2rem'};
`;

// Spinner styles
const Spinner = styled.div<{ size: 'small' | 'medium' | 'large'; color?: string }>`
  width: ${props => props.size === 'small' ? '1.5rem' : props.size === 'medium' ? '3rem' : '5rem'};
  height: ${props => props.size === 'small' ? '1.5rem' : props.size === 'medium' ? '3rem' : '5rem'};
  border-radius: 50%;
  background: transparent;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: ${props => props.color || 'var(--accent-color)'};
  border-left-color: ${props => props.color || 'var(--accent-color)'};
  animation: ${spin} 1s ease-in-out infinite;
  
  @media (max-width: 768px) {
    width: ${props => props.size === 'small' ? '1.5rem' : props.size === 'medium' ? '2.5rem' : '4rem'};
    height: ${props => props.size === 'small' ? '1.5rem' : props.size === 'medium' ? '2.5rem' : '4rem'};
  }
`;

// Message styles
const LoadingMessage = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  margin-left: 1rem;
  font-size: ${props => props.size === 'small' ? '0.9rem' : props.size === 'medium' ? '1rem' : '1.2rem'};
  color: var(--text-secondary);
`;

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
}

/**
 * LoadingSpinner Component
 * Displays an animated loading spinner with optional message
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color,
  message
}) => {
  return (
    <SpinnerContainer size={size}>
      <Spinner size={size} color={color} />
      {message && <LoadingMessage size={size}>{message}</LoadingMessage>}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
