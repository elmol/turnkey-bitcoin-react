import React, { useState } from 'react'
import { exportPrivateKey, copyToClipboard } from '../utils/bitcoin'
import type { WalletCreationResult } from '../types'

interface ExportPrivateKeyModalProps {
  isOpen: boolean
  onClose: () => void
  walletData: WalletCreationResult | null
}

const ExportPrivateKeyModal: React.FC<ExportPrivateKeyModalProps> = ({
  isOpen,
  onClose,
  walletData
}) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [exportData, setExportData] = useState<{
    privateKey: string;
    wif: string;
    warnings: string[];
  } | null>(null)

  React.useEffect(() => {
    if (isOpen && walletData) {
      try {
        const data = exportPrivateKey(walletData)
        setExportData(data)
      } catch (error) {
        console.error('Error preparing export data:', error)
        alert('Error: Could not export private key. Make sure the wallet has a private key available.')
        onClose()
      }
    }
  }, [isOpen, walletData, onClose])

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    }
  }

  const handleClose = () => {
    setShowPrivateKey(false)
    setCopiedField(null)
    setExportData(null)
    onClose()
  }

  if (!isOpen || !exportData) {
    return null
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content export-private-key-modal">
        <div className="modal-header">
          <h2>🔐 Export Private Key</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="security-warnings">
            <h3>⚠️ Security Warnings</h3>
            <ul>
              {exportData.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>

          <div className="confirmation-section">
            <p>
              <strong>Are you sure you want to export your private key?</strong>
            </p>
            <p>
              This action will reveal your private key, which gives complete control over your Bitcoin wallet.
              Only proceed if you understand the security implications.
            </p>
          </div>

          {!showPrivateKey ? (
            <div className="confirmation-buttons">
              <button 
                className="btn-danger"
                onClick={() => setShowPrivateKey(true)}
              >
                Yes, I understand the risks - Show Private Key
              </button>
              <button 
                className="btn-secondary"
                onClick={handleClose}
              >
                Cancel - Keep Private Key Secure
              </button>
            </div>
          ) : (
            <div className="private-key-display">
              <div className="key-section">
                <h4>Private Key (Hex)</h4>
                <div className="key-display">
                  <code>{exportData.privateKey}</code>
                  <button 
                    className="copy-btn"
                    onClick={() => handleCopy(exportData.privateKey, 'privateKey')}
                  >
                    {copiedField === 'privateKey' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="key-section">
                <h4>WIF (Wallet Import Format)</h4>
                <div className="key-display">
                  <code>{exportData.wif}</code>
                  <button 
                    className="copy-btn"
                    onClick={() => handleCopy(exportData.wif, 'wif')}
                  >
                    {copiedField === 'wif' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="final-warning">
                <h4>🚨 Final Security Reminder</h4>
                <ul>
                  <li>✅ Copy these keys to a secure, offline location</li>
                  <li>✅ Delete them from your browser history</li>
                  <li>✅ Never share them with anyone</li>
                  <li>✅ Consider using a hardware wallet for better security</li>
                </ul>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-primary"
                  onClick={handleClose}
                >
                  Done - Close Modal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExportPrivateKeyModal
