import { ThreeIATToken } from '../solana/ThreeIATToken.js';

/**
 * Wallet Management Service for 3IATLAS
 * Handles wallet creation, import, storage, and operations
 */
export class WalletService {
  constructor(network = 'devnet') {
    this.tokenService = new ThreeIATToken(network);
    this.wallets = new Map(); // In-memory storage (should use secure storage in production)
    this.activeWallet = null;
  }

  /**
   * Create a new wallet
   */
  createWallet(name = 'Wallet') {
    const wallet = this.tokenService.createWallet();
    const walletData = {
      id: this.generateWalletId(),
      name: name,
      ...wallet,
      createdAt: new Date().toISOString(),
      isActive: this.wallets.size === 0, // First wallet becomes active
    };

    this.wallets.set(walletData.id, walletData);
    
    if (walletData.isActive) {
      this.activeWallet = walletData.id;
    }

    return walletData;
  }

  /**
   * Import wallet from secret key
   */
  importWallet(secretKey, name = 'Imported Wallet') {
    try {
      const wallet = this.tokenService.importWallet(secretKey);
      const walletData = {
        id: this.generateWalletId(),
        name: name,
        ...wallet,
        createdAt: new Date().toISOString(),
        isActive: this.wallets.size === 0,
        imported: true,
      };

      this.wallets.set(walletData.id, walletData);
      
      if (walletData.isActive) {
        this.activeWallet = walletData.id;
      }

      return walletData;
    } catch (error) {
      throw new Error('Failed to import wallet: ' + error.message);
    }
  }

  /**
   * Get all wallets
   */
  getWallets() {
    return Array.from(this.wallets.values());
  }

  /**
   * Get wallet by ID
   */
  getWallet(walletId) {
    return this.wallets.get(walletId);
  }

  /**
   * Get active wallet
   */
  getActiveWallet() {
    return this.activeWallet ? this.wallets.get(this.activeWallet) : null;
  }

  /**
   * Set active wallet
   */
  setActiveWallet(walletId) {
    if (!this.wallets.has(walletId)) {
      throw new Error('Wallet not found');
    }

    // Update previous active wallet
    if (this.activeWallet) {
      const prevWallet = this.wallets.get(this.activeWallet);
      if (prevWallet) {
        prevWallet.isActive = false;
        this.wallets.set(this.activeWallet, prevWallet);
      }
    }

    // Set new active wallet
    const wallet = this.wallets.get(walletId);
    wallet.isActive = true;
    this.wallets.set(walletId, wallet);
    this.activeWallet = walletId;

    return wallet;
  }

  /**
   * Delete wallet
   */
  deleteWallet(walletId) {
    if (!this.wallets.has(walletId)) {
      throw new Error('Wallet not found');
    }

    const wallet = this.wallets.get(walletId);
    this.wallets.delete(walletId);

    // If deleted wallet was active, set another as active
    if (this.activeWallet === walletId) {
      this.activeWallet = null;
      const remainingWallets = Array.from(this.wallets.values());
      if (remainingWallets.length > 0) {
        this.setActiveWallet(remainingWallets[0].id);
      }
    }

    return wallet;
  }

  /**
   * Get SOL balance for a wallet
   */
  async getSolBalance(walletId = null) {
    const wallet = walletId ? this.getWallet(walletId) : this.getActiveWallet();
    if (!wallet) {
      throw new Error('No wallet specified or active');
    }

    return await this.tokenService.getSolBalance(wallet.publicKey);
  }

  /**
   * Get 3IAT token balance for a wallet
   */
  async getTokenBalance(walletId = null) {
    const wallet = walletId ? this.getWallet(walletId) : this.getActiveWallet();
    if (!wallet) {
      throw new Error('No wallet specified or active');
    }

    return await this.tokenService.getTokenBalance(wallet);
  }

  /**
   * Request SOL airdrop
   */
  async requestAirdrop(amount = 1, walletId = null) {
    const wallet = walletId ? this.getWallet(walletId) : this.getActiveWallet();
    if (!wallet) {
      throw new Error('No wallet specified or active');
    }

    return await this.tokenService.requestAirdrop(wallet.publicKey, amount);
  }

  /**
   * Transfer SOL between wallets
   */
  async transferSol(recipientPublicKey, amount, walletId = null) {
    const wallet = walletId ? this.getWallet(walletId) : this.getActiveWallet();
    if (!wallet) {
      throw new Error('No wallet specified or active');
    }

    // This would need to be implemented in ThreeIATToken
    // For now, we'll return a placeholder
    throw new Error('SOL transfer not yet implemented');
  }

  /**
   * Transfer 3IAT tokens
   */
  async transferTokens(recipientPublicKey, amount, walletId = null) {
    const wallet = walletId ? this.getWallet(walletId) : this.getActiveWallet();
    if (!wallet) {
      throw new Error('No wallet specified or active');
    }

    return await this.tokenService.transferTokens(
      wallet,
      recipientPublicKey,
      amount
    );
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(limit = 10, walletId = null) {
    const wallet = walletId ? this.getWallet(walletId) : this.getActiveWallet();
    if (!wallet) {
      throw new Error('No wallet specified or active');
    }

    return await this.tokenService.getTransactionHistory(wallet.publicKey, limit);
  }

  /**
   * Export wallet (returns secret key)
   */
  exportWallet(walletId = null) {
    const wallet = walletId ? this.getWallet(walletId) : this.getActiveWallet();
    if (!wallet) {
      throw new Error('No wallet specified or active');
    }

    return {
      publicKey: wallet.publicKey,
      secretKey: wallet.secretKey,
      name: wallet.name,
    };
  }

  /**
   * Update wallet name
   */
  updateWalletName(walletId, newName) {
    const wallet = this.getWallet(walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    wallet.name = newName;
    this.wallets.set(walletId, wallet);
    return wallet;
  }

  /**
   * Generate unique wallet ID
   */
  generateWalletId() {
    return 'wallet_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  /**
   * Save wallets to localStorage (for browser environments)
   */
  saveToLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const walletsData = {
        wallets: Object.fromEntries(this.wallets),
        activeWallet: this.activeWallet,
      };
      localStorage.setItem('3iatlas_wallets', JSON.stringify(walletsData));
    }
  }

  /**
   * Load wallets from localStorage
   */
  loadFromLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem('3iatlas_wallets');
      if (data) {
        try {
          const walletsData = JSON.parse(data);
          this.wallets = new Map(Object.entries(walletsData.wallets));
          this.activeWallet = walletsData.activeWallet;
          return true;
        } catch (error) {
          console.error('Failed to load wallets from localStorage:', error);
        }
      }
    }
    return false;
  }

  /**
   * Clear all wallets
   */
  clearWallets() {
    this.wallets.clear();
    this.activeWallet = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('3iatlas_wallets');
    }
  }
}