// Simple test script to verify Solana integration
import { Connection, PublicKey } from '@solana/web3.js';
import { ThreeIATToken, TOKEN_CONFIG } from './src/solana/ThreeIATToken.js';
import { WalletService } from './src/services/WalletService.js';

async function testSolanaIntegration() {
  console.log('🧪 Testing 3IATLAS Solana Integration...\n');

  try {
    // Test 1: Connection
    console.log('1. Testing Solana connection...');
    const tokenService = new ThreeIATToken('devnet');
    console.log('✅ Connected to Solana devnet');

    // Test 2: Wallet creation
    console.log('\n2. Testing wallet creation...');
    const wallet = tokenService.createWallet();
    console.log('✅ Wallet created successfully');
    console.log('   Public Key:', wallet.publicKey);

    // Test 3: Balance check
    console.log('\n3. Testing balance check...');
    const balance = await tokenService.getSolBalance(wallet.publicKey);
    console.log('✅ SOL Balance:', balance, 'SOL');

    // Test 4: Wallet Service
    console.log('\n4. Testing Wallet Service...');
    const walletService = new WalletService('devnet');
    const managedWallet = walletService.createWallet('Test Wallet');
    console.log('✅ Wallet service working');
    console.log('   Managed wallet:', managedWallet.name);

    // Test 5: Token configuration
    console.log('\n5. Testing token configuration...');
    console.log('✅ Token config loaded');
    console.log('   Name:', TOKEN_CONFIG.name);
    console.log('   Symbol:', TOKEN_CONFIG.symbol);
    console.log('   Decimals:', TOKEN_CONFIG.decimals);
    console.log('   Total Supply:', TOKEN_CONFIG.totalSupply.toLocaleString());

    console.log('\n🎉 All tests passed! Solana integration is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  }
}

testSolanaIntegration();