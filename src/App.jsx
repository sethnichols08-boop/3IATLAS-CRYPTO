import React, { useState } from 'react';
import WalletManager from './components/WalletManager.jsx';
import TokenTransfer from './components/TokenTransfer.jsx';
import './styles/App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('wallets');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>3IATLAS Crypto</h1>
          <p>A crypto revolution combining Bitcoin's security, Ethereum's smart contracts, Shiba Inu's community, and Solana's speed</p>
        </div>
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'wallets' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallets')}
          >
            Wallets
          </button>
          <button 
            className={`nav-tab ${activeTab === 'transfer' ? 'active' : ''}`}
            onClick={() => setActiveTab('transfer')}
          >
            Transfer
          </button>
          <button 
            className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'wallets' && <WalletManager />}
        {activeTab === 'transfer' && <TokenTransfer />}
        {activeTab === 'about' && (
          <div className="about-section">
            <h2>About 3IATLAS</h2>
            <div className="about-content">
              <p>
                3IATLAS is a revolutionary cryptocurrency that combines the best features from 
                the most successful blockchain projects:
              </p>
              <ul>
                <li><strong>Bitcoin's Security:</strong> Proven cryptographic foundations and security model</li>
                <li><strong>Ethereum's Smart Contracts:</strong> Programmable blockchain functionality</li>
                <li><strong>Shiba Inu's Community:</strong> Strong community-driven growth and engagement</li>
                <li><strong>Solana's Speed:</strong> High-performance, low-cost transactions</li>
                <li><strong>Pi's Accessibility:</strong> User-friendly mobile-first approach</li>
              </ul>
              
              <h3>Technical Specifications</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <strong>Token Symbol:</strong> 3IAT
                </div>
                <div className="spec-item">
                  <strong>Total Supply:</strong> 1,000,000,000 (1 Billion)
                </div>
                <div className="spec-item">
                  <strong>Decimals:</strong> 9
                </div>
                <div className="spec-item">
                  <strong>Blockchain:</strong> Solana (SPL Token)
                </div>
                <div className="spec-item">
                  <strong>Network:</strong> Devnet (Testing)
                </div>
                <div className="spec-item">
                  <strong>Consensus:</strong> Proof of History + Proof of Stake
                </div>
              </div>

              <h3>Features</h3>
              <ul>
                <li>Fast and low-cost transactions on Solana</li>
                <li>SPL token compatibility</li>
                <li>Wallet creation and management</li>
                <li>Token transfers</li>
                <li>Transaction history</li>
                <li>Cross-platform support</li>
              </ul>

              <div className="warning-box">
                <h4>⚠️ Development Notice</h4>
                <p>
                  This is currently running on Solana Devnet for testing purposes. 
                  Do not use real funds. Devnet tokens have no real value.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 3IATLAS Crypto. Built on Solana blockchain.</p>
        <p>Current Network: <strong>Devnet</strong></p>
      </footer>
    </div>
  );
};

export default App;