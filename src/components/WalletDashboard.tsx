import React, { useState, useEffect } from 'react'
// import { useTurnkey } from '@turnkey/sdk-react'
import { getBitcoinBalance, getTransactionHistory, loadWalletData as loadWalletDataFromStorage } from '../utils/bitcoin'
import type { WalletState, BitcoinTransaction, WalletCreationResult } from '../types'
import WalletConnect from './WalletConnect'
import TransactionList from './TransactionList'
import SendTransaction from './SendTransaction'
import ExportPrivateKeyModal from './ExportPrivateKeyModal'

const WalletDashboard: React.FC = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false
  })
  const [transactions, setTransactions] = useState<BitcoinTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'send'>('overview')
  const [showNewWalletMessage, setShowNewWalletMessage] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [currentWalletData, setCurrentWalletData] = useState<WalletCreationResult | null>(null)

  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      // For now, we'll skip session checking since the API structure is different
      // In a real implementation, you would check authentication status through the appropriate client
      // await loadWalletData()
    }
    checkSession()
  }, [])

  const loadWalletData = async (walletData?: WalletCreationResult) => {
    setLoading(true)
    try {
      let address: string
      let walletId: string | undefined
      let isNewWallet = false

      if (walletData) {
        // Use the provided wallet data (from wallet creation)
        address = walletData.address
        walletId = walletData.walletId
        isNewWallet = true
        setShowNewWalletMessage(true)
      } else {
        // Load existing wallet or use mock address
        const mockAddress = 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4' // Example testnet address
        address = mockAddress
      }
      
      const balance = await getBitcoinBalance(address)
      const txHistory = await getTransactionHistory(address)
      
      setWalletState({
        isConnected: true,
        address,
        balance,
        walletId,
        isNewWallet,
      })
      
      setTransactions(txHistory)
    } catch (error) {
      console.error('Error loading wallet data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (walletData?: WalletCreationResult) => {
    await loadWalletData(walletData)
  }

  const handleExportPrivateKey = async () => {
    if (!walletState.walletId) {
      console.error('No wallet ID available - using demo mode')
      alert('No wallet ID available. This is demo mode - private key export is only available for newly created wallets. Please create a new wallet to use this feature.')
      return
    }

    try {
      // Load wallet data to get private key
      const walletData = loadWalletDataFromStorage(walletState.walletId as string)
      if (!walletData) {
        console.error('Wallet data not found')
        alert('Wallet data not found. Please create a new wallet first.')
        return
      }

      if (!walletData.privateKey) {
        console.error('No private key available in wallet data')
        alert('No private key available. This wallet was not created with private key export capability.')
        return
      }

      console.log('Loading wallet data for export:', walletData)
      setCurrentWalletData(walletData)
      setShowExportModal(true)
    } catch (error) {
      console.error('Error loading wallet data for export:', error)
      alert('Error loading wallet data: ' + error)
    }
  }

  if (!walletState.isConnected) {
    return <WalletConnect onConnect={handleConnect} loading={loading} />
  }

  return (
    <div className="wallet-dashboard">
      {showNewWalletMessage && walletState.isNewWallet && (
        <div className="new-wallet-notification">
          <div className="notification-content">
            <h3>🎉 New Wallet Created!</h3>
            <p>Your new Bitcoin wallet has been created successfully. You can now start using it on testnet4.</p>
            <button 
              onClick={() => setShowNewWalletMessage(false)}
              className="dismiss-btn"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
      
      <div className="wallet-header">
        <div className="wallet-info">
          <h2>Your Wallet</h2>
          {walletState.walletId && (
            <div className="wallet-id">
              <strong>Wallet ID:</strong> 
              <code>{walletState.walletId}</code>
            </div>
          )}
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
          <div className="wallet-actions">
            <button 
              onClick={handleExportPrivateKey}
              className="export-key-btn"
              title="Export Private Key (Demo Only)"
            >
              🔐 Export Private Key
            </button>
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

      <ExportPrivateKeyModal
        isOpen={showExportModal}
        onClose={() => {
          setShowExportModal(false)
          setCurrentWalletData(null)
        }}
        walletData={currentWalletData}
      />
    </div>
  )
}

export default WalletDashboard
