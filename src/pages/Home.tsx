import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useWallet } from '../contexts/WalletContext';

const HomeContainer = styled.div`
  text-align: center;
  padding: 2rem 0;
`;

const HeroSection = styled.section`
  margin-bottom: 3rem;
  animation: fadeIn 0.8s ease-in-out;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  background: var(--gradient-blue-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: var(--gradient-blue-purple);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.1rem;
  text-decoration: none;
  margin: 0 1rem 1rem 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 14px rgba(0, 0, 0, 0.3);
    text-decoration: none;
    color: white;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  background: transparent;
  color: var(--accent-color);
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.1rem;
  text-decoration: none;
  border: 2px solid var(--accent-color);
  margin: 0 0 1rem 0;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-color);
    color: var(--background-color);
    text-decoration: none;
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.section`
  margin-bottom: 3rem;
  animation: slideInUp 1s ease-out;
  animation-fill-mode: both;
  animation-delay: 0.2s;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-top: 3px solid var(--accent-color);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureTitle = styled.h3`
  color: var(--accent-color);
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
`;

const InfoSection = styled.section`
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%);
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 3rem;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border-left: 4px solid var(--secondary-color);
  animation: fadeIn 1.2s ease-in-out;
  animation-fill-mode: both;
  animation-delay: 0.4s;
`;

const InfoTitle = styled.h2`
  color: var(--text-color);
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
`;

const InfoContent = styled.div`
  text-align: left;
  color: var(--text-secondary);
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
`;

/**
 * Home Page Component
 * Landing page for the application
 */
const Home: React.FC = () => {
  const { isConnected } = useWallet();
  
  return (
    <HomeContainer>
      <HeroSection>
        <Title>炸金花 (Zhajinhua) Poker</Title>
        <Subtitle>
          Play the popular Chinese poker game with cryptocurrency stakes on the Somnia blockchain.
          Provably fair gameplay with no backend server required!
        </Subtitle>
        
        {isConnected ? (
          <div>
            <CTAButton to="/lobby">Enter Game Lobby</CTAButton>
            <SecondaryButton to="/profile">My Profile</SecondaryButton>
          </div>
        ) : (
          <Subtitle>Connect your wallet to start playing!</Subtitle>
        )}
      </HeroSection>
      
      <FeaturesSection>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureTitle>Decentralized Gameplay</FeatureTitle>
            <FeatureDescription>
              All game results are recorded on the Somnia blockchain for
              complete transparency and provable fairness.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureTitle>No Backend Required</FeatureTitle>
            <FeatureDescription>
              The game operates entirely client-side with blockchain integration,
              eliminating the need for a central server or authority.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureTitle>Cryptocurrency Stakes</FeatureTitle>
            <FeatureDescription>
              Play with real cryptocurrency stakes. Winnings are automatically
              distributed through smart contracts when the game concludes.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
      
      <InfoSection>
        <InfoTitle>About 炸金花 (Zhajinhua)</InfoTitle>
        <InfoContent>
          <p>
            炸金花 (Zhajinhua), also known as "Poker Fight the Landlord," is a popular Chinese poker game
            played with a standard 52-card deck. Each player receives three cards face down, and the
            objective is to have the highest-ranking hand.
          </p>
          <p>
            Hand rankings (from highest to lowest):
          </p>
          <ol>
            <li><strong>Baozi (Three of a Kind)</strong>: Three cards of the same value</li>
            <li><strong>Jinhua (Straight Flush)</strong>: Three consecutive cards of the same suit</li>
            <li><strong>Shunzi (Straight)</strong>: Three consecutive cards of different suits</li>
            <li><strong>Duizi (Pair)</strong>: Two cards of the same value and one different card</li>
            <li><strong>Single Card</strong>: Ranked by highest card (A is high)</li>
          </ol>
          <p>
            Our implementation brings this classic game to the blockchain, allowing you to play with
            cryptocurrency stakes in a completely decentralized environment. The game results are
            verified and recorded on the Somnia blockchain for transparency.
          </p>
        </InfoContent>
      </InfoSection>
    </HomeContainer>
  );
};

export default Home;
