import React from 'react'
import { BitcoinTransaction } from '../types'
import { BITCOIN_CONFIG } from '../config'

interface TransactionListProps {
  transactions: BitcoinTransaction[]
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount)
    return absAmount.toFixed(8)
  }

  const getTransactionUrl = (txid: string) => {
    return `${BITCOIN_CONFIG.EXPLORER_URL}/tx/${txid}`
  }

  if (transactions.length === 0) {
    return (
      <div className="transaction-list empty">
        <p>No transactions found.</p>
      </div>
    )
  }

  return (
    <div className="transaction-list">
      <div className="transaction-header">
        <span>Date</span>
        <span>Type</span>
        <span>Amount (BTC)</span>
        <span>Status</span>
        <span>Action</span>
      </div>
      
      {transactions.map((tx) => (
        <div key={tx.txid} className={`transaction-item ${tx.type}`}>
          <div className="transaction-date">
            {formatDate(tx.timestamp)}
          </div>
          
          <div className="transaction-type">
            <span className={`type-badge ${tx.type}`}>
              {tx.type === 'received' ? '↓ Received' : '↑ Sent'}
            </span>
          </div>
          
          <div className={`transaction-amount ${tx.type}`}>
            <span className="amount">
              {tx.type === 'received' ? '+' : '-'}{formatAmount(tx.amount)}
            </span>
          </div>
          
          <div className="transaction-status">
            <span className={`status-badge ${tx.confirmations > 0 ? 'confirmed' : 'pending'}`}>
              {tx.confirmations > 0 ? `${tx.confirmations} confirmations` : 'Pending'}
            </span>
          </div>
          
          <div className="transaction-actions">
            <a 
              href={getTransactionUrl(tx.txid)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="view-link"
            >
              View
            </a>
            <button 
              onClick={() => navigator.clipboard.writeText(tx.txid)}
              className="copy-btn"
              title="Copy Transaction ID"
            >
              Copy
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TransactionList
