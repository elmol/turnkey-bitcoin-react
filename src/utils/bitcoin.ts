import * as bitcoin from 'bitcoinjs-lib'
import axios from 'axios'
import type { BitcoinTransaction, BitcoinUTXO, WalletCreationResult } from '../types'

// Interface for blockstream API response
interface BlockstreamTransaction {
  txid: string
  status: {
    confirmed: boolean
    block_height?: number
    block_time?: number
  }
  vin: Array<{
    prevout: {
      value: number
      scriptpubkey_address: string
    }
  }>
  vout: Array<{
    value: number
    scriptpubkey_address: string
  }>
}

// Interface for blockstream UTXO response
interface BlockstreamUTXO {
  txid: string
  vout: number
  value: number
  scriptPubKey: string
}

// Bitcoin testnet4 network configuration
export const TESTNET4_NETWORK: bitcoin.Network = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'tb',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
}

// Note: ECPair initialization removed to avoid secp256k1 compatibility issues
// For demo purposes, we use mock wallet generation instead

/**
 * Get Bitcoin address balance from testnet4
 */
export async function getBitcoinBalance(address: string): Promise<number> {
  try {
    // Using Blockstream API for testnet4 (you might need to update this URL)
    const response = await axios.get(`https://blockstream.info/testnet/api/address/${address}`)
    const data = response.data
    return (data.chain_stats.funded_txo_sum + data.mempool_stats.funded_txo_sum) / 100000000 // Convert satoshis to BTC
  } catch (error) {
    console.error('Error fetching balance:', error)
    return 0
  }
}

/**
 * Get transaction history for an address
 */
export async function getTransactionHistory(address: string): Promise<BitcoinTransaction[]> {
  try {
    const response = await axios.get(`https://blockstream.info/testnet/api/address/${address}/txs`)
    const transactions = response.data
    
    return transactions.map((tx: BlockstreamTransaction): BitcoinTransaction => ({
      txid: tx.txid,
      amount: calculateTxAmount(tx, address),
      confirmations: tx.status.confirmed ? (tx.status.block_height || 0) : 0,
      timestamp: tx.status.block_time || Date.now() / 1000,
      type: calculateTxAmount(tx, address) > 0 ? 'received' : 'sent'
    }))
  } catch (error) {
    console.error('Error fetching transaction history:', error)
    return []
  }
}

/**
 * Calculate transaction amount for a specific address
 */
function calculateTxAmount(tx: BlockstreamTransaction, address: string): number {
  let amount = 0
  
  // Calculate received amount
  tx.vout.forEach((output) => {
    if (output.scriptpubkey_address === address) {
      amount += output.value
    }
  })
  
  // Calculate sent amount
  tx.vin.forEach((input) => {
    if (input.prevout && input.prevout.scriptpubkey_address === address) {
      amount -= input.prevout.value
    }
  })
  
  return amount / 100000000 // Convert to BTC
}

/**
 * Get UTXOs for an address
 */
export async function getUTXOs(address: string): Promise<BitcoinUTXO[]> {
  try {
    const response = await axios.get(`https://blockstream.info/testnet/api/address/${address}/utxo`)
    const utxos = response.data
    
    return utxos.map((utxo: BlockstreamUTXO): BitcoinUTXO => ({
      txid: utxo.txid,
      vout: utxo.vout,
      value: utxo.value,
      scriptPubKey: utxo.scriptPubKey
    }))
  } catch (error) {
    console.error('Error fetching UTXOs:', error)
    return []
  }
}

/**
 * Broadcast a transaction to testnet4
 */
export async function broadcastTransaction(rawTx: string): Promise<string> {
  try {
    const response = await axios.post('https://blockstream.info/testnet/api/tx', rawTx, {
      headers: { 'Content-Type': 'text/plain' }
    })
    return response.data
  } catch (error) {
    console.error('Error broadcasting transaction:', error)
    throw error
  }
}

/**
 * Create a Bitcoin address from a public key
 */
export function createAddressFromPublicKey(publicKey: string): string {
  try {
    const pubKeyBuffer = Buffer.from(publicKey, 'hex')
    const { address } = bitcoin.payments.p2wpkh({ 
      pubkey: pubKeyBuffer, 
      network: TESTNET4_NETWORK 
    })
    return address || ''
  } catch (error) {
    console.error('Error creating address:', error)
    return ''
  }
}

/**
 * Generate a new Bitcoin wallet (for demo purposes)
 * In production, this would integrate with Turnkey's wallet creation API
 */
export function createNewWallet(): WalletCreationResult {
  try {
    console.log('Starting wallet creation...')
    
    // For demo purposes, generate a mock wallet without using ECPair
    // This avoids the secp256k1 initialization issues
    console.log('Generating mock wallet for demo...')
    
    // Generate a random wallet ID
    const walletId = `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Generate a mock address (this is just for demo - in production you'd use real key generation)
    const mockAddress = `tb1q${Math.random().toString(36).substr(2, 40)}`
    
    // Generate mock public key (64 hex characters)
    const mockPublicKey = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    
    // Generate mock private key (64 hex characters)
    const mockPrivateKey = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    
    console.log('Mock wallet generated successfully')
    
    return {
      walletId,
      address: mockAddress,
      publicKey: mockPublicKey,
      privateKey: mockPrivateKey,
      // Note: In production, private key and mnemonic would never be exposed to the client
      // This is only for demo purposes
      mnemonic: 'demo-mnemonic-not-for-production-use'
    }
  } catch (error) {
    console.error('Error creating new wallet:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    throw new Error(`Failed to create new wallet: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Check if a wallet exists by attempting to fetch its data
 * In production, this would check against Turnkey's API
 */
export async function checkWalletExists(walletId: string): Promise<boolean> {
  try {
    // For demo purposes, we'll simulate checking if a wallet exists
    // In production, this would make an API call to Turnkey
    const storedWallet = localStorage.getItem(`wallet_${walletId}`)
    return storedWallet !== null
  } catch (error) {
    console.error('Error checking wallet existence:', error)
    return false
  }
}

/**
 * Save wallet data to local storage (for demo purposes)
 * In production, wallet data would be managed by Turnkey
 */
export function saveWalletData(walletData: WalletCreationResult): void {
  try {
    localStorage.setItem(`wallet_${walletData.walletId}`, JSON.stringify(walletData))
  } catch (error) {
    console.error('Error saving wallet data:', error)
  }
}

/**
 * Load wallet data from local storage (for demo purposes)
 * In production, wallet data would be retrieved from Turnkey
 */
export function loadWalletData(walletId: string): WalletCreationResult | null {
  try {
    const storedData = localStorage.getItem(`wallet_${walletId}`)
    return storedData ? JSON.parse(storedData) : null
  } catch (error) {
    console.error('Error loading wallet data:', error)
    return null
  }
}

/**
 * Export private key with security warnings
 * WARNING: This function exposes private keys and should only be used in demo/test environments
 * In production, private keys should never be exported from Turnkey's secure environment
 */
export function exportPrivateKey(walletData: WalletCreationResult): {
  privateKey: string;
  wif: string;
  warnings: string[];
} {
  const warnings = [
    '⚠️ SECURITY WARNING: You are about to export your private key!',
    '🔒 Private keys give full control over your Bitcoin wallet',
    '🚫 Never share your private key with anyone',
    '💾 Store it securely offline (hardware wallet, paper wallet)',
    '🌐 Never enter it on untrusted websites',
    '📱 This is a DEMO function - not for production use',
    '⚡ In production, Turnkey handles key management securely'
  ]

  try {
    if (!walletData.privateKey) {
      throw new Error('Private key not available')
    }

    // For demo purposes, generate a mock WIF
    // In production, this would use real key derivation
    const mockWif = `c${Math.random().toString(36).substr(2, 50)}`

    return {
      privateKey: walletData.privateKey,
      wif: mockWif,
      warnings
    }
  } catch (error) {
    console.error('Error exporting private key:', error)
    throw new Error('Failed to export private key')
  }
}

/**
 * Copy text to clipboard with user feedback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}
