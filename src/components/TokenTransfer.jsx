import React, { useState, useEffect } from 'react';
import { WalletService } from '../services/WalletService.js';

const TokenTransfer = () => {
  const [walletService] = useState(() => new WalletService('devnet'));
  const [activeWallet, setActiveWallet] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferType, setTransferType] = useState('3IAT'); // '3IAT' or 'SOL'
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState({ sol: 0, tokens: 0 });

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    walletService.loadFromLocalStorage();
    const wallet = walletService.getActiveWallet();
    setActiveWallet(wallet);
    
    if (wallet) {
      await refreshBalance();
      await loadTransactionHistory();
    }
  };

  const refreshBalance = async () => {
    if (!activeWallet) return;
    
    try {
      const solBalance = await walletService.getSolBalance();
      const tokenBalance = await walletService.getTokenBalance();
      setBalance({ sol: solBalance, tokens: tokenBalance });
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  const loadTransactionHistory = async () => {
    if (!activeWallet) return;
    
    try {
      const history = await walletService.getTransactionHistory(20);
      setTransactions(history);
    } catch (error) {
      console.error('Error loading transaction history:', error);
    }
  };

  const handleTransfer = async () => {
    if (!activeWallet) {
      alert('No active wallet found');
      return;
    }

    if (!recipientAddress || !transferAmount) {
      alert('Please fill in all fields');
      return;
    }

    if (isNaN(transferAmount) || parseFloat(transferAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      let signature;

      if (transferType === '3IAT') {
        signature = await walletService.transferTokens(
          recipientAddress,
          parseFloat(transferAmount)
        );
      } else {
        // SOL transfer would need to be implemented
        alert('SOL transfer not yet implemented');
        return;
      }

      alert(`Transfer successful! Transaction: ${signature}`);
      setRecipientAddress('');
      setTransferAmount('');
      await refreshBalance();
      await loadTransactionHistory();
    } catch (error) {
      alert('Transfer failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (!activeWallet) {
    return (
      <div className="token-transfer">
        <h2>Token Transfer</h2>
        <p>No active wallet found. Please create or select a wallet first.</p>
      </div>
    );
  }

  return (
    <div className="token-transfer">
      <div className="transfer-header">
        <h2>Transfer Tokens</h2>
        <div className="wallet-info">
          <h3>{activeWallet.name}</h3>
          <p>Address: {formatAddress(activeWallet.publicKey)}</p>
          <div className="balance-info">
            <span>SOL: {balance.sol.toFixed(4)}</span>
            <span>3IAT: {balance.tokens.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="transfer-form">
        <h3>Send Tokens</h3>
        
        <div className="form-group">
          <label>Token Type:</label>
          <select 
            value={transferType} 
            onChange={(e) => setTransferType(e.target.value)}
            className="form-select"
          >
            <option value="3IAT">3IAT Tokens</option>
            <option value="SOL" disabled>SOL (Coming Soon)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Recipient Address:</label>
          <input
            type="text"
            placeholder="Enter Solana address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Amount:</label>
          <div className="amount-input">
            <input
              type="number"
              placeholder="0.00"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="form-input"
              step="0.01"
              min="0"
            />
            <span className="currency-label">{transferType}</span>
          </div>
          {transferType === '3IAT' && (
            <small className="balance-hint">
              Available: {balance.tokens.toFixed(2)} 3IAT
            </small>
          )}
          {transferType === 'SOL' && (
            <small className="balance-hint">
              Available: {balance.sol.toFixed(4)} SOL
            </small>
          )}
        </div>

        <button 
          onClick={handleTransfer}
          disabled={loading || !recipientAddress || !transferAmount}
          className="btn btn-primary transfer-btn"
        >
          {loading ? 'Sending...' : `Send ${transferType}`}
        </button>
      </div>

      <div className="transaction-history">
        <h3>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div className="transactions-list">
            {transactions.map((tx, index) => (
              <div key={index} className="transaction-item">
                <div className="tx-info">
                  <span className="tx-signature">
                    {formatAddress(tx.signature)}
                  </span>
                  <span className="tx-date">
                    {formatDate(tx.blockTime)}
                  </span>
                </div>
                <div className="tx-status">
                  <span className={`status ${tx.confirmationStatus}`}>
                    {tx.confirmationStatus}
                  </span>
                  {tx.err && (
                    <span className="error">Failed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenTransfer;