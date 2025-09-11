import React, { useState } from 'react'
// @ts-ignore
import { useTurnkey } from '@turnkey/sdk-react'
import { createNewWallet, saveWalletData } from '../utils/bitcoin'
import type { WalletCreationResult } from '../types'

interface WalletConnectProps {
  onConnect: (walletData?: WalletCreationResult) => void
  loading: boolean
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, loading }) => {
  const { } = useTurnkey()
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [walletName, setWalletName] = useState('')
  const [creatingWallet, setCreatingWallet] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async () => {
    try {
      // This is a basic example - you'll need to implement proper authentication
      // based on your Turnkey setup (email, passkey, etc.)
      console.log('Connecting to Turnkey wallet...')
      
      // For now, we'll just call the onConnect callback
      // In a real implementation, you would authenticate with Turnkey first
      onConnect()
    } catch (error) {
      console.error('Error connecting to wallet:', error)
    }
  }

  const handleEmailAuth = async () => {
    try {
      // Example email authentication - replace with your implementation
      const email = prompt('Enter your email:')
      if (!email) return

      console.log('Authenticating with email:', email)
      // Implement Turnkey email authentication here
      // This would typically involve calling Turnkey's auth methods
      
      onConnect()
    } catch (error) {
      console.error('Email authentication failed:', error)
    }
  }

  const handlePasskeyAuth = async () => {
    try {
      console.log('Authenticating with passkey...')
      // Implement Turnkey passkey authentication here
      // This would typically involve WebAuthn/passkey flows
      
      onConnect()
    } catch (error) {
      console.error('Passkey authentication failed:', error)
    }
  }

  const handleCreateWallet = async () => {
    if (!walletName.trim()) {
      setError('Please enter a wallet name')
      return
    }

    setCreatingWallet(true)
    setError('')

    try {
      console.log('Creating new wallet:', walletName)
      
      // Create new wallet
      const walletData = createNewWallet()
      
      // Save wallet data (in production, this would be handled by Turnkey)
      saveWalletData(walletData)
      
      console.log('Wallet created successfully:', walletData.walletId)
      
      // Call onConnect with the new wallet data
      onConnect(walletData)
      
    } catch (error) {
      console.error('Error creating wallet:', error)
      setError('Failed to create wallet. Please try again.')
    } finally {
      setCreatingWallet(false)
    }
  }

  const handleCancelCreate = () => {
    setShowCreateWallet(false)
    setWalletName('')
    setError('')
  }

  return (
    <div className="wallet-connect">
      <div className="connect-container">
        <h2>Connect Your Turnkey Wallet</h2>
        <p>Choose a method to authenticate and access your Bitcoin wallet on testnet4.</p>
        
        <div className="auth-methods">
          <button 
            onClick={handleEmailAuth}
            disabled={loading || creatingWallet}
            className="auth-button email-auth"
          >
            {loading ? 'Connecting...' : 'Connect with Email'}
          </button>
          
          <button 
            onClick={handlePasskeyAuth}
            disabled={loading || creatingWallet}
            className="auth-button passkey-auth"
          >
            {loading ? 'Connecting...' : 'Connect with Passkey'}
          </button>
          
          <button 
            onClick={handleConnect}
            disabled={loading || creatingWallet}
            className="auth-button demo-auth"
          >
            {loading ? 'Connecting...' : 'Demo Mode (Testnet)'}
          </button>
          
          <button 
            onClick={() => setShowCreateWallet(true)}
            disabled={loading || creatingWallet}
            className="auth-button create-wallet"
          >
            Create New Wallet
          </button>
        </div>

        {showCreateWallet && (
          <div className="create-wallet-form">
            <h3>Create New Wallet</h3>
            <p>Create a new Bitcoin wallet for testnet4. This is for demo purposes only.</p>
            
            <div className="form-group">
              <label htmlFor="walletName">Wallet Name:</label>
              <input
                id="walletName"
                type="text"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder="Enter a name for your wallet"
                disabled={creatingWallet}
              />
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-actions">
              <button 
                onClick={handleCreateWallet}
                disabled={creatingWallet || !walletName.trim()}
                className="create-button"
              >
                {creatingWallet ? 'Creating...' : 'Create Wallet'}
              </button>
              <button 
                onClick={handleCancelCreate}
                disabled={creatingWallet}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div className="info">
          <h3>What is Turnkey?</h3>
          <p>
            Turnkey is a secure wallet infrastructure that provides enterprise-grade 
            security for cryptocurrency wallets. Your private keys are stored securely 
            and never leave the secure environment.
          </p>
          
          <h3>Testnet4 Information</h3>
          <p>
            This application connects to Bitcoin Testnet4, a test network used for 
            development and testing. Testnet coins have no real value.
          </p>
        </div>
      </div>
    </div>
  )
}

export default WalletConnect
