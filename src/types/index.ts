export interface WalletState {
  isConnected: boolean;
  address?: string;
  balance?: number;
  publicKey?: string;
  walletId?: string;
  isNewWallet?: boolean;
}

export interface BitcoinTransaction {
  txid: string;
  amount: number;
  confirmations: number;
  timestamp: number;
  type: 'sent' | 'received';
}

export interface TurnkeyWallet {
  organizationId: string;
  userId?: string;
  walletId?: string;
  addresses: string[];
}

export interface BitcoinUTXO {
  txid: string;
  vout: number;
  value: number;
  scriptPubKey: string;
}

export interface WalletCreationResult {
  walletId: string;
  address: string;
  publicKey: string;
  mnemonic?: string; // Only for demo purposes - in production this would be handled by Turnkey
}
