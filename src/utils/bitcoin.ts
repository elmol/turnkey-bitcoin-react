import * as bitcoin from 'bitcoinjs-lib'
import ECPairFactory from 'ecpair'
import * as secp256k1 from '@bitcoinerlab/secp256k1'
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

// Create ECPair instance with secp256k1 implementation
const ECPair = ECPairFactory(secp256k1)

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
    // Generate a random key pair for demo purposes
    // In production, this would be handled by Turnkey's secure key generation
    // For bitcoinjs-lib v6, we need to generate random bytes and create the key pair manually
    const privateKeyBytes = new Uint8Array(32)
    crypto.getRandomValues(privateKeyBytes)
    const privateKey = Buffer.from(privateKeyBytes)
    const keyPair = ECPair.fromPrivateKey(privateKey, { network: TESTNET4_NETWORK })
    const publicKey = Buffer.from(keyPair.publicKey).toString('hex')
    const address = createAddressFromPublicKey(publicKey)
    
    // Generate a mock wallet ID (in production, this would come from Turnkey)
    const walletId = `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      walletId,
      address,
      publicKey,
      privateKey: privateKey.toString('hex'),
      // Note: In production, private key and mnemonic would never be exposed to the client
      // This is only for demo purposes
      mnemonic: 'demo-mnemonic-not-for-production-use'
    }
  } catch (error) {
    console.error('Error creating new wallet:', error)
    throw new Error('Failed to create new wallet')
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

    // Convert hex private key to WIF (Wallet Import Format)
    const privateKeyBuffer = Buffer.from(walletData.privateKey, 'hex')
    const keyPair = ECPair.fromPrivateKey(privateKeyBuffer, { network: TESTNET4_NETWORK })
    const wif = keyPair.toWIF()

    return {
      privateKey: walletData.privateKey,
      wif,
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
