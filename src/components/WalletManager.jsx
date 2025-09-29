import React, { useState, useEffect } from 'react';
import { WalletService } from '../services/WalletService.js';

const WalletManager = () => {
  const [walletService] = useState(() => new WalletService('devnet'));
  const [wallets, setWallets] = useState([]);
  const [activeWallet, setActiveWallet] = useState(null);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [importSecretKey, setImportSecretKey] = useState('');

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = () => {
    walletService.loadFromLocalStorage();
    const walletsData = walletService.getWallets();
    setWallets(walletsData);
    setActiveWallet(walletService.getActiveWallet());
  };

  const saveWallets = () => {
    walletService.saveToLocalStorage();
  };

  const createWallet = async () => {
    try {
      setLoading(true);
      const wallet = walletService.createWallet(newWalletName || 'New Wallet');
      setWallets(walletService.getWallets());
      setActiveWallet(walletService.getActiveWallet());
      setNewWalletName('');
      setShowCreateForm(false);
      saveWallets();
      await refreshBalances();
    } catch (error) {
      alert('Error creating wallet: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const importWallet = async () => {
    try {
      setLoading(true);
      const secretKeyArray = importSecretKey.split(',').map(num => parseInt(num.trim()));
      const wallet = walletService.importWallet(secretKeyArray, newWalletName || 'Imported Wallet');
      setWallets(walletService.getWallets());
      setActiveWallet(walletService.getActiveWallet());
      setNewWalletName('');
      setImportSecretKey('');
      setShowImportForm(false);
      saveWallets();
      await refreshBalances();
    } catch (error) {
      alert('Error importing wallet: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectWallet = async (walletId) => {
    try {
      const wallet = walletService.setActiveWallet(walletId);
      setActiveWallet(wallet);
      saveWallets();
      await refreshBalances();
    } catch (error) {
      alert('Error selecting wallet: ' + error.message);
    }
  };

  const refreshBalances = async () => {
    if (!activeWallet) return;
    
    try {
      setLoading(true);
      const solBalance = await walletService.getSolBalance();
      const tokenBalance = await walletService.getTokenBalance();
      
      setBalances({
        sol: solBalance,
        tokens: tokenBalance,
      });
    } catch (error) {
      console.error('Error refreshing balances:', error);
      setBalances({ sol: 0, tokens: 0 });
    } finally {
      setLoading(false);
    }
  };

  const requestAirdrop = async () => {
    try {
      setLoading(true);
      await walletService.requestAirdrop(1);
      alert('Airdrop requested! It may take a few moments to appear.');
      setTimeout(() => refreshBalances(), 3000);
    } catch (error) {
      alert('Error requesting airdrop: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteWallet = (walletId) => {
    if (confirm('Are you sure you want to delete this wallet?')) {
      walletService.deleteWallet(walletId);
      setWallets(walletService.getWallets());
      setActiveWallet(walletService.getActiveWallet());
      saveWallets();
    }
  };

  return (
    <div className="wallet-manager">
      <div className="wallet-header">
        <h2>3IATLAS Wallet Manager</h2>
        <div className="wallet-actions">
          <button 
            onClick={() => setShowCreateForm(true)}
            disabled={loading}
            className="btn btn-primary"
          >
            Create Wallet
          </button>
          <button 
            onClick={() => setShowImportForm(true)}
            disabled={loading}
            className="btn btn-secondary"
          >
            Import Wallet
          </button>
          {activeWallet && (
            <button 
              onClick={refreshBalances}
              disabled={loading}
              className="btn btn-info"
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {showCreateForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Wallet</h3>
            <input
              type="text"
              placeholder="Wallet Name (optional)"
              value={newWalletName}
              onChange={(e) => setNewWalletName(e.target.value)}
              className="form-input"
            />
            <div className="modal-actions">
              <button onClick={createWallet} disabled={loading} className="btn btn-primary">
                Create
              </button>
              <button onClick={() => setShowCreateForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showImportForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Import Wallet</h3>
            <input
              type="text"
              placeholder="Wallet Name (optional)"
              value={newWalletName}
              onChange={(e) => setNewWalletName(e.target.value)}
              className="form-input"
            />
            <textarea
              placeholder="Secret Key (comma-separated numbers)"
              value={importSecretKey}
              onChange={(e) => setImportSecretKey(e.target.value)}
              className="form-textarea"
              rows="3"
            />
            <div className="modal-actions">
              <button onClick={importWallet} disabled={loading} className="btn btn-primary">
                Import
              </button>
              <button onClick={() => setShowImportForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {activeWallet && (
        <div className="active-wallet">
          <h3>Active Wallet: {activeWallet.name}</h3>
          <div className="wallet-info">
            <p><strong>Address:</strong> {activeWallet.publicKey}</p>
            <p><strong>SOL Balance:</strong> {balances.sol?.toFixed(4) || '0'} SOL</p>
            <p><strong>3IAT Balance:</strong> {balances.tokens?.toFixed(2) || '0'} 3IAT</p>
          </div>
          <button 
            onClick={requestAirdrop}
            disabled={loading}
            className="btn btn-warning"
          >
            Request SOL Airdrop (Devnet)
          </button>
        </div>
      )}

      <div className="wallets-list">
        <h3>All Wallets</h3>
        {wallets.length === 0 ? (
          <p>No wallets created yet. Create your first wallet to get started!</p>
        ) : (
          <div className="wallets-grid">
            {wallets.map((wallet) => (
              <div 
                key={wallet.id} 
                className={`wallet-card ${wallet.isActive ? 'active' : ''}`}
              >
                <h4>{wallet.name}</h4>
                <p className="wallet-address">{wallet.publicKey.substring(0, 20)}...</p>
                <p className="wallet-date">Created: {new Date(wallet.createdAt).toLocaleDateString()}</p>
                <div className="wallet-card-actions">
                  {!wallet.isActive && (
                    <button 
                      onClick={() => selectWallet(wallet.id)}
                      className="btn btn-sm btn-primary"
                    >
                      Select
                    </button>
                  )}
                  <button 
                    onClick={() => deleteWallet(wallet.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default WalletManager;