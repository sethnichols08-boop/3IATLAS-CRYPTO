# 3IATLAS Crypto - Solana Integration

## Overview

3IATLAS is a revolutionary cryptocurrency that combines the best features from Bitcoin's security, Ethereum's smart contracts, Shiba Inu's community engagement, and Solana's high-speed performance. This implementation provides a complete SPL token solution on the Solana blockchain.

## Features

### ✅ Solana Blockchain Integration
- **SPL Token Standard**: 3IAT implemented as a native Solana SPL token
- **High Performance**: Leverage Solana's 2000+ TPS and sub-second finality
- **Low Fees**: Transaction costs under $0.01
- **Proof of History**: Benefit from Solana's innovative consensus mechanism

### ✅ Wallet Management
- **Multi-Wallet Support**: Create and manage multiple Solana wallets
- **Secure Key Storage**: Local encrypted storage of private keys
- **Easy Import/Export**: Standard Solana wallet compatibility
- **HD Wallet Support**: Hierarchical deterministic wallet generation

### ✅ Token Operations
- **Transfers**: Send 3IAT tokens between wallets
- **Balance Checking**: Real-time balance updates
- **Transaction History**: Complete transaction logs
- **Minting Control**: Controlled token supply management

### ✅ User Interface
- **React Frontend**: Modern, responsive web interface
- **Wallet Dashboard**: Comprehensive wallet management
- **Transfer Interface**: Easy token transfer functionality
- **Transaction Explorer**: View and track all transactions

## Technical Specifications

| Property | Value |
|----------|-------|
| **Token Name** | 3IATLAS |
| **Symbol** | 3IAT |
| **Decimals** | 9 |
| **Total Supply** | 1,000,000,000 (1 Billion) |
| **Blockchain** | Solana |
| **Token Standard** | SPL Token |
| **Network** | Devnet (Testing) / Mainnet |

## Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/sethnichols08-boop/3IATLAS-CRYPTO.git
cd 3IATLAS-CRYPTO

# Install dependencies
npm install

# Build the application
npm run build:dev

# Start development server
npm run serve
```

### Deployment to Solana Devnet
```bash
# Deploy token to devnet
npm run deploy:devnet

# This will:
# 1. Create a new SPL token mint
# 2. Set up initial token accounts
# 3. Mint initial supply
# 4. Save deployment info to deployment-devnet.json
```

## Usage Guide

### 1. Wallet Creation
```javascript
import { WalletService } from './src/services/WalletService.js';

const walletService = new WalletService('devnet');
const wallet = walletService.createWallet('My Wallet');
console.log('Wallet created:', wallet.publicKey);
```

### 2. Token Operations
```javascript
import { ThreeIATToken } from './src/solana/ThreeIATToken.js';

const tokenService = new ThreeIATToken('devnet');

// Check balance
const balance = await tokenService.getTokenBalance(wallet);

// Transfer tokens
await tokenService.transferTokens(
  senderWallet, 
  recipientAddress, 
  amount
);
```

### 3. Frontend Components
```jsx
import WalletManager from './src/components/WalletManager.jsx';
import TokenTransfer from './src/components/TokenTransfer.jsx';

// Use in your React app
<WalletManager />
<TokenTransfer />
```

## Project Structure

```
3IATLAS-CRYPTO/
├── src/
│   ├── solana/
│   │   └── ThreeIATToken.js          # Core SPL token operations
│   ├── services/
│   │   └── WalletService.js          # Wallet management
│   ├── components/
│   │   ├── WalletManager.jsx         # Wallet UI component
│   │   └── TokenTransfer.jsx         # Transfer UI component
│   ├── styles/
│   │   └── App.css                   # Application styles
│   ├── App.jsx                       # Main React app
│   └── index.js                      # Entry point
├── public/
│   └── index.html                    # HTML template
├── scripts/
│   └── deploy-devnet.js             # Deployment script
├── tests/
│   └── token.test.js                # Test suite
├── package.json                      # Dependencies
├── webpack.config.js                # Build configuration
└── README.md                        # This file
```

## API Reference

### ThreeIATToken Class

#### Constructor
```javascript
new ThreeIATToken(network = 'devnet')
```

#### Methods
- `createWallet()` - Generate new Solana wallet
- `importWallet(secretKey)` - Import existing wallet
- `getSolBalance(publicKey)` - Get SOL balance
- `requestAirdrop(publicKey, amount)` - Request SOL airdrop (devnet only)
- `createToken(payer)` - Create new SPL token mint
- `getTokenBalance(wallet)` - Get token balance
- `transferTokens(sender, recipient, amount)` - Transfer tokens
- `getTransactionHistory(publicKey, limit)` - Get transaction history

### WalletService Class

#### Constructor
```javascript
new WalletService(network = 'devnet')
```

#### Methods
- `createWallet(name)` - Create managed wallet
- `importWallet(secretKey, name)` - Import managed wallet
- `getWallets()` - Get all wallets
- `getActiveWallet()` - Get currently active wallet
- `setActiveWallet(walletId)` - Switch active wallet
- `deleteWallet(walletId)` - Remove wallet
- `exportWallet(walletId)` - Export wallet keys

## Security Considerations

⚠️ **Important Security Notes:**

1. **Private Key Storage**: This implementation stores private keys in localStorage for development. In production, use secure key storage solutions.

2. **Network Security**: Always verify you're connecting to the correct Solana network.

3. **Devnet vs Mainnet**: Current implementation is configured for devnet. Devnet tokens have no real value.

4. **Transaction Verification**: Always verify transaction signatures and destinations before confirming.

## Testing

```bash
# Run test suite
npm test

# Run integration tests
node test-integration.js

# Test deployment
npm run deploy:devnet
```

## Development

### Building
```bash
# Development build
npm run build:dev

# Production build
npm run build

# Start development server
npm run serve
```

### Testing on Devnet
1. The application is configured for Solana devnet by default
2. Use the airdrop feature to get test SOL
3. Create and deploy your token for testing
4. All transactions are on devnet and have no real value

### Mainnet Deployment
To deploy on mainnet:
1. Change network configuration from 'devnet' to 'mainnet'
2. Ensure you have real SOL for transaction fees
3. Use `npm run deploy:mainnet` for production deployment
4. **Exercise extreme caution** - mainnet operations use real funds

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For questions and support:
- Open an issue on GitHub
- Review the documentation
- Check the test examples

---

**Disclaimer**: This software is provided for educational and development purposes. Always test thoroughly on devnet before deploying to mainnet. The developers are not responsible for any financial losses.