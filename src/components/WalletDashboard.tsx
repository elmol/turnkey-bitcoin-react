import React, { useState, useEffect } from 'react'
// import { useTurnkey } from '@turnkey/sdk-react'
import { getBitcoinBalance, getTransactionHistory } from '../utils/bitcoin'
import type { WalletState, BitcoinTransaction } from '../types'
import WalletConnect from './WalletConnect'
import TransactionList from './TransactionList'
import SendTransaction from './SendTransaction'

const WalletDashboard: React.FC = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false
  })
  const [transactions, setTransactions] = useState<BitcoinTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'send'>('overview')

  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      // For now, we'll skip session checking since the API structure is different
      // In a real implementation, you would check authentication status through the appropriate client
      // await loadWalletData()
    }
    checkSession()
  }, [])

  const loadWalletData = async () => {
    setLoading(true)
    try {
      // This is a simplified example - you'll need to implement actual wallet creation/retrieval
      // For now, we'll simulate having a Bitcoin address
      const mockAddress = 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4' // Example testnet address
      
      const balance = await getBitcoinBalance(mockAddress)
      const txHistory = await getTransactionHistory(mockAddress)
      
      setWalletState({
        isConnected: true,
        address: mockAddress,
        balance,
      })
      
      setTransactions(txHistory)
    } catch (error) {
      console.error('Error loading wallet data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    await loadWalletData()
  }

  if (!walletState.isConnected) {
    return <WalletConnect onConnect={handleConnect} loading={loading} />
  }

  return (
    <div className="wallet-dashboard">
      <div className="wallet-header">
        <div className="wallet-info">
          <h2>Your Wallet</h2>
          <div className="address">
            <strong>Address:</strong> 
            <code>{walletState.address}</code>
            <button 
              onClick={() => navigator.clipboard.writeText(walletState.address || '')}
              className="copy-btn"
            >
              Copy
            </button>
          </div>
          <div className="balance">
            <strong>Balance:</strong> {walletState.balance?.toFixed(8)} BTC
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'transactions' ? 'active' : ''}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button 
          className={activeTab === 'send' ? 'active' : ''}
          onClick={() => setActiveTab('send')}
        >
          Send
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview">
            <div className="stats">
              <div className="stat-card">
                <h3>Balance</h3>
                <p>{walletState.balance?.toFixed(8)} BTC</p>
              </div>
              <div className="stat-card">
                <h3>Recent Transactions</h3>
                <p>{transactions.length}</p>
              </div>
            </div>
            <div className="recent-transactions">
              <h3>Recent Activity</h3>
              <TransactionList transactions={transactions.slice(0, 5)} />
            </div>
          </div>
        )}
        
        {activeTab === 'transactions' && (
          <div className="transactions">
            <h3>All Transactions</h3>
            <TransactionList transactions={transactions} />
          </div>
        )}
        
        {activeTab === 'send' && (
          <div className="send">
            <h3>Send Bitcoin</h3>
            <SendTransaction 
              walletAddress={walletState.address || ''}
              balance={walletState.balance || 0}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default WalletDashboard
