import * as bitcoin from 'bitcoinjs-lib'
import axios from 'axios'
import { BITCOIN_CONFIG } from '../config'
import { BitcoinTransaction, BitcoinUTXO } from '../types'

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
    
    return transactions.map((tx: any): BitcoinTransaction => ({
      txid: tx.txid,
      amount: calculateTxAmount(tx, address),
      confirmations: tx.status.confirmed ? tx.status.block_height : 0,
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
function calculateTxAmount(tx: any, address: string): number {
  let amount = 0
  
  // Calculate received amount
  tx.vout.forEach((output: any) => {
    if (output.scriptpubkey_address === address) {
      amount += output.value
    }
  })
  
  // Calculate sent amount
  tx.vin.forEach((input: any) => {
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
    
    return utxos.map((utxo: any): BitcoinUTXO => ({
      txid: utxo.txid,
      vout: utxo.vout,
      value: utxo.value,
      scriptPubKey: utxo.scriptpubkey
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
