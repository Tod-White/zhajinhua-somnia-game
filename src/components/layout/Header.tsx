import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useWallet } from '../../contexts/WalletContext';

const HeaderContainer = styled.header`
  background-color: var(--card-color);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: none;
    color: var(--accent-color);
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  margin-left: 1.5rem;
  color: var(--text-color);
  text-decoration: none;
  
  &:hover {
    color: var(--accent-color);
    text-decoration: none;
  }
`;

const WalletButton = styled.button`
  background-color: ${props => props.disabled ? '#555' : 'var(--accent-color)'};
  color: #000;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.disabled ? '#555' : '#ffc107'};
  }
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
`;

const AccountAddress = styled.span`
  margin-right: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const NetworkBadge = styled.span<{ isCorrect: boolean }>`
  background-color: ${props => props.isCorrect ? 'var(--success-color)' : 'var(--error-color)'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 1rem;
`;

const Header: React.FC = () => {
  const { 
    account, 
    isConnected, 
    isConnecting, 
    connectWallet, 
    disconnectWallet,
    isCorrectNetwork,
    switchNetwork
  } = useWallet();
  
  // Format address for display (0x1234...5678)
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">炸金花 Poker</Logo>
        
        <Nav>
          <NavLink to="/lobby">Game Lobby</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          {isConnected && <NavLink to="/profile">My Profile</NavLink>}
        </Nav>
        
        <div>
          {isConnected && account ? (
            <AccountInfo>
              <NetworkBadge isCorrect={isCorrectNetwork}>
                {isCorrectNetwork ? 'Somnia' : 'Wrong Network'}
              </NetworkBadge>
              
              <AccountAddress>{formatAddress(account)}</AccountAddress>
              
              {!isCorrectNetwork && (
                <WalletButton onClick={switchNetwork}>
                  Switch Network
                </WalletButton>
              )}
              
              <WalletButton onClick={disconnectWallet}>
                Disconnect
              </WalletButton>
            </AccountInfo>
          ) : (
            <WalletButton 
              onClick={connectWallet} 
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </WalletButton>
          )}
        </div>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
