import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: var(--gradient-dark);
  padding: 1.5rem 0;
  margin-top: 2rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin: 1rem 0;
  
  @media (max-width: 580px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const FooterLink = styled.a`
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--accent-color);
  }
`;

const Copyright = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 1rem;
`;

const BlockchainInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border-radius: 4px;
  color: var(--accent-color);
`;

const SomniaLogo = styled.span`
  background: var(--gradient-blue-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
`;

/**
 * Footer Component
 * Site footer with links and blockchain information
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLinks>
          <FooterLink href="#" target="_blank" rel="noopener noreferrer">
            Game Rules
          </FooterLink>
          <FooterLink href="#" target="_blank" rel="noopener noreferrer">
            Smart Contract
          </FooterLink>
          <FooterLink href="#" target="_blank" rel="noopener noreferrer">
            About Somnia
          </FooterLink>
        </FooterLinks>
        
        <BlockchainInfo className="animate-fade-in">
          Running on the <SomniaLogo>Somnia</SomniaLogo> blockchain network
        </BlockchainInfo>
        
        <Copyright>
          &copy; {currentYear} 炸金花 Poker Game. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
