import React, { useState } from 'react'

interface SendTransactionProps {
  walletAddress: string
  balance: number
}

const SendTransaction: React.FC<SendTransactionProps> = ({ walletAddress, balance }) => {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')

  const validateAddress = (address: string): boolean => {
    // Basic validation for Bitcoin testnet addresses
    // This is simplified - in production, use a proper validation library
    return address.startsWith('tb1') || address.startsWith('m') || address.startsWith('n') || address.startsWith('2')
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setTxHash('')
    
    // Validation
    if (!recipient) {
      setError('Please enter a recipient address')
      return
    }
    
    if (!validateAddress(recipient)) {
      setError('Invalid Bitcoin testnet address')
      return
    }
    
    const amountNum = parseFloat(amount)
    if (!amount || amountNum <= 0) {
      setError('Please enter a valid amount')
      return
    }
    
    if (amountNum > balance) {
      setError('Insufficient balance')
      return
    }

    setIsLoading(true)
    
    try {
      // This is a placeholder - in a real implementation, you would:
      // 1. Create a transaction using bitcoinjs-lib
      // 2. Sign it with Turnkey
      // 3. Broadcast it to the network
      
      console.log('Creating transaction...')
      console.log('From:', walletAddress)
      console.log('To:', recipient)
      console.log('Amount:', amountNum, 'BTC')
      
      // For demo purposes, we'll just show a success message
      // In real implementation, you'd need to:
      // - Get UTXOs for the wallet
      // - Create a proper transaction
      // - Sign with Turnkey's signing infrastructure
      // - Broadcast using broadcastTransaction()
      
      // Simulate transaction creation and broadcast
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // This would be the actual transaction hash in a real implementation
      const mockTxHash = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
      setTxHash(mockTxHash)
      
      // Reset form
      setRecipient('')
      setAmount('')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMaxAmount = () => {
    // Leave some room for fees (simplified)
    const maxSendable = Math.max(0, balance - 0.0001)
    setAmount(maxSendable.toFixed(8))
  }

  return (
    <div className="send-transaction">
      <form onSubmit={handleSend} className="send-form">
        <div className="form-group">
          <label htmlFor="recipient">Recipient Address</label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter Bitcoin testnet address (e.g., tb1...)"
            disabled={isLoading}
            className="address-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount (BTC)</label>
          <div className="amount-input-container">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00000000"
              step="0.00000001"
              min="0"
              max={balance}
              disabled={isLoading}
              className="amount-input"
            />
            <button
              type="button"
              onClick={handleMaxAmount}
              disabled={isLoading}
              className="max-button"
            >
              MAX
            </button>
          </div>
          <div className="balance-info">
            Available: {balance.toFixed(8)} BTC
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {txHash && (
          <div className="success-message">
            <h4>Transaction Sent!</h4>
            <p>Transaction Hash: <code>{txHash}</code></p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(txHash)}
              className="copy-btn"
            >
              Copy Hash
            </button>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !recipient || !amount}
          className="send-button"
        >
          {isLoading ? 'Sending...' : 'Send Bitcoin'}
        </button>
      </form>
      
      <div className="transaction-info">
        <h4>Important Notes:</h4>
        <ul>
          <li>This is Bitcoin Testnet4 - transactions have no real value</li>
          <li>Always double-check the recipient address before sending</li>
          <li>Network fees are automatically calculated and deducted</li>
          <li>Transactions typically confirm within 10-60 minutes</li>
        </ul>
      </div>
    </div>
  )
}

export default SendTransaction
