# 炸金花 (Zhajinhua) Blockchain Game

A fully decentralized implementation of the popular Chinese poker game 炸金花 (Zhajinhua) with Somnia blockchain integration.

## Overview

This project is a completely client-side implementation of Zhajinhua that uses the Somnia blockchain for critical game data and transactions. No backend server is required as all game logic runs in the browser and important results are stored on-chain.

The game follows the traditional rules of 炸金花 (Zhajinhua), where each player receives three cards and aims to have the highest-ranking hand. Gameplay is conducted through a clean and intuitive user interface, with cryptocurrency stakes and automatic winnings distribution through smart contracts.

## Features

- **Fully Decentralized**: No backend server required
- **Blockchain Integration**: Game results recorded on Somnia blockchain
- **Cryptocurrency Stakes**: Play with real cryptocurrency tokens
- **Wallet Authentication**: Connect with MetaMask or other Web3 wallets
- **Provably Fair**: Game outcomes are transparent and verifiable
- **Responsive Design**: Play on desktop or mobile devices

## Game Rules

炸金花 (Zhajinhua) is played with a standard 52-card deck. Each player receives three cards face down. The goal is to have the highest-ranking hand.

Hand rankings (from highest to lowest):
1. **Baozi (Three of a Kind)**: Three cards of the same value
2. **Jinhua (Straight Flush)**: Three consecutive cards of the same suit
3. **Shunzi (Straight)**: Three consecutive cards of different suits
4. **Duizi (Pair)**: Two cards of the same value and one different card
5. **Single Card**: Ranked by highest card (A is high)

## Technical Architecture

### Client-Side
- **Framework**: React with TypeScript
- **State Management**: React Context API
- **Styling**: Styled Components
- **Routing**: React Router

### Blockchain Integration
- **Network**: Somnia blockchain
- **Smart Contracts**: Solidity
- **Web3 Integration**: ethers.js
- **Authentication**: MetaMask/Web3 wallet

### Game Flow
1. Player creates a game by staking cryptocurrency
2. Other players join by matching the stake
3. When 2-3 players have joined, game starts
4. Cards are generated client-side using cryptographic methods
5. Players can reveal cards or fold
6. Winner is determined and results are recorded on-chain
7. Smart contract automatically distributes winnings

## Development Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MetaMask browser extension
- Somnia network configured in MetaMask

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Tod-White/zhajinhua-somnia-game.git
cd zhajinhua-somnia-game
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Smart Contract Deployment

1. Configure your wallet in `hardhat.config.js`

2. Deploy contracts to Somnia testnet:
```bash
npx hardhat run scripts/deploy.js --network somnia
```

3. Update the contract address in `src/contexts/GameContext.tsx`

## Project Structure

```
zhajinhua-somnia-game/
├── contracts/               # Solidity smart contracts
│   ├── ZhajinhuaGame.sol    # Main game contract
│   └── GameFactory.sol      # Contract factory
├── src/
│   ├── components/          # React components
│   │   ├── game/            # Game-specific components
│   │   └── layout/          # Layout components
│   ├── contexts/            # React context providers
│   │   ├── WalletContext.tsx  # Wallet and blockchain connection
│   │   └── GameContext.tsx    # Game state and logic
│   ├── pages/               # Page components
│   │   ├── Home.tsx         # Landing page
│   │   ├── Game.tsx         # Game interface
│   │   ├── Lobby.tsx        # Game lobby
│   │   ├── Profile.tsx      # User profile
│   │   └── Leaderboard.tsx  # Player rankings
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
└── public/                  # Static assets
```

## Blockchain Implementation

### Smart Contracts
The game uses two main smart contracts:

1. **ZhajinhuaGame.sol**: Handles game creation, joining, and result submission
2. **GameFactory.sol**: Creates and tracks game instances

### On-Chain Data
Only essential game data is stored on-chain:
- Game creation and player participation
- Stakes and pot size 
- Final game results and winner
- Game state (Created, Active, Completed, Cancelled)

### Off-Chain Data
Game-specific logic happens client-side:
- Card generation and shuffling
- Game mechanics (revealing, folding)
- UI rendering and interactions

## Security Considerations

- Player funds are held in the smart contract during gameplay
- Game results verification uses cryptographic proofs
- Client-side random number generation is secured
- Smart contract follows best practices for fund management

## Future Enhancements

- Add spectator mode for non-players
- Implement tournaments with multiple rounds
- Add more game variants (4-card, 5-card)
- Integrate additional blockchain networks
- Implement ENS/domain name resolution for player addresses
- Add social features (friends list, chat)

## License

MIT

## Acknowledgements

- [Somnia Blockchain](https://somnia.network)
- [React.js](https://reactjs.org)
- [ethers.js](https://docs.ethers.io)
- [Styled Components](https://styled-components.com)
