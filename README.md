# Turnkey Bitcoin React Wallet

A React application that integrates with Turnkey wallet infrastructure to interact with Bitcoin Testnet4.

## Features

- 🔐 Secure wallet connection using Turnkey SDK
- ₿ Bitcoin Testnet4 integration
- 📱 Modern React UI with TypeScript
- 💰 View wallet balance and transaction history
- 📤 Send Bitcoin transactions (demo mode)
- 🔍 View transactions on block explorer

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- A Turnkey account and organization ID

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure Turnkey settings:
   - Open `src/config/index.ts`
   - Replace `YOUR_ORGANIZATION_ID` with your actual Turnkey organization ID
   - Update other configuration values as needed

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## Configuration

### Turnkey Setup

1. Create a Turnkey account at [turnkey.com](https://turnkey.com)
2. Set up your organization and get your organization ID
3. Configure authentication methods (email, passkey, etc.)
4. Update the configuration in `src/config/index.ts`

### Bitcoin Testnet4

This application connects to Bitcoin Testnet4, which is a test network for Bitcoin. Testnet coins have no real value and are used for development and testing purposes.

The app uses Blockstream's API for testnet data, but you may need to update the endpoints in `src/utils/bitcoin.ts` for production use.

## Project Structure

```
src/
├── components/          # React components
│   ├── WalletDashboard.tsx
│   ├── WalletConnect.tsx
│   ├── TransactionList.tsx
│   └── SendTransaction.tsx
├── config/             # Configuration files
│   └── index.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── bitcoin.ts
├── App.tsx             # Main app component
└── main.tsx           # App entry point
```

## Key Components

### WalletDashboard
Main dashboard showing wallet information, balance, and transaction tabs.

### WalletConnect
Authentication component for connecting to Turnkey wallet.

### TransactionList
Displays Bitcoin transaction history with status and details.

### SendTransaction
Form for creating and sending Bitcoin transactions (currently in demo mode).

## Development Notes

### Authentication
Currently in demo mode. To implement full authentication:

1. Set up proper Turnkey authentication flows
2. Implement wallet creation/retrieval
3. Connect signing operations to Turnkey infrastructure

### Transaction Signing
The current implementation includes placeholders for transaction creation and signing. To complete this:

1. Implement UTXO fetching and selection
2. Create proper Bitcoin transactions using bitcoinjs-lib
3. Integrate with Turnkey's signing infrastructure
4. Add proper fee calculation

### API Integration
The app currently uses Blockstream's public API for testnet data. Consider:

1. Adding error handling and retry logic
2. Implementing rate limiting
3. Adding support for multiple API providers
4. Caching frequently requested data

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Turnkey SDK** - Wallet infrastructure
- **bitcoinjs-lib** - Bitcoin utilities
- **Axios** - HTTP client

## Security Considerations

- Never commit private keys or sensitive configuration
- Always validate user inputs
- Use HTTPS in production
- Implement proper error handling
- Regularly update dependencies

## License

MIT License

## Support

For Turnkey-specific issues, consult the [Turnkey documentation](https://docs.turnkey.com/).

For Bitcoin development resources, see [Bitcoin Developer Guide](https://developer.bitcoin.org/).

## Disclaimer

This is a development/demo application. Do not use with real Bitcoin or in production without proper security audits and testing.
