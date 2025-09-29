import React, { useState } from 'react';

const Demo = () => {
  const [wallets, setWallets] = useState([]);
  const [activeWallet, setActiveWallet] = useState(null);
  const [demoData, setDemoData] = useState({
    solBalance: 1.5,
    tokenBalance: 1000.0,
    transactions: [
      {
        signature: '5KJ7m3X8pVN2kL9zQ4R8tB3C6jW7fE9dA2Y6vT1qS8rP4nL3M',
        type: 'receive',
        amount: 500,
        date: new Date().toISOString(),
        status: 'confirmed'
      },
      {
        signature: '2A8vR9pK7mN5dQ6zX4L3j9wB8cY2tF5pE7rS1nM6kQ9pZ3L',
        type: 'send', 
        amount: 100,
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'confirmed'
      }
    ]
  });

  const createDemoWallet = () => {
    const newWallet = {
      id: 'demo_' + Date.now(),
      name: `Demo Wallet ${wallets.length + 1}`,
      publicKey: generateDemoAddress(),
      isActive: wallets.length === 0
    };
    
    setWallets([...wallets, newWallet]);
    if (newWallet.isActive) {
      setActiveWallet(newWallet);
    }
  };

  const generateDemoAddress = () => {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 44; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const selectWallet = (wallet) => {
    // Update active wallet
    const updatedWallets = wallets.map(w => ({
      ...w,
      isActive: w.id === wallet.id
    }));
    setWallets(updatedWallets);
    setActiveWallet(wallet);
  };

  const simulateTransaction = () => {
    // Simulate a successful transaction
    const newTransaction = {
      signature: generateDemoAddress(),
      type: 'send',
      amount: 50,
      date: new Date().toISOString(),
      status: 'confirmed'
    };
    
    setDemoData(prev => ({
      ...prev,
      tokenBalance: prev.tokenBalance - 50,
      transactions: [newTransaction, ...prev.transactions]
    }));
    
    alert('Demo transaction completed! 50 3IAT tokens sent.');
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h2>🚀 3IATLAS Demo Mode</h2>
        <p>This demo showcases the 3IATLAS functionality without requiring network access.</p>
        <div className="demo-warning">
          <strong>Demo Mode:</strong> All data is simulated for demonstration purposes
        </div>
      </div>

      <div className="demo-grid">
        {/* Wallet Creation */}
        <div className="demo-section">
          <h3>Wallet Management</h3>
          <button 
            onClick={createDemoWallet}
            className="btn btn-primary"
          >
            Create Demo Wallet
          </button>
          
          {wallets.length > 0 && (
            <div className="demo-wallets">
              <h4>Your Wallets ({wallets.length})</h4>
              {wallets.map(wallet => (
                <div 
                  key={wallet.id}
                  className={`wallet-item ${wallet.isActive ? 'active' : ''}`}
                  onClick={() => selectWallet(wallet)}
                >
                  <strong>{wallet.name}</strong>
                  <span className="wallet-address">{formatAddress(wallet.publicKey)}</span>
                  {wallet.isActive && <span className="active-badge">Active</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Wallet Info */}
        {activeWallet && (
          <div className="demo-section">
            <h3>Active Wallet: {activeWallet.name}</h3>
            <div className="balance-display">
              <div className="balance-item">
                <span className="balance-label">SOL Balance:</span>
                <span className="balance-value">{demoData.solBalance.toFixed(4)} SOL</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">3IAT Balance:</span>
                <span className="balance-value">{demoData.tokenBalance.toFixed(2)} 3IAT</span>
              </div>
            </div>
            
            <div className="wallet-details">
              <p><strong>Address:</strong></p>
              <p className="address-full">{activeWallet.publicKey}</p>
            </div>
          </div>
        )}

        {/* Transaction Demo */}
        {activeWallet && (
          <div className="demo-section">
            <h3>Token Transfer Demo</h3>
            <div className="transfer-demo">
              <p>Simulate sending 50 3IAT tokens</p>
              <button 
                onClick={simulateTransaction}
                className="btn btn-warning"
                disabled={demoData.tokenBalance < 50}
              >
                Send Demo Transaction
              </button>
            </div>
          </div>
        )}

        {/* Transaction History */}
        {activeWallet && (
          <div className="demo-section">
            <h3>Transaction History</h3>
            <div className="transactions-demo">
              {demoData.transactions.map((tx, index) => (
                <div key={index} className="transaction-demo-item">
                  <div className="tx-main">
                    <span className={`tx-type ${tx.type}`}>
                      {tx.type === 'send' ? '↗️ Sent' : '↙️ Received'}
                    </span>
                    <span className="tx-amount">{tx.amount} 3IAT</span>
                  </div>
                  <div className="tx-details">
                    <span className="tx-signature">{formatAddress(tx.signature)}</span>
                    <span className="tx-date">{new Date(tx.date).toLocaleString()}</span>
                    <span className={`tx-status ${tx.status}`}>{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feature Overview */}
      <div className="demo-features">
        <h3>🎯 3IATLAS Features</h3>
        <div className="features-grid">
          <div className="feature-item">
            <h4>⚡ Solana Speed</h4>
            <p>2000+ TPS, sub-second finality</p>
          </div>
          <div className="feature-item">
            <h4>💰 Low Fees</h4>
            <p>Transactions under $0.01</p>
          </div>
          <div className="feature-item">
            <h4>🔒 Secure Wallets</h4>
            <p>HD wallets with encrypted storage</p>
          </div>
          <div className="feature-item">
            <h4>🌐 SPL Token</h4>
            <p>Native Solana token standard</p>
          </div>
          <div className="feature-item">
            <h4>📱 User Friendly</h4>
            <p>Modern React interface</p>
          </div>
          <div className="feature-item">
            <h4>🔄 Real-time</h4>
            <p>Live balance and transaction updates</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .demo-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .demo-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .demo-warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem auto;
          max-width: 500px;
        }
        
        .demo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .demo-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
        }
        
        .wallet-item {
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 1rem;
          margin: 0.5rem 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .wallet-item:hover {
          border-color: #667eea;
          transform: translateY(-2px);
        }
        
        .wallet-item.active {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
        }
        
        .wallet-address {
          font-family: 'Courier New', monospace;
          color: #666;
          font-size: 0.9rem;
          display: block;
          margin-top: 0.25rem;
        }
        
        .active-badge {
          background: #667eea;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          float: right;
        }
        
        .balance-display {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
        }
        
        .balance-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        
        .address-full {
          font-family: 'Courier New', monospace;
          word-break: break-all;
          background: #f8f9fa;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .transaction-demo-item {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 0.5rem;
          background: #f8f9fa;
        }
        
        .tx-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .tx-type.send {
          color: #dc3545;
        }
        
        .tx-type.receive {
          color: #28a745;
        }
        
        .tx-details {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #666;
        }
        
        .tx-signature {
          font-family: 'Courier New', monospace;
        }
        
        .tx-status.confirmed {
          color: #28a745;
          font-weight: 600;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .feature-item {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          border-left: 4px solid #667eea;
        }
        
        .feature-item h4 {
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .feature-item p {
          color: #666;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default Demo;