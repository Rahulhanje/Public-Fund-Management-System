# FundVerify: Automated Decentralised Government Fund Allocation and AI Verification

[![Next.js](https://img.shields.io/badge/Next.js-14.1.3-blue.svg)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-5.1.7-green.svg)](https://djangoproject.com/)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-black.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.22.19-yellow.svg)](https://hardhat.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)

## 🌟 Introduction

The **Public Fund Management System** is a revolutionary decentralized application (DApp) built on the Ethereum blockchain that transforms how government funds are allocated, managed, and monitored. By combining cutting-edge blockchain technology with artificial intelligence, we create a transparent, efficient, and tamper-proof system for public fund management.

## 📂 Project Structure

```
📦 Public-Fund-Management-System
├── 📁 backend/                 # Django REST API with AI verification
├── 📁 frontend/                # Next.js web application with Web3 integration
├── 📁 smart-contracts/         # Ethereum smart contracts (Solidity)
├── 📁 files/                   # Document storage and examples
├── 📄 README.md               # Project documentation (this file)
└── 📄 *.md                    # Additional documentation files
```

## 🚨 Problem Statement

Traditional government fund allocation faces several critical challenges:

1. **🔍 Lack of Transparency**: Citizens often have limited visibility into how public funds are allocated and spent
2. **⚡ Inefficient Verification**: Manual verification of fund utilization reports is time-consuming, prone to errors, and vulnerable to corruption
3. **⏰ Delayed Fund Disbursement**: Traditional bureaucratic processes create bottlenecks, delaying project implementation and increasing costs
4. **📊 Limited Accountability**: Without transparent tracking, it's difficult to hold recipients accountable for proper fund utilization

## 💡 Our Solution

Our Public Fund Management System addresses these challenges through a unique combination of blockchain technology and artificial intelligence:

### 🏗️ Core Components:

1. **⛓️ Ethereum-Based Smart Contracts**: Immutable contracts coded in Solidity that enforce transparent fund allocation rules
2. **🏛️ Decentralized Governance**: Multi-level approval system involving both authorities and public citizens
3. **📈 Staged Fund Distribution**: Funds released in installments, with each subsequent release contingent on proper utilization of previous funds
4. **🤖 AI-Powered Verification**: Automated document verification using RAG technology, LangChain, and generative AI to validate fund utilization reports

## ✨ Features & Workflow

### 👥 Admin and Authority Management

- The deployer of the smart contract becomes the Admin
- Admin can add or remove trusted authorities (government officials or trusted entities)
- Distributed responsibility ensures no single point of failure or control

### 🗳️ Proposal Creation & Internal Voting

- Any authorized Authority can create a funding proposal
- Other Authorities vote on the proposal for initial screening
- Proposals must receive >50% approval from Authorities to advance
- Failed proposals are rejected with transparent reasoning

### 🌍 Public Voting & Feedback

- Approved proposals are published for public review and voting
- We use **Soulbound Tokens (SBT)** for public identity verification, ensuring each citizen can vote only once
- Citizens can vote YES/NO and provide comments/feedback
- Admin closes voting after predetermined period
- Proposals with >50% public approval advance to funding stage

### 📋 Staged Fund Distribution

- Approved funds are allocated in three stages rather than a lump sum
- Stage 1: Initial funding released to Proposal Creator (Recipient)
- Recipient submits detailed utilization report before requesting next stage funding
- All report documents (PDFs) are uploaded to the IPFS network, with only the CID (Content Identifier) stored on the blockchain for efficient storage and immutability

### 🔬 AI-Powered Verification & Automated Progression

- Submitted reports are automatically verified using:
  - **Retrieval Augmented Generation (RAG)** technology
  - LangChain framework
  - Generative AI models
- Verification checks for:
  - Authenticity of receipts and documents
  - Alignment with proposal objectives
  - Appropriate fund utilization
- Upon successful verification, next stage funding is automatically released
- Failed verifications trigger review processes

## 🏗️ Technical Architecture

Our system is built with the following technologies:

### Frontend Stack
- **🖥️ Framework**: Next.js 14.1.3 with TypeScript
- **🎨 UI**: Tailwind CSS with Radix UI components
- **🔗 Web3**: Ethers.js for blockchain interaction
- **📱 State Management**: React hooks and context
- **🚀 Build Tool**: Next.js with optimized production builds

### Backend Stack
- **🐍 Framework**: Django 5.1.7 with Django REST Framework
- **🤖 AI/ML**: LangChain, Groq LLM, HuggingFace Transformers
- **📄 Document Processing**: PyPDF, python-docx, FAISS vector database
- **🌐 API**: RESTful API with CORS support
- **☁️ Deployment**: Gunicorn with WhiteNoise for static files

### Blockchain Stack
- **⛓️ Platform**: Ethereum blockchain
- **📝 Smart Contracts**: Solidity ^0.8.0
- **🔨 Development**: Hardhat framework
- **🧪 Testing**: Chai and Mocha testing framework
- **📚 Libraries**: OpenZeppelin contracts for security standards

### Storage & Infrastructure
- **🌐 Decentralized Storage**: IPFS network for document storage with CIDs recorded on-chain
- **📊 Database**: SQLite for development, PostgreSQL for production
- **🔐 Security**: Environment variables for sensitive configuration

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.8+ and pip
- **Git** for version control
- **MetaMask** or compatible Web3 wallet
- **Groq API Key** for AI services

### 1. Clone the Repository

```bash
git clone https://github.com/Rahulhanje/Public-Fund-Management-System-.git
cd Public-Fund-Management-System-
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create environment file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env
echo "DJANGO_SECRET_KEY=your_django_secret_key" >> .env

# Run migrations and start server
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Smart Contracts Setup

```bash
cd smart-contracts
npm install

# Create environment file for blockchain
echo "PRIVATE_KEY=your_private_key_here" > .env
echo "INFURA_PROJECT_ID=your_infura_project_id" >> .env

# Compile contracts
npx hardhat compile

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/analyze/

## 📖 Documentation

Each component has detailed documentation:

- **[Backend Documentation](./backend/README.md)** - Django API setup, endpoints, and AI verification
- **[Frontend Documentation](./frontend/README.md)** - Next.js components, Web3 integration, and UI
- **[Smart Contracts Documentation](./smart-contracts/README.md)** - Contract deployment, testing, and interaction

## 🌟 Key Benefits

- **🔍 Enhanced Transparency**: All transactions, votes, and decisions are permanently recorded on the blockchain
- **🏛️ Public Participation**: Citizens directly influence fund allocation decisions
- **🛡️ Fraud Prevention**: Smart contracts enforce rules and prevent unauthorized fund transfers
- **⚡ Efficiency**: AI-powered verification eliminates delays caused by manual document checking
- **📊 Accountability**: Stage-wise funding ensures recipients deliver before receiving additional funds
- **🚫 Reduced Corruption**: Automated verification and immutable records minimize opportunities for corruption

## 🔧 Environment Configuration

### Required Environment Variables

#### Backend (.env)
```env
GROQ_API_KEY=your_groq_api_key_here
DJANGO_SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

#### Smart Contracts (.env)
```env
PRIVATE_KEY=your_ethereum_private_key
INFURA_PROJECT_ID=your_infura_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Smart Contract Tests
```bash
cd smart-contracts
npx hardhat test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📦 Deployment

### Backend Deployment (Production)
```bash
# Set production environment variables
export DEBUG=False
export ALLOWED_HOSTS=yourdomain.com

# Install production dependencies
pip install gunicorn whitenoise

# Collect static files
python manage.py collectstatic

# Run with Gunicorn
gunicorn backend.wsgi:application
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Smart Contract Deployment (Mainnet/Testnet)
```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow TypeScript/Python best practices
- Write comprehensive tests for new features
- Update documentation for any API changes
- Use conventional commit messages
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Contact

For support, email us at [support@fundverify.com](mailto:support@fundverify.com) or create an issue in this repository.

- **📧 Email**: support@fundverify.com
- **🐛 Issues**: [GitHub Issues](https://github.com/Rahulhanje/Public-Fund-Management-System-/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/Rahulhanje/Public-Fund-Management-System-/discussions)

## 🙏 Acknowledgments

- **OpenZeppelin** for secure smart contract libraries
- **Hardhat** for excellent development framework
- **Next.js** team for the amazing React framework
- **Django** community for the robust backend framework
- **LangChain** for AI integration capabilities

---

**⭐ Star this repository if you find it helpful!**

## 📊 Sample Output

> This is a sample output file generated by AI, after first round report submission.

[View Sample Output PDF](files/output.pdf)

