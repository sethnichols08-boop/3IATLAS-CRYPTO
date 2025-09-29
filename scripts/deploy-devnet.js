// Note: This script needs to be run with experimental modules support
// or converted to use dynamic imports for ES6 modules

async function deployToDevnet() {
  // Dynamic import for ES6 modules
  const { ThreeIATToken, TOKEN_CONFIG } = await import('../src/solana/ThreeIATToken.js');
  console.log('🚀 Deploying 3IAT Token to Solana Devnet...');
  console.log('Token Configuration:', TOKEN_CONFIG);

  try {
    // Initialize token service
    const tokenService = new ThreeIATToken('devnet');
    
    // Create a wallet for deployment (mint authority)
    console.log('\n📝 Creating deployment wallet...');
    const deployWallet = tokenService.createWallet();
    console.log('Deployment wallet created:', deployWallet.publicKey);
    
    // Request airdrop for deployment costs
    console.log('\n💰 Requesting SOL airdrop for deployment...');
    await tokenService.requestAirdrop(deployWallet.publicKey, 2);
    console.log('Airdrop completed');
    
    // Create the token
    console.log('\n🪙 Creating 3IAT token...');
    const mintAddress = await tokenService.createToken(deployWallet);
    console.log('3IAT Token successfully created!');
    console.log('Mint Address:', mintAddress);
    
    // Create token account for the deployer
    console.log('\n🏦 Creating token account...');
    const tokenAccount = await tokenService.getTokenAccount(deployWallet);
    console.log('Token account created:', tokenAccount.address.toString());
    
    // Mint initial supply to deployer
    console.log('\n⚡ Minting initial supply...');
    const initialSupply = 1000000; // 1 million tokens for testing
    await tokenService.mintTokens(deployWallet, initialSupply, deployWallet);
    console.log(`Minted ${initialSupply} 3IAT tokens to deployment wallet`);
    
    // Output deployment summary
    console.log('\n✅ Deployment Summary:');
    console.log('='.repeat(50));
    console.log('Network:', 'Devnet');
    console.log('Token Name:', TOKEN_CONFIG.name);
    console.log('Token Symbol:', TOKEN_CONFIG.symbol);
    console.log('Decimals:', TOKEN_CONFIG.decimals);
    console.log('Total Supply:', TOKEN_CONFIG.totalSupply.toLocaleString());
    console.log('Mint Address:', mintAddress);
    console.log('Deployer Address:', deployWallet.publicKey);
    console.log('Initial Minted:', initialSupply.toLocaleString());
    console.log('='.repeat(50));
    
    // Save deployment info
    const deploymentInfo = {
      network: 'devnet',
      tokenConfig: TOKEN_CONFIG,
      mintAddress: mintAddress,
      deployerAddress: deployWallet.publicKey,
      deployerSecretKey: deployWallet.secretKey,
      deployedAt: new Date().toISOString(),
      initialSupply: initialSupply,
    };
    
    require('fs').writeFileSync(
      './deployment-devnet.json',
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('\n📄 Deployment info saved to deployment-devnet.json');
    console.log('\n🎉 Deployment completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

if (require.main === module) {
  deployToDevnet();
}

module.exports = { deployToDevnet };