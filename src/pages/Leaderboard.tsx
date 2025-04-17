import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const LeaderboardContainer = styled.div`
  padding: 2rem 0;
`;

const LeaderboardHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: var(--text-color);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  margin-bottom: 2rem;
`;

const TableContainer = styled.div`
  background-color: var(--card-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: var(--secondary-color);
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  color: var(--text-color);
  font-weight: bold;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: var(--text-color);
`;

const AddressCell = styled(TableCell)`
  font-family: monospace;
`;

const RankCell = styled(TableCell)<{ rank: number }>`
  font-weight: bold;
  color: ${props => {
    switch (props.rank) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return '#cd7f32'; // bronze
      default: return 'var(--text-color)';
    }
  }};
`;

const ValueCell = styled(TableCell)`
  color: var(--accent-color);
  font-weight: bold;
`;

const TimePeriodTabs = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
`;

const TimePeriodTab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? 'var(--card-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--accent-color)' : 'var(--text-secondary)'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--accent-color)' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    color: var(--accent-color);
  }
`;

interface LeaderboardEntry {
  rank: number;
  address: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  totalEarnings: number;
}

const Leaderboard: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<'allTime' | 'month' | 'week'>('allTime');
  
  // Mock leaderboard data (would be retrieved from the blockchain in a real app)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      address: '0x1234567890123456789012345678901234567890',
      gamesPlayed: 45,
      gamesWon: 28,
      winRate: 62.2,
      totalEarnings: 5.23
    },
    {
      rank: 2,
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      gamesPlayed: 32,
      gamesWon: 18,
      winRate: 56.3,
      totalEarnings: 3.89
    },
    {
      rank: 3,
      address: '0x9876543210987654321098765432109876543210',
      gamesPlayed: 28,
      gamesWon: 15,
      winRate: 53.6,
      totalEarnings: 2.77
    },
    {
      rank: 4,
      address: '0xfedcbafedcbafedcbafedcbafedcbafedcbafedcba',
      gamesPlayed: 19,
      gamesWon: 10,
      winRate: 52.6,
      totalEarnings: 1.85
    },
    {
      rank: 5,
      address: '0x5555555555555555555555555555555555555555',
      gamesPlayed: 15,
      gamesWon: 7,
      winRate: 46.7,
      totalEarnings: 1.12
    },
    {
      rank: 6,
      address: '0x1111111111111111111111111111111111111111',
      gamesPlayed: 12,
      gamesWon: 5,
      winRate: 41.7,
      totalEarnings: 0.93
    },
    {
      rank: 7,
      address: '0x2222222222222222222222222222222222222222',
      gamesPlayed: 10,
      gamesWon: 4,
      winRate: 40.0,
      totalEarnings: 0.75
    },
    {
      rank: 8,
      address: '0x3333333333333333333333333333333333333333',
      gamesPlayed: 8,
      gamesWon: 3,
      winRate: 37.5,
      totalEarnings: 0.62
    },
    {
      rank: 9,
      address: '0x4444444444444444444444444444444444444444',
      gamesPlayed: 7,
      gamesWon: 2,
      winRate: 28.6,
      totalEarnings: 0.45
    },
    {
      rank: 10,
      address: '0x6666666666666666666666666666666666666666',
      gamesPlayed: 5,
      gamesWon: 1,
      winRate: 20.0,
      totalEarnings: 0.23
    }
  ]);

  // Update leaderboard when time period changes
  useEffect(() => {
    // In a real app, we would fetch different data based on the time period
    // For this MVP, we'll just simulate different data
    
    const mockData = [...leaderboard].map(entry => {
      let modifier = 1;
      
      switch (timePeriod) {
        case 'month':
          modifier = 0.7;
          break;
        case 'week':
          modifier = 0.4;
          break;
        default:
          modifier = 1;
      }
      
      return {
        ...entry,
        gamesPlayed: Math.floor(entry.gamesPlayed * modifier),
        gamesWon: Math.floor(entry.gamesWon * modifier),
        totalEarnings: parseFloat((entry.totalEarnings * modifier).toFixed(2))
      };
    });
    
    // Recalculate win rates
    mockData.forEach(entry => {
      entry.winRate = entry.gamesPlayed > 0 
        ? parseFloat(((entry.gamesWon / entry.gamesPlayed) * 100).toFixed(1)) 
        : 0;
    });
    
    // Sort by total earnings
    mockData.sort((a, b) => b.totalEarnings - a.totalEarnings);
    
    // Update ranks
    mockData.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    setLeaderboard(mockData);
  }, [timePeriod]);
  
  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <LeaderboardContainer>
      <LeaderboardHeader>
        <Title>Leaderboard</Title>
        <Subtitle>
          Top players based on earnings from Zhajinhua games on the Somnia blockchain
        </Subtitle>
        
        <TimePeriodTabs>
          <TimePeriodTab 
            active={timePeriod === 'allTime'} 
            onClick={() => setTimePeriod('allTime')}
          >
            All Time
          </TimePeriodTab>
          <TimePeriodTab 
            active={timePeriod === 'month'} 
            onClick={() => setTimePeriod('month')}
          >
            This Month
          </TimePeriodTab>
          <TimePeriodTab 
            active={timePeriod === 'week'} 
            onClick={() => setTimePeriod('week')}
          >
            This Week
          </TimePeriodTab>
        </TimePeriodTabs>
      </LeaderboardHeader>
      
      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>Rank</TableHeaderCell>
              <TableHeaderCell>Address</TableHeaderCell>
              <TableHeaderCell>Games Played</TableHeaderCell>
              <TableHeaderCell>Games Won</TableHeaderCell>
              <TableHeaderCell>Win Rate</TableHeaderCell>
              <TableHeaderCell>Total Earnings (ETH)</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {leaderboard.map((entry) => (
              <TableRow key={entry.address}>
                <RankCell rank={entry.rank}>#{entry.rank}</RankCell>
                <AddressCell>{formatAddress(entry.address)}</AddressCell>
                <TableCell>{entry.gamesPlayed}</TableCell>
                <TableCell>{entry.gamesWon}</TableCell>
                <TableCell>{entry.winRate}%</TableCell>
                <ValueCell>{entry.totalEarnings.toFixed(2)}</ValueCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </LeaderboardContainer>
  );
};

export default Leaderboard;
