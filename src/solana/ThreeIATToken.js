import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

/**
 * 3IATLAS Token Configuration
 */
export const TOKEN_CONFIG = {
  name: '3IATLAS',
  symbol: '3IAT',
  decimals: 9,
  totalSupply: 1000000000, // 1 billion tokens
  description: 'A crypto revolution combining Bitcoin\'s security, Ethereum\'s smart contracts, Shiba Inu\'s community, and Solana\'s speed',
};

/**
 * Solana network configurations
 */
export const NETWORK_CONFIG = {
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
  mainnet: 'https://api.mainnet-beta.solana.com',
};

export class ThreeIATToken {
  constructor(network = 'devnet') {
    this.connection = new Connection(NETWORK_CONFIG[network], 'confirmed');
    this.network = network;
    this.mintAddress = null;
  }

  /**
   * Create a new Solana wallet
   */
  createWallet() {
    const keypair = Keypair.generate();
    return {
      publicKey: keypair.publicKey.toString(),
      secretKey: Array.from(keypair.secretKey),
      keypair: keypair,
    };
  }

  /**
   * Import wallet from secret key
   */
  importWallet(secretKey) {
    const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
    return {
      publicKey: keypair.publicKey.toString(),
      secretKey: Array.from(keypair.secretKey),
      keypair: keypair,
    };
  }

  /**
   * Get SOL balance for a wallet
   */
  async getSolBalance(publicKey) {
    try {
      const balance = await this.connection.getBalance(new PublicKey(publicKey));
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting SOL balance:', error);
      throw error;
    }
  }

  /**
   * Request SOL airdrop (devnet/testnet only)
   */
  async requestAirdrop(publicKey, amount = 1) {
    if (this.network === 'mainnet') {
      throw new Error('Airdrop not available on mainnet');
    }

    try {
      const signature = await this.connection.requestAirdrop(
        new PublicKey(publicKey),
        amount * LAMPORTS_PER_SOL
      );
      await this.connection.confirmTransaction(signature);
      return signature;
    } catch (error) {
      console.error('Error requesting airdrop:', error);
      throw error;
    }
  }

  /**
   * Create the 3IAT token mint
   */
  async createToken(payer) {
    try {
      const mint = await createMint(
        this.connection,
        payer.keypair,
        payer.keypair.publicKey,
        null,
        TOKEN_CONFIG.decimals
      );

      this.mintAddress = mint;
      console.log('3IAT Token created:', mint.toString());
      return mint.toString();
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  }

  /**
   * Get token account for a wallet
   */
  async getTokenAccount(walletPublicKey, mintAddress = null) {
    const mint = mintAddress ? new PublicKey(mintAddress) : this.mintAddress;
    if (!mint) {
      throw new Error('Token mint address not set');
    }

    try {
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        walletPublicKey.keypair,
        mint,
        walletPublicKey.keypair.publicKey
      );
      return tokenAccount;
    } catch (error) {
      console.error('Error getting token account:', error);
      throw error;
    }
  }

  /**
   * Mint tokens to a wallet
   */
  async mintTokens(recipient, amount, mintAuthority) {
    const mint = this.mintAddress;
    if (!mint) {
      throw new Error('Token mint address not set');
    }

    try {
      const tokenAccount = await this.getTokenAccount(recipient);
      const signature = await mintTo(
        this.connection,
        mintAuthority.keypair,
        mint,
        tokenAccount.address,
        mintAuthority.keypair.publicKey,
        amount * Math.pow(10, TOKEN_CONFIG.decimals)
      );
      console.log('Tokens minted:', signature);
      return signature;
    } catch (error) {
      console.error('Error minting tokens:', error);
      throw error;
    }
  }

  /**
   * Get token balance for a wallet
   */
  async getTokenBalance(walletPublicKey, mintAddress = null) {
    const mint = mintAddress ? new PublicKey(mintAddress) : this.mintAddress;
    if (!mint) {
      throw new Error('Token mint address not set');
    }

    try {
      const tokenAccount = await this.getTokenAccount(walletPublicKey);
      const accountInfo = await getAccount(this.connection, tokenAccount.address);
      return Number(accountInfo.amount) / Math.pow(10, TOKEN_CONFIG.decimals);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 0;
    }
  }

  /**
   * Transfer tokens between wallets
   */
  async transferTokens(sender, recipientPublicKey, amount) {
    const mint = this.mintAddress;
    if (!mint) {
      throw new Error('Token mint address not set');
    }

    try {
      const senderTokenAccount = await this.getTokenAccount(sender);
      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        sender.keypair,
        mint,
        new PublicKey(recipientPublicKey)
      );

      const signature = await transfer(
        this.connection,
        sender.keypair,
        senderTokenAccount.address,
        recipientTokenAccount.address,
        sender.keypair.publicKey,
        amount * Math.pow(10, TOKEN_CONFIG.decimals)
      );

      console.log('Transfer completed:', signature);
      return signature;
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw error;
    }
  }

  /**
   * Get transaction history for a wallet
   */
  async getTransactionHistory(publicKey, limit = 10) {
    try {
      const transactions = await this.connection.getSignaturesForAddress(
        new PublicKey(publicKey),
        { limit }
      );
      return transactions;
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  }

  /**
   * Get transaction details
   */
  async getTransactionDetails(signature) {
    try {
      const transaction = await this.connection.getTransaction(signature);
      return transaction;
    } catch (error) {
      console.error('Error getting transaction details:', error);
      throw error;
    }
  }

  /**
   * Set mint address (for existing tokens)
   */
  setMintAddress(mintAddress) {
    this.mintAddress = new PublicKey(mintAddress);
  }
}