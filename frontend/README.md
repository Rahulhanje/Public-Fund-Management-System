# Frontend - Public Fund Management DApp

[![Next.js](https://img.shields.io/badge/Next.js-14.1.3-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-6.13.5-blue.svg)](https://ethers.io/)

## 🌟 Overview

The frontend is a modern, responsive web application built with Next.js and TypeScript that provides a user-friendly interface for the Public Fund Management System. It integrates seamlessly with Ethereum blockchain and provides real-time interaction with smart contracts.

## 🏗️ Architecture

```
📦 frontend/
├── 📁 app/                     # Next.js App Router
│   ├── 📄 layout.tsx          # Root layout component
│   ├── 📄 page.tsx            # Homepage
│   ├── 📄 globals.css         # Global styles
│   ├── 📄 providers.tsx       # Context providers
│   ├── 📁 dashboard/          # Dashboard pages
│   └── 📁 proposal/           # Proposal pages
├── 📁 components/             # React components
│   ├── 📁 PublicFundManagement/ # Main components
│   ├── 📁 ui/                 # Radix UI components
│   ├── 📄 ErrorTestComponent.tsx
│   ├── 📄 NotificationTestPage.tsx
│   └── 📄 ProposalDetails.tsx
├── 📁 hooks/                  # Custom React hooks
│   ├── 📄 use-toast.ts        # Toast notifications
│   ├── 📄 useAdminStatistics.ts
│   ├── 📄 useContractData.ts
│   ├── 📄 useProposals.ts
│   └── 📄 useWallet.ts
├── 📁 lib/                    # Utility libraries
│   ├── 📄 types.ts            # TypeScript types
│   ├── 📄 utils.ts            # Utility functions
│   ├── 📄 errorUtils.ts       # Error handling
│   ├── 📄 publicFundingContract.js
│   └── 📄 sbtTokenContract.js
├── 📄 package.json            # Dependencies
├── 📄 next.config.js          # Next.js configuration
├── 📄 tailwind.config.ts      # Tailwind configuration
├── 📄 tsconfig.json           # TypeScript configuration
└── 📄 README.md              # This file
```

## ✨ Features

### 🔐 Wallet Integration
- **MetaMask Connection**: Seamless Web3 wallet integration
- **Multi-Chain Support**: Ethereum mainnet and testnets
- **Account Management**: Automatic address detection and balance tracking
- **Transaction Monitoring**: Real-time transaction status updates

### 🏛️ Governance Features
- **Proposal Creation**: Authorities can create funding proposals
- **Multi-Stage Voting**: Authority and public voting mechanisms
- **Soulbound Token (SBT) Integration**: Unique voter identification
- **Real-time Updates**: Live proposal status and vote counts

### 💰 Fund Management
- **Stage-wise Distribution**: Three-stage fund release mechanism
- **Progress Tracking**: Visual progress indicators for each stage
- **Document Upload**: IPFS integration for report submissions
- **AI Verification Status**: Real-time verification results

### 📊 Dashboard Analytics
- **Contract Statistics**: Total funds, proposals, and voting data
- **User Analytics**: Personal voting history and proposal tracking
- **Admin Panel**: Administrative controls and system monitoring
- **Visual Charts**: Data visualization with Recharts

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first, responsive layout
- **Dark/Light Mode**: Theme switching capability
- **Component Library**: Radix UI components for accessibility
- **Toast Notifications**: Real-time user feedback
- **Loading States**: Skeleton screens and loading indicators

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **MetaMask** or compatible Web3 wallet
- **Running Backend** (see backend README)
- **Deployed Smart Contracts** (see smart-contracts README)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/Rahulhanje/Public-Fund-Management-System-.git
cd Public-Fund-Management-System-/frontend

# Install dependencies
npm install
# or
yarn install
```

### 2. Environment Configuration

Create a `.env.local` file in the frontend directory:

```env
# Smart Contract Addresses (Update after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x...

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=11155111  # Sepolia testnet
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# IPFS Configuration (if using)
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_web3_storage_token

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### 3. Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

### 4. Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 🔧 Configuration

### Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['ipfs.io', 'gateway.pinata.cloud'],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
}

module.exports = nextConfig
```

### Tailwind CSS Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more color definitions
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

## 🔗 Smart Contract Integration

### Contract Interaction

```typescript
// lib/publicFundingContract.js
import { ethers } from 'ethers';

export const getContract = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      contractABI,
      signer
    );
    return contract;
  }
  throw new Error('No Web3 provider found');
};

export const createProposal = async (description, totalAmount) => {
  const contract = await getContract();
  const tx = await contract.createProposal(description, totalAmount);
  return tx.wait();
};
```

### SBT Integration

```typescript
// lib/sbtTokenContract.js
export const getSBTContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS!,
    sbtABI,
    signer
  );
};

export const isRegisteredVoter = async (address) => {
  const contract = await getSBTContract();
  return await contract.isRegisteredVoter(address);
};
```

## 🪝 Custom Hooks

### useWallet Hook

```typescript
// hooks/useWallet.ts
export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  return { account, isConnected, chainId, connectWallet };
};
```

### useProposals Hook

```typescript
// hooks/useProposals.ts
export const useProposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    try {
      const contract = await getContract();
      const proposalCount = await contract.proposalCount();
      const proposalsData = [];

      for (let i = 1; i <= proposalCount; i++) {
        const proposal = await contract.proposals(i);
        proposalsData.push({
          id: Number(proposal.id),
          description: proposal.description,
          totalAmount: ethers.formatEther(proposal.totalAmount),
          state: proposal.state,
          // ... more fields
        });
      }

      setProposals(proposalsData);
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  return { proposals, loading, fetchProposals };
};
```

## 🎨 UI Components

### Component Structure

```typescript
// components/PublicFundManagement/dashboard.tsx
interface DashboardProps {
  address: string;
  proposals: Proposal[];
  contractBalance: string;
}

export function Dashboard({ address, proposals, contractBalance }: DashboardProps) {
  // Component logic
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Total Proposals" value={proposals.length} />
      <StatCard title="Contract Balance" value={`${contractBalance} ETH`} />
      <StatCard title="Your Proposals" value={userProposals.length} />
    </div>
  );
}
```

### Reusable UI Components

```typescript
// components/ui/button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

## 📡 API Integration

### Backend Communication

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const analyzeDocument = async (file: File, customQuestions?: string[]) => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (customQuestions) {
    formData.append('custom_questions', JSON.stringify(customQuestions));
  }

  const response = await fetch(`${API_BASE_URL}/analyze/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze document');
  }

  return response.json();
};
```

### Error Handling

```typescript
// lib/errorUtils.ts
export const handleContractError = (error: any) => {
  if (error.code === 4001) {
    return 'Transaction was rejected by the user';
  } else if (error.code === -32603) {
    return 'Internal JSON-RPC error';
  } else if (error.message?.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  }
  return 'An unexpected error occurred';
};
```

## 🎯 TypeScript Types

```typescript
// lib/types.ts
export enum ProposalState {
  Created = 0,
  UnderAuthorityVoting = 1,
  PublicVoting = 2,
  Approved = 3,
  Rejected = 4,
  InProgress = 5,
  Completed = 6
}

export interface Proposal {
  id: number;
  description: string;
  creator: string;
  totalAmount: string;
  state: ProposalState;
  authorityVoteCount: number;
  publicVoteCount: number;
  publicVoteDeadline: number;
  stages: Stage[];
  createdAt: number;
}

export interface Stage {
  amount: string;
  report: string;
  aiReport: string;
  voteCount: number;
  state: StageState;
}

export enum StageState {
  NotStarted = 0,
  InProgress = 1,
  Completed = 2
}
```

## 🧪 Testing

### Component Testing

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

### Example Test

```typescript
// __tests__/Dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import { Dashboard } from '@/components/PublicFundManagement/dashboard';

const mockProps = {
  address: '0x123...',
  proposals: [],
  contractBalance: '100'
};

test('renders dashboard with correct balance', () => {
  render(<Dashboard {...mockProps} />);
  expect(screen.getByText('100 ETH')).toBeInTheDocument();
});
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Export static files (if needed)
npm run export

# Deploy to your hosting service
```

### Environment Variables for Production

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=1  # Mainnet
NEXT_PUBLIC_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## 🔧 Performance Optimization

### Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const ProposalChart = dynamic(
  () => import('./ProposalChart'),
  { loading: () => <ChartSkeleton /> }
);
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Fund Verify Logo"
  width={200}
  height={100}
  priority
/>
```

### Bundle Analysis

```bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

# Run analysis
ANALYZE=true npm run build
```

## 📱 Responsive Design

### Breakpoint System

```css
/* globals.css */
.container {
  @apply mx-auto px-4 sm:px-6 lg:px-8;
}

.grid-responsive {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}
```

### Mobile-First Approach

```typescript
// Responsive component design
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/3">Sidebar</div>
  <div className="w-full md:w-2/3">Main Content</div>
</div>
```

## 🔒 Security Best Practices

### Input Validation

```typescript
const validateAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
```

### Environment Security

```typescript
// Never expose private keys in frontend
const isProduction = process.env.NODE_ENV === 'production';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Validate environment variables
if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is required');
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MetaMask Connection Issues
```typescript
// Check if MetaMask is installed
if (!window.ethereum) {
  alert('Please install MetaMask!');
  return;
}

// Handle account changes
window.ethereum.on('accountsChanged', (accounts) => {
  if (accounts.length === 0) {
    // User disconnected
    setAccount(null);
  } else {
    setAccount(accounts[0]);
  }
});
```

#### 2. Contract Interaction Errors
```typescript
try {
  const tx = await contract.createProposal(description, amount);
  await tx.wait();
} catch (error) {
  console.error('Transaction failed:', error);
  toast.error(handleContractError(error));
}
```

#### 3. Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit
```

## 📚 Additional Resources

### Key Dependencies

**Framework & Language:**
- `next@14.1.3` - React framework
- `typescript@5.4.2` - Type safety
- `react@18.2.0` - UI library

**Styling:**
- `tailwindcss@3.4.1` - Utility-first CSS
- `@radix-ui/*` - Accessible components
- `lucide-react@0.350.0` - Icons

**Web3 Integration:**
- `ethers@6.13.5` - Ethereum library
- `web3.storage@4.5.5` - IPFS integration

**UI Enhancement:**
- `react-hot-toast@2.5.2` - Notifications
- `recharts@2.15.4` - Charts
- `framer-motion` - Animations (if added)

### Useful Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npx tsc --noEmit     # Check TypeScript types

# Package management
npm outdated         # Check for outdated packages
npm audit            # Security audit
```

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Update documentation
5. Submit pull request

### Code Standards

- Use TypeScript for all new code
- Follow ESLint configuration
- Write tests for new components
- Use conventional commit messages
- Ensure responsive design

## 📄 License

This project is licensed under the MIT License - see the main repository LICENSE file for details.

## 🆘 Support

For frontend-specific issues:
- Check browser console for errors
- Verify MetaMask connection
- Check environment variables
- Review network configuration

---

**🔗 Related Documentation:**
- [Main Project README](../README.md)
- [Backend Documentation](../backend/README.md)
- [Smart Contracts Documentation](../smart-contracts/README.md)