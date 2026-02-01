# NeonLedger - Web3 Event Logger

A frontend-only Web3 application that connects MetaMask to Polygon Amoy testnet and interacts with an EventLogger smart contract. Events emitted from the contract are indexed directly to a Neon Postgres database from the browser.

## Architecture

This application demonstrates a **serverless Web3 pattern**:

- **Frontend**: React + Vite with ethers.js for blockchain interaction
- **Blockchain**: Polygon Amoy testnet (Chain ID: 80002)
- **Database**: Neon Postgres via `@neondatabase/serverless` (direct browser connection)
- **Backend**: None - fully frontend-only architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React App     │────▶│  Polygon Amoy    │     │  Neon Postgres  │
│   (Browser)     │◀────│  (Blockchain)    │     │   (Database)    │
└────────┬────────┘     └──────────────────┘     └────────▲────────┘
         │                                                 │
         └─────────────────────────────────────────────────┘
                    Direct WebSocket Connection
```

## Features

- Connect MetaMask wallet to Polygon Amoy testnet
- Deploy or interact with EventLogger smart contract
- Log messages on-chain with real-time event indexing
- Activity feed showing blockchain events with accurate timestamps
- System health dashboard (Network, Database, Contract status)
- Dark theme with neon/cyberpunk aesthetic

## Smart Contract

The EventLogger contract is deployed at:
```
0xa8455de1443978c519c770D6c39513dbb13B97d6
```

### Contract Interface
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EventLogger {
    event ActionLogged(address indexed user, string action, uint256 timestamp);
    
    function log(string calldata action) external {
        emit ActionLogged(msg.sender, action, block.timestamp);
    }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_DATABASE_URL` | Neon Postgres connection string |

## Database Schema

```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    user_address TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    block_timestamp TIMESTAMP,
    tx_hash TEXT
);
```

## Getting Started

### Prerequisites

- MetaMask browser extension
- MATIC tokens on Polygon Amoy testnet (for gas fees)
- Neon Postgres database

### Getting Testnet MATIC

1. Visit [Polygon Amoy Faucet](https://faucet.polygon.technology/)
2. Enter your wallet address
3. Request testnet MATIC tokens

### Running the App

1. Set the `VITE_DATABASE_URL` environment variable
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Connect your MetaMask wallet
4. Switch to Polygon Amoy network (the app will prompt you)
5. Start logging actions on-chain

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActionLogger.tsx    # Transaction form
│   │   │   ├── EventFeed.tsx       # Activity feed
│   │   │   ├── StatusCard.tsx      # System health
│   │   │   └── Navbar.tsx          # Navigation
│   │   ├── hooks/
│   │   │   ├── use-web3.ts         # Blockchain connection
│   │   │   └── use-events.ts       # Database operations
│   │   ├── pages/
│   │   │   ├── dashboard.tsx       # Main dashboard
│   │   │   └── activity.tsx        # Activity feed page
│   │   └── contracts/
│   │       └── EventLogger.json    # Contract ABI
│   └── index.html
├── contracts/
│   └── EventLogger.sol             # Smart contract source
└── scripts/
    └── deploy-contract.mjs         # Deployment script
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **ethers.js v6** - Ethereum library
- **@neondatabase/serverless** - Postgres driver for browsers
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **date-fns** - Date formatting
- **wouter** - Routing

## Security Considerations

This app connects directly to the database from the browser. For production use:

1. Implement Row-Level Security (RLS) on your Neon database
2. Use read-only database credentials for public access
3. Consider adding authentication via Replit Auth or similar

## License

MIT
