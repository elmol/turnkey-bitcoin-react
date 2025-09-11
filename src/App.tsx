// @ts-ignore
import { TurnkeyProvider } from '@turnkey/sdk-react'
import WalletDashboard from './components/WalletDashboard'
import { TURNKEY_CONFIG } from './config'
import './App.css'

function App() {
  return (
    <TurnkeyProvider
      config={{
        apiBaseUrl: TURNKEY_CONFIG.API_BASE_URL,
        defaultOrganizationId: TURNKEY_CONFIG.DEFAULT_ORGANIZATION_ID,
      }}
    >
      <div className="App">
        <header className="App-header">
          <h1>Turnkey Bitcoin Wallet</h1>
          <p>Connect your Turnkey wallet and interact with Bitcoin testnet4</p>
        </header>
        <main>
          <WalletDashboard />
        </main>
      </div>
    </TurnkeyProvider>
  )
}

export default App
