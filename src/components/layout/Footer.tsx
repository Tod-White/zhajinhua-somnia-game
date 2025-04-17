import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--card-color);
  padding: 1.5rem 0;
  margin-top: 2rem;
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
`;

const FooterLink = styled.a`
  color: var(--text-secondary);
  text-decoration: none;
  
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
  color: var(--text-secondary);
`;

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
        
        <BlockchainInfo>
          Running on the Somnia blockchain network
        </BlockchainInfo>
        
        <Copyright>
          &copy; {currentYear} 炸金花 Poker Game. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
