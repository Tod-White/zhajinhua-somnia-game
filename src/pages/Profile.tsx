import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useWallet } from '../contexts/WalletContext';
import { useGame } from '../contexts/GameContext';

const ProfileContainer = styled.div`
  padding: 2rem 0;
`;

const ProfileHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: var(--text-color);
  margin-bottom: 0.5rem;
`;

const AccountSection = styled.div`
  background-color: var(--card-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const AccountDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  border-left: 3px solid var(--accent-color);
  padding-left: 1rem;
`;

const DetailLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const DetailValue = styled.div`
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: bold;
  word-break: break-all;
`;

const NetworkBadge = styled.span<{ isCorrect: boolean }>`
  background-color: ${props => props.isCorrect ? 'var(--success-color)' : 'var(--error-color)'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-left: 1rem;
`;

const ActionButton = styled.button`
  background-color: var(--accent-color);
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #ffc107;
  }
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const GameHistorySection = styled.div`
  margin-bottom: 2rem;
`;

const GamesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const GameCard = styled.div`
  background-color: var(--card-color);
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const GameCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const GameId = styled.span`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const GameStatus = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: ${props => {
    switch (props.status) {
      case 'Created': return '#3b82f6';
      case 'Active': return '#10b981';
      case 'Completed': return '#6b7280';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  color: white;
`;

const StakeAmount = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
`;

const GameResult = styled.div<{ isWinner: boolean }>`
  margin-top: 1rem;
  font-weight: ${props => props.isWinner ? 'bold' : 'normal'};
  color: ${props => props.isWinner ? 'var(--success-color)' : 'var(--text-secondary)'};
`;

const ViewGameLink = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  color: var(--accent-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--card-color);
  border-radius: 8px;
  color: var(--text-secondary);
`;

const StatisticsSection = styled.div`
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background-color: var(--card-color);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

interface GameHistoryItem {
  gameId: string;
  stake: number;
  status: string;
  players: string[];
  winner?: string;
  createdAt: number;
}

const Profile: React.FC = () => {
  const { account, balance, isConnected, isCorrectNetwork, switchNetwork } = useWallet();
  const { playerGames, isLoading } = useGame();
  
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    gamesWon: 0,
    totalEarnings: 0,
    totalStaked: 0
  });

  // Load player's game history when component mounts
  useEffect(() => {
    if (isConnected && account) {
      // In a real app, we would load this data from the blockchain
      // For the MVP, we'll use mock data
      const mockGameHistory: GameHistoryItem[] = [
        {
          gameId: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          stake: 0.01,
          status: 'Completed',
          players: [account, '0xabc...123', '0xdef...456'],
          winner: account,
          createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2 // 2 days ago
        },
        {
          gameId: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          stake: 0.05,
          status: 'Completed',
          players: [account, '0x789...abc'],
          winner: '0x789...abc',
          createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5 // 5 days ago
        },
        {
          gameId: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
          stake: 0.02,
          status: 'Active',
          players: [account, '0xfed...cba'],
          createdAt: Date.now() - 1000 * 60 * 30 // 30 minutes ago
        }
      ];
      
      setGameHistory(mockGameHistory);
      
      // Calculate statistics
      const totalGames = mockGameHistory.length;
      const gamesWon = mockGameHistory.filter(game => game.winner === account).length;
      
      let totalEarnings = 0;
      let totalStaked = 0;
      
      mockGameHistory.forEach(game => {
        // Add to total staked
        totalStaked += game.stake;
        
        // Add to earnings if player won
        if (game.winner === account) {
          // Winner takes all players' stakes
          totalEarnings += game.stake * game.players.length;
        }
      });
      
      setStats({
        totalGames,
        gamesWon,
        totalEarnings,
        totalStaked
      });
    }
  }, [isConnected, account, playerGames]);

  // Format address for display
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format gameId for display
  const formatGameId = (id: string) => {
    return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
  };

  if (!isConnected) {
    return (
      <ProfileContainer>
        <EmptyState>
          <h2>Connect your wallet to view your profile</h2>
        </EmptyState>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Title>My Profile</Title>
      </ProfileHeader>
      
      <AccountSection>
        <AccountDetails>
          <DetailItem>
            <DetailLabel>Account Address</DetailLabel>
            <DetailValue>
              {account}
              {!isCorrectNetwork && (
                <NetworkBadge isCorrect={isCorrectNetwork}>
                  Wrong Network
                </NetworkBadge>
              )}
            </DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Account Balance</DetailLabel>
            <DetailValue>{balance} ETH</DetailValue>
          </DetailItem>
        </AccountDetails>
        
        {!isCorrectNetwork && (
          <ActionButton onClick={switchNetwork}>
            Switch to Somnia Network
          </ActionButton>
        )}
      </AccountSection>
      
      <StatisticsSection>
        <h2>Statistics</h2>
        <StatsGrid>
          <StatCard>
            <StatValue>{stats.totalGames}</StatValue>
            <StatLabel>Total Games</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{stats.gamesWon}</StatValue>
            <StatLabel>Games Won</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{stats.totalEarnings.toFixed(3)}</StatValue>
            <StatLabel>Total Earnings (ETH)</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{stats.totalStaked.toFixed(3)}</StatValue>
            <StatLabel>Total Staked (ETH)</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatisticsSection>
      
      <GameHistorySection>
        <h2>Game History</h2>
        
        {isLoading ? (
          <EmptyState>Loading game history...</EmptyState>
        ) : gameHistory.length === 0 ? (
          <EmptyState>You haven't played any games yet.</EmptyState>
        ) : (
          <GamesList>
            {gameHistory.map((game) => (
              <GameCard key={game.gameId}>
                <GameCardHeader>
                  <GameId>{formatGameId(game.gameId)}</GameId>
                  <GameStatus status={game.status}>{game.status}</GameStatus>
                </GameCardHeader>
                
                <StakeAmount>{game.stake} ETH</StakeAmount>
                
                <div>Players: {game.players.length}</div>
                
                {game.status === 'Completed' && (
                  <GameResult isWinner={game.winner === account}>
                    {game.winner === account 
                      ? `You won ${(game.stake * game.players.length).toFixed(3)} ETH!` 
                      : `Winner: ${formatAddress(game.winner || '')}`}
                  </GameResult>
                )}
                
                <ViewGameLink to={`/game/${game.gameId}`}>
                  {game.status === 'Active' ? 'Continue Game' : 'View Game Details'}
                </ViewGameLink>
              </GameCard>
            ))}
          </GamesList>
        )}
      </GameHistorySection>
    </ProfileContainer>
  );
};

export default Profile;
