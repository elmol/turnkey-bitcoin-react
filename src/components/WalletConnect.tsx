import React from 'react'
// @ts-ignore
import { useTurnkey } from '@turnkey/sdk-react'

interface WalletConnectProps {
  onConnect: () => void
  loading: boolean
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, loading }) => {
const {  } = useTurnkey()

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

  return (
    <div className="wallet-connect">
      <div className="connect-container">
        <h2>Connect Your Turnkey Wallet</h2>
        <p>Choose a method to authenticate and access your Bitcoin wallet on testnet4.</p>
        
        <div className="auth-methods">
          <button 
            onClick={handleEmailAuth}
            disabled={loading}
            className="auth-button email-auth"
          >
            {loading ? 'Connecting...' : 'Connect with Email'}
          </button>
          
          <button 
            onClick={handlePasskeyAuth}
            disabled={loading}
            className="auth-button passkey-auth"
          >
            {loading ? 'Connecting...' : 'Connect with Passkey'}
          </button>
          
          <button 
            onClick={handleConnect}
            disabled={loading}
            className="auth-button demo-auth"
          >
            {loading ? 'Connecting...' : 'Demo Mode (Testnet)'}
          </button>
        </div>
        
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
