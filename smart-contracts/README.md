# Smart Contracts - Ethereum Blockchain Infrastructure

[![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-black.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.22.19-yellow.svg)](https://hardhat.org/)
[![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-4.9.3-blue.svg)](https://openzeppelin.com/)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-6.15.0-blue.svg)](https://ethers.io/)

## 🌟 Overview

The smart contracts form the backbone of the Public Fund Management System, implementing a decentralized, transparent, and secure fund allocation mechanism on the Ethereum blockchain. The system consists of three main contracts that work together to provide complete governance and fund management functionality.

## 🏗️ Architecture

```
📦 smart-contracts/
├── 📁 contracts/              # Solidity smart contracts
│   ├── 📄 PublicFundManagement.sol    # Main governance contract
│   ├── 📄 PublicFundTreasury.sol      # Treasury management
│   ├── 📄 SBT.sol                     # Soulbound Token contract
│   └── 📄 sbgt.txt                    # Additional notes
├── 📁 scripts/               # Deployment scripts
│   ├── 📄 deploy.js          # Main deployment script
│   ├── 📄 deployTreasury.js  # Treasury deployment
│   └── 📄 update-frontend-env.js      # Environment updates
├── 📁 test/                  # Contract tests
│   └── 📄 PublicFundTreasury.js       # Test suite
├── 📁 artifacts/             # Compiled contracts
├── 📁 cache/                 # Hardhat cache
├── 📁 ignition/             # Deployment modules
├── 📄 hardhat.config.js      # Hardhat configuration
├── 📄 package.json           # Dependencies
├── 📄 deployments.json       # Deployment records
└── 📄 README.md             # This file
```

## 📋 Contract Overview

### 🏛️ PublicFundManagement.sol
**Primary governance and fund allocation contract**

**Key Features:**
- Multi-stage proposal workflow
- Authority and public voting mechanisms
- Staged fund distribution (3 stages)
- AI verification integration
- Immutable audit trail

**Core Functions:**
```solidity
// Proposal Management
function createProposal(string memory _description, uint256 _totalAmount) external
function voteOnProposal(uint256 _proposalId, bool _vote) external
function finalizeProposal(uint256 _proposalId) external

// Fund Distribution
function submitStageReport(uint256 _proposalId, uint256 _stageIndex, string memory _report) external
function releaseNextStage(uint256 _proposalId) external

// Authority Management
function addAuthority(address _authority) external onlyAdmin
function removeAuthority(address _authority) external onlyAdmin
```

### 🪙 SBT.sol (Soulbound Token)
**Identity verification and voting rights management**

**Key Features:**
- Non-transferable identity tokens
- Unique voter identification
- Application and approval process
- Nullifier-based privacy protection

**Core Functions:**
```solidity
// Identity Management
function applyForSBT(bytes32 _voterHash) external
function approveApplication(address applicant, uint128 _nullifier) external onlyOwner
function isRegisteredVoter(address voter) public view returns (bool)
function getTokenIdByAddress(address _address) external view returns (uint256)
```

### 💰 PublicFundTreasury.sol
**Secure fund storage and management**

**Key Features:**
- Multi-signature security
- Automatic fund allocation
- Emergency withdrawal mechanisms
- Transparent fund tracking

## ✨ Key Features

### 🗳️ Decentralized Governance
- **Two-Tier Voting**: Authority pre-screening followed by public voting
- **Proposal Lifecycle**: Created → Authority Voting → Public Voting → Approved/Rejected
- **Transparent Process**: All votes and decisions recorded on-chain

### 💸 Staged Fund Distribution
- **Three-Stage Release**: Initial, Progress, and Final funding stages
- **Report-Based Progression**: Each stage requires utilization reports
- **AI Verification**: Automated report verification using backend AI
- **Conditional Release**: Next stage unlocked only after verification

### 🔐 Identity Verification
- **Soulbound Tokens**: Non-transferable tokens for unique identification
- **Privacy Protection**: Hash-based identity with nullifiers
- **Application Process**: Controlled registration through admin approval
- **One-Person-One-Vote**: Prevents duplicate voting

### 📊 Transparency & Auditability
- **Immutable Records**: All transactions recorded on blockchain
- **Public Visibility**: Open access to proposal data and voting results
- **Event Logging**: Comprehensive event emission for tracking
- **Fund Tracking**: Complete audit trail of fund movements

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Hardhat** development environment
- **MetaMask** or compatible Web3 wallet
- **Ethereum testnet** access (Sepolia recommended)
- **Infura/Alchemy** RPC endpoint

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/Rahulhanje/Public-Fund-Management-System-.git
cd Public-Fund-Management-System-/smart-contracts

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the smart-contracts directory:

```env
# Deployment Configuration
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Optional: Contract Verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Network Configuration
CHAIN_ID=11155111  # Sepolia testnet

# Gas Configuration
GAS_LIMIT=8000000
GAS_PRICE=20000000000  # 20 gwei
```

### 3. Compile Contracts

```bash
# Compile all contracts
npx hardhat compile

# Force recompile
npx hardhat compile --force
```

### 4. Local Development

```bash
# Start local Hardhat network
npx hardhat node

# In another terminal, deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Testnet Deployment

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Verify contracts on Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/PublicFundTreasury.js

# Run tests with gas reporting
npx hardhat test --gas-report

# Run tests with coverage
npx hardhat coverage
```

## 🚀 Deployment Commands

### Local Network

```bash
# Start local Hardhat network
npx hardhat node

# Deploy contracts to local network
npx hardhat run scripts/deploy.js --network localhost
```

### Sepolia Testnet

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Verify contracts on Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## 🔒 Security Features

- **Access Control**: Role-based permissions for admin and authorities
- **Reentrancy Protection**: Prevention of reentrancy attacks
- **Input Validation**: Comprehensive parameter validation
- **Emergency Mechanisms**: Emergency stop functionality
- **Soulbound Tokens**: Non-transferable identity verification

## 📊 Gas Optimization

- **Efficient Data Structures**: Packed structs for gas efficiency
- **Batch Operations**: Multiple operations in single transaction
- **Event Optimization**: Indexed parameters for efficient filtering
- **Compiler Optimization**: Enabled optimizer with 200 runs

## 🔧 Useful Commands

```bash
# Contract compilation
npx hardhat compile
npx hardhat clean && npx hardhat compile

# Testing
npx hardhat test
npx hardhat test --grep "specific test"
npx hardhat coverage

# Deployment
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/deploy.js --network sepolia

# Verification
npx hardhat verify --network sepolia CONTRACT_ADDRESS CONSTRUCTOR_ARGS

# Network management
npx hardhat node
npx hardhat console --network localhost
```

## 📚 Additional Resources

### Contract Interfaces

The system provides clean interfaces for external integration:

- **ISBT Interface**: For identity verification functionality
- **ITreasury Interface**: For treasury management operations
- **Core Events**: Comprehensive event logging for transparency

### Security Considerations

- Role-based access control implementation
- Reentrancy protection mechanisms
- Input validation and error handling
- Emergency stop functionality
- Secure fund management practices

## 🤝 Contributing

### Development Guidelines

1. **Code Style**: Follow Solidity style guide and best practices
2. **Testing**: Write comprehensive tests for all contract functions
3. **Documentation**: Document all public functions and interfaces
4. **Security**: Implement and verify security best practices
5. **Gas Optimization**: Optimize contracts for gas efficiency

### Security Audit Checklist

- [ ] Reentrancy protection implemented
- [ ] Access control properly configured
- [ ] Input validation for all functions
- [ ] Emergency mechanisms in place
- [ ] Comprehensive event logging
- [ ] Gas optimization considerations

## 📄 License

This project is licensed under the MIT License - see the main repository LICENSE file for details.

## 🆘 Support

For smart contract specific issues:
- Check contract events and transaction logs
- Verify gas limits and network configuration
- Test thoroughly on local network before testnet deployment
- Use Hardhat console for debugging and testing

---

**🔗 Related Documentation:**
- [Main Project README](../README.md)
- [Backend Documentation](../backend/README.md)
- [Frontend Documentation](../frontend/README.md)
