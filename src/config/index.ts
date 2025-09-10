export const TURNKEY_CONFIG = {
  // You'll need to replace these with your actual Turnkey configuration
  API_BASE_URL: 'https://api.turnkey.com',
  DEFAULT_ORGANIZATION_ID: 'YOUR_ORGANIZATION_ID', // Replace with your org ID
  // Add your Turnkey app ID and other config as needed
}

export const BITCOIN_CONFIG = {
  NETWORK: 'testnet4' as const,
  // Bitcoin testnet4 RPC endpoints - replace with actual testnet4 endpoints
  RPC_URLS: [
    'https://testnet4-electrum.blockstream.info:60012',
    // Add more testnet4 endpoints as needed
  ],
  EXPLORER_URL: 'https://mempool.space/testnet4',
}

export const APP_CONFIG = {
  NAME: 'Turnkey Bitcoin Wallet',
  VERSION: '1.0.0',
}
