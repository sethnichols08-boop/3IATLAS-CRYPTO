const { ThreeIATToken, TOKEN_CONFIG } = require('../src/solana/ThreeIATToken.js');
const { WalletService } = require('../src/services/WalletService.js');

describe('3IATLAS Token Tests', () => {
  let tokenService;
  let walletService;
  let testWallet;

  beforeAll(async () => {
    tokenService = new ThreeIATToken('devnet');
    walletService = new WalletService('devnet');
  });

  test('should create a new wallet', () => {
    testWallet = tokenService.createWallet();
    
    expect(testWallet).toHaveProperty('publicKey');
    expect(testWallet).toHaveProperty('secretKey');
    expect(testWallet).toHaveProperty('keypair');
    expect(testWallet.publicKey).toBeTruthy();
    expect(Array.isArray(testWallet.secretKey)).toBe(true);
    expect(testWallet.secretKey.length).toBe(64);
  });

  test('should import wallet from secret key', () => {
    const importedWallet = tokenService.importWallet(testWallet.secretKey);
    
    expect(importedWallet.publicKey).toBe(testWallet.publicKey);
    expect(importedWallet.secretKey).toEqual(testWallet.secretKey);
  });

  test('should get SOL balance', async () => {
    const balance = await tokenService.getSolBalance(testWallet.publicKey);
    
    expect(typeof balance).toBe('number');
    expect(balance).toBeGreaterThanOrEqual(0);
  }, 10000);

  test('should request SOL airdrop on devnet', async () => {
    const signature = await tokenService.requestAirdrop(testWallet.publicKey, 1);
    
    expect(typeof signature).toBe('string');
    expect(signature.length).toBeGreaterThan(0);
    
    // Wait a bit for airdrop to process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const balance = await tokenService.getSolBalance(testWallet.publicKey);
    expect(balance).toBeGreaterThan(0);
  }, 15000);

  test('should create token mint', async () => {
    const mintAddress = await tokenService.createToken(testWallet);
    
    expect(typeof mintAddress).toBe('string');
    expect(mintAddress.length).toBeGreaterThan(0);
    expect(tokenService.mintAddress).toBeTruthy();
  }, 15000);

  test('should create token account', async () => {
    const tokenAccount = await tokenService.getTokenAccount(testWallet);
    
    expect(tokenAccount).toHaveProperty('address');
    expect(tokenAccount).toHaveProperty('mint');
    expect(tokenAccount.mint.toString()).toBe(tokenService.mintAddress.toString());
  }, 10000);

  test('should mint tokens', async () => {
    const mintAmount = 1000;
    const signature = await tokenService.mintTokens(testWallet, mintAmount, testWallet);
    
    expect(typeof signature).toBe('string');
    expect(signature.length).toBeGreaterThan(0);
    
    // Check balance
    const balance = await tokenService.getTokenBalance(testWallet);
    expect(balance).toBe(mintAmount);
  }, 15000);

  test('should transfer tokens between wallets', async () => {
    // Create recipient wallet
    const recipientWallet = tokenService.createWallet();
    await tokenService.requestAirdrop(recipientWallet.publicKey, 1);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const transferAmount = 100;
    const signature = await tokenService.transferTokens(
      testWallet,
      recipientWallet.publicKey,
      transferAmount
    );
    
    expect(typeof signature).toBe('string');
    expect(signature.length).toBeGreaterThan(0);
    
    // Check balances
    const senderBalance = await tokenService.getTokenBalance(testWallet);
    const recipientBalance = await tokenService.getTokenBalance(recipientWallet);
    
    expect(senderBalance).toBe(900); // 1000 - 100
    expect(recipientBalance).toBe(100);
  }, 25000);

  test('should get transaction history', async () => {
    const history = await tokenService.getTransactionHistory(testWallet.publicKey, 5);
    
    expect(Array.isArray(history)).toBe(true);
    expect(history.length).toBeGreaterThan(0);
    
    if (history.length > 0) {
      expect(history[0]).toHaveProperty('signature');
      expect(history[0]).toHaveProperty('blockTime');
    }
  }, 10000);
});

describe('Wallet Service Tests', () => {
  let walletService;

  beforeAll(() => {
    walletService = new WalletService('devnet');
  });

  beforeEach(() => {
    walletService.clearWallets();
  });

  test('should create a new wallet', () => {
    const wallet = walletService.createWallet('Test Wallet');
    
    expect(wallet).toHaveProperty('id');
    expect(wallet).toHaveProperty('name');
    expect(wallet).toHaveProperty('publicKey');
    expect(wallet).toHaveProperty('secretKey');
    expect(wallet).toHaveProperty('createdAt');
    expect(wallet.name).toBe('Test Wallet');
    expect(wallet.isActive).toBe(true);
  });

  test('should import a wallet', () => {
    const testWallet = walletService.tokenService.createWallet();
    const importedWallet = walletService.importWallet(testWallet.secretKey, 'Imported');
    
    expect(importedWallet.publicKey).toBe(testWallet.publicKey);
    expect(importedWallet.name).toBe('Imported');
    expect(importedWallet.imported).toBe(true);
  });

  test('should manage multiple wallets', () => {
    const wallet1 = walletService.createWallet('Wallet 1');
    const wallet2 = walletService.createWallet('Wallet 2');
    
    const wallets = walletService.getWallets();
    expect(wallets.length).toBe(2);
    
    // First wallet should be active
    expect(wallet1.isActive).toBe(true);
    expect(wallet2.isActive).toBe(false);
    
    // Switch active wallet
    walletService.setActiveWallet(wallet2.id);
    const activeWallet = walletService.getActiveWallet();
    expect(activeWallet.id).toBe(wallet2.id);
    expect(activeWallet.isActive).toBe(true);
  });

  test('should delete wallet', () => {
    const wallet1 = walletService.createWallet('Wallet 1');
    const wallet2 = walletService.createWallet('Wallet 2');
    
    walletService.deleteWallet(wallet1.id);
    const wallets = walletService.getWallets();
    expect(wallets.length).toBe(1);
    expect(wallets[0].id).toBe(wallet2.id);
  });

  test('should export wallet', () => {
    const wallet = walletService.createWallet('Test Wallet');
    const exported = walletService.exportWallet(wallet.id);
    
    expect(exported).toHaveProperty('publicKey');
    expect(exported).toHaveProperty('secretKey');
    expect(exported).toHaveProperty('name');
    expect(exported.publicKey).toBe(wallet.publicKey);
    expect(exported.name).toBe(wallet.name);
  });
});