# 炸金花 (Zhajinhua) Blockchain Game

A decentralized implementation of the popular Chinese poker game 炸金花 (Zhajinhua) with Somnia blockchain integration.

## Overview

This project is a fully client-side implementation of Zhajinhua that uses the Somnia blockchain for critical game data and transactions. No backend server is required as game logic runs in the browser and important results are stored on-chain.

## Features

- Play 炸金花 poker with cryptocurrency stakes
- Wallet integration for authentication and transactions
- Provably fair gameplay with cryptographic verification
- On-chain settlement of game results
- Decentralized leaderboard and game history

## Technology Stack

- React.js + TypeScript for the frontend
- Solidity for Somnia blockchain smart contracts
- ethers.js for blockchain interactions
- localStorage for session management

## Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Smart Contract Deployment

See instructions in the `contracts/README.md` file.

## License

MIT
