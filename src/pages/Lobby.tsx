import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useWallet } from '../contexts/WalletContext';
import { useGame, GameStatus } from '../contexts/GameContext';

const LobbyContainer = styled.div`
  padding: 2rem 0;
`;

const LobbyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  color: var(--text-color);
`;

const CreateGameButton = styled.button`
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

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--card-color);
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
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
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 1rem;
`;

const PlayersInfo = styled.div`
  margin-bottom: 1rem;
`;

const PlayersList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0.5rem 0;
`;

const PlayerItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const JoinButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--accent-color);
  color: #000;
  border: none;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
`;

const CreateGameModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--card-color);
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  color: var(--text-color);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: var(--text-color);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--background-color);
  border: 1px solid var(--text-secondary);
  border-radius: 4px;
  color: var(--text-color);
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const ModalButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--accent-color);
  color: #000;
  border: none;
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

const ErrorMessage = styled.div`
  color: var(--error-color);
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

interface GameItem {
  gameId: string;
  stake: number;
  players: string[];
  status: string;
  createdAt: number;
}

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, account } = useWallet();
  const { 
    createGame,
    joinGame,
    playerGames,
    isLoading,
    error
  } = useGame();
  
  const [activeTab, setActiveTab] = useState<'open' | 'my'>('open');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('0.01');
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Mock game data for demonstration (will be replaced with actual data)
  const [openGames, setOpenGames] = useState<GameItem[]>([
    {
      gameId: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      stake: 0.01,
      players: ['0xabc...123', '0xdef...456'],
      status: 'Created',
      createdAt: Date.now() - 1000 * 60 * 5 // 5 minutes ago
    },
    {
      gameId: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      stake: 0.05,
      players: ['0x789...abc'],
      status: 'Created',
      createdAt: Date.now() - 1000 * 60 * 15 // 15 minutes ago
    }
  ]);
  
  const [myGames, setMyGames] = useState<GameItem[]>([]);

  // When playerGames changes, we would load the actual game data
  useEffect(() => {
    // TODO: Load actual game data from blockchain
    // This is a placeholder that would be replaced with actual API calls
    console.log('Player games changed:', playerGames);
    
    // Mock my games for demonstration
    if (isConnected && account) {
      setMyGames([
        {
          gameId: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
          stake: 0.02,
          players: [account, '0xfed...cba'],
          status: 'Active',
          createdAt: Date.now() - 1000 * 60 * 30 // 30 minutes ago
        }
      ]);
    }
  }, [playerGames, isConnected, account]);

  const handleCreateGame = async () => {
    setLocalError(null);
    
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setLocalError('Please enter a valid stake amount');
      return;
    }
    
    try {
      const gameId = await createGame(stakeAmount);
      if (gameId) {
        setShowCreateModal(false);
        navigate(`/game/${gameId}`);
      }
    } catch (err) {
      setLocalError('Failed to create game. Please try again.');
      console.error(err);
    }
  };

  const handleJoinGame = async (gameId: string, stake: number) => {
    try {
      const joined = await joinGame(gameId, stake.toString());
      if (joined) {
        navigate(`/game/${gameId}`);
      }
    } catch (err) {
      console.error('Error joining game:', err);
    }
  };

  const formatGameId = (id: string) => {
    return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  return (
    <LobbyContainer>
      <LobbyHeader>
        <Title>Game Lobby</Title>
        <CreateGameButton
          onClick={() => setShowCreateModal(true)}
          disabled={!isConnected}
        >
          Create New Game
        </CreateGameButton>
      </LobbyHeader>
      
      <TabsContainer>
        <Tab
          active={activeTab === 'open'}
          onClick={() => setActiveTab('open')}
        >
          Open Games
        </Tab>
        <Tab
          active={activeTab === 'my'}
          onClick={() => setActiveTab('my')}
        >
          My Games
        </Tab>
      </TabsContainer>
      
      {isLoading ? (
        <EmptyState>Loading games...</EmptyState>
      ) : error ? (
        <EmptyState>Error loading games: {error}</EmptyState>
      ) : (
        <GamesList>
          {activeTab === 'open' && openGames.length === 0 && (
            <EmptyState>No open games available. Create a new game!</EmptyState>
          )}
          
          {activeTab === 'my' && myGames.length === 0 && (
            <EmptyState>You aren't participating in any games yet.</EmptyState>
          )}
          
          {activeTab === 'open' && openGames.map(game => (
            <GameCard key={game.gameId}>
              <GameCardHeader>
                <GameId>{formatGameId(game.gameId)}</GameId>
                <GameStatus status={game.status}>{game.status}</GameStatus>
              </GameCardHeader>
              
              <StakeAmount>{game.stake} ETH</StakeAmount>
              
              <PlayersInfo>
                <span>Players: {game.players.length}/3</span>
                <PlayersList>
                  {game.players.map((player, index) => (
                    <PlayerItem key={index}>{player}</PlayerItem>
                  ))}
                </PlayersList>
              </PlayersInfo>
              
              <div>Created {formatTimeAgo(game.createdAt)}</div>
              
              <JoinButton
                onClick={() => handleJoinGame(game.gameId, game.stake)}
                disabled={!isConnected || game.status !== 'Created' || game.players.includes(account || '')}
              >
                Join Game
              </JoinButton>
            </GameCard>
          ))}
          
          {activeTab === 'my' && myGames.map(game => (
            <GameCard key={game.gameId}>
              <GameCardHeader>
                <GameId>{formatGameId(game.gameId)}</GameId>
                <GameStatus status={game.status}>{game.status}</GameStatus>
              </GameCardHeader>
              
              <StakeAmount>{game.stake} ETH</StakeAmount>
              
              <PlayersInfo>
                <span>Players: {game.players.length}/3</span>
                <PlayersList>
                  {game.players.map((player, index) => (
                    <PlayerItem key={index}>{player}</PlayerItem>
                  ))}
                </PlayersList>
              </PlayersInfo>
              
              <div>Created {formatTimeAgo(game.createdAt)}</div>
              
              <JoinButton
                onClick={() => navigate(`/game/${game.gameId}`)}
              >
                {game.status === 'Created' ? 'Join Game' : 'Continue Game'}
              </JoinButton>
            </GameCard>
          ))}
        </GamesList>
      )}
      
      {showCreateModal && (
        <CreateGameModal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Create New Game</ModalTitle>
              <CloseButton onClick={() => setShowCreateModal(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label htmlFor="stakeAmount">Stake Amount (ETH)</Label>
              <Input
                id="stakeAmount"
                type="number"
                step="0.001"
                min="0.001"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
              />
            </FormGroup>
            
            {localError && <ErrorMessage>{localError}</ErrorMessage>}
            
            <ModalButton onClick={handleCreateGame} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Game'}
            </ModalButton>
          </ModalContent>
        </CreateGameModal>
      )}
    </LobbyContainer>
  );
};

export default Lobby;
