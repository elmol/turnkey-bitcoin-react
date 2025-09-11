# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React application that integrates with Turnkey wallet infrastructure to interact with Bitcoin Testnet4. It's a demo/development Bitcoin wallet showcasing secure wallet connection, balance viewing, transaction history, and sending Bitcoin transactions.

## Common Development Commands

### Development
- `npm run dev` - Start Vite development server on http://localhost:5173
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

### Package Management
- `npm install` - Install all dependencies
- `npm install <package>` - Add new dependencies
- `npm install --save-dev <package>` - Add development dependencies

## Architecture Overview

### Core Technologies
- **React 18** with TypeScript for the frontend
- **Vite** as the build tool and development server
- **Turnkey SDK** (`@turnkey/sdk-browser`, `@turnkey/sdk-react`) for wallet infrastructure
- **bitcoinjs-lib** for Bitcoin utilities and transaction creation
- **Axios** for API communication with Bitcoin testnet services

### Application Structure

The app follows a component-based React architecture:

```
src/
├── components/          # Main UI components
├── config/             # Configuration constants
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Root component with TurnkeyProvider
└── main.tsx           # Application entry point
```

### Key Components Architecture

1. **App.tsx** - Root component that wraps the entire app with `TurnkeyProvider`
2. **WalletDashboard.tsx** - Main dashboard orchestrating wallet state and UI tabs
3. **WalletConnect.tsx** - Handles Turnkey authentication flow
4. **TransactionList.tsx** - Displays Bitcoin transaction history
5. **SendTransaction.tsx** - Form for creating Bitcoin transactions (demo mode)

### Data Flow

1. **Authentication**: Uses Turnkey's React SDK with session management
2. **Bitcoin Integration**: Uses Blockstream API for testnet4 data (balance, transactions, UTXOs)
3. **State Management**: React hooks for local component state, no global state manager
4. **Network**: Currently configured for Bitcoin Testnet4

## Configuration Requirements

### Essential Setup
1. **Turnkey Configuration**: Update `src/config/index.ts` with actual Turnkey organization ID
2. **Bitcoin Network**: Already configured for Testnet4 with Blockstream API endpoints
3. **Environment**: No environment variables currently used (all config in source)

### Development Notes

#### Current Implementation Status
- **Authentication**: Demo mode - needs full Turnkey integration
- **Wallet Creation**: Uses mock address - needs actual Turnkey wallet creation
- **Transaction Signing**: Placeholder implementation - needs Turnkey signing integration
- **UTXO Management**: Basic implementation - needs proper selection and fee calculation

#### API Dependencies
- **Blockstream API**: Used for testnet data (balance, transactions, UTXOs, broadcasting)
- **Endpoints**: All Bitcoin operations use `https://blockstream.info/testnet/api/`
- **Rate Limiting**: No current implementation - consider adding for production

### Key Files for Development

#### Configuration
- `src/config/index.ts` - Turnkey and Bitcoin network configuration
- `vite.config.ts` - Build tool configuration
- `tsconfig.json` - TypeScript configuration

#### Types
- `src/types/index.ts` - Core TypeScript interfaces for wallet state, transactions, and UTXOs

#### Bitcoin Utilities
- `src/utils/bitcoin.ts` - Bitcoin network operations, address creation, transaction handling
- Contains testnet4 network definition and API integration functions

#### Component Integration Points
- **WalletDashboard** manages overall wallet state and coordinates between authentication, balance, and transaction components
- **Bitcoin utilities** are consumed by dashboard for all blockchain operations
- **Turnkey integration** is currently stubbed but uses the official React SDK structure

### Development Workflow

1. **New Features**: Start by updating types in `src/types/index.ts`
2. **Bitcoin Operations**: Extend functions in `src/utils/bitcoin.ts`
3. **UI Components**: Create in `src/components/` following existing patterns
4. **Configuration**: Update `src/config/index.ts` for new settings
5. **Testing**: Manual testing via `npm run dev` (no test suite currently)

### Security Considerations

- Never commit Turnkey organization IDs or sensitive configuration
- All Bitcoin operations are on testnet4 (no mainnet)
- Currently in demo mode - full security audit needed for production
- Private key management handled by Turnkey infrastructure (not in app code)
