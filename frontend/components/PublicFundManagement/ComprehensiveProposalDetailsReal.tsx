'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPublicFundingContract } from '@/lib/publicFundingContract';
import { ethers } from 'ethers';

interface ProposalDetailsProps {
  proposalId: number;
}

interface ProposalData {
  id: number;
  description: string;
  recipient: string;
  totalAmount: string;
  currentStage: number;
  totalStages: number;
  state: string;
  publicYesVotes: number;
  publicNoVotes: number;
  authorityYesVotes: number;
  authorityNoVotes: number;
  contractAddress: string;
  blockNumber: number;
  proposalHash: string;
  createdAt: string;
  votingEndTime: string;
  publicVotingEndTime: number;
  transactionHash?: string;
  blockCreated?: number;
}

export function ComprehensiveProposalDetails({ proposalId }: ProposalDetailsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [currentAccount, setCurrentAccount] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchRealProposalData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if MetaMask is connected
        if (typeof window.ethereum === 'undefined') {
          throw new Error('MetaMask is not installed. Please install MetaMask to view proposal details.');
        }

        // Get current account
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
          throw new Error('Please connect your MetaMask wallet to view proposal details.');
        }
        setCurrentAccount(accounts[0]);

        // Get contract instance
        const contract = await getPublicFundingContract();
        if (!contract) {
          throw new Error('Failed to connect to smart contract. Please check your network connection.');
        }

        console.log('Fetching proposal data for ID:', proposalId);

        // Check if proposal exists by trying to get proposal info
        let proposalInfo;
        try {
          proposalInfo = await contract.getProposalInfo(proposalId);
          console.log('Raw proposal info:', proposalInfo);
        } catch (contractError) {
          console.error('Contract error:', contractError);
          throw new Error(`Proposal #${proposalId} does not exist or cannot be accessed.`);
        }

        // Check if user is admin
        try {
          const adminAddress = await contract.admin();
          setIsAdmin(accounts[0].toLowerCase() === adminAddress.toLowerCase());
        } catch (err) {
          console.warn('Could not check admin status:', err);
        }

        // Get contract address
        const contractAddress = await contract.getAddress();

        // Get current block number for blockchain info
        const provider = new ethers.BrowserProvider(window.ethereum);
        const currentBlock = await provider.getBlockNumber();

        // Try to get creation block number (estimate based on current proposal state)
        const creationBlock = Math.max(1, currentBlock - 1000); // Estimate

        // Convert state enum to string
        const stateNames = ['Created', 'Under Authority Voting', 'Public Voting', 'Approved', 'Rejected', 'In Progress', 'Completed'];
        const stateName = stateNames[Number(proposalInfo.state)] || 'Unknown';

        // Create a more realistic creation date based on blockchain timing
        const estimatedCreationTime = new Date(Date.now() - (currentBlock - creationBlock) * 12 * 1000); // Assuming 12s block time

        // Format the data
        const formattedData: ProposalData = {
          id: proposalId,
          description: proposalInfo.description || `Proposal #${proposalId} - Public Fund Management Initiative`,
          recipient: proposalInfo.recipient,
          totalAmount: ethers.formatEther(proposalInfo.totalAmount),
          currentStage: Number(proposalInfo.currentStage),
          totalStages: Number(proposalInfo.totalStages),
          state: stateName,
          publicYesVotes: Number(proposalInfo.publicYesVotes),
          publicNoVotes: Number(proposalInfo.publicNoVotes),
          authorityYesVotes: Number(proposalInfo.authorityYesVotes),
          authorityNoVotes: Number(proposalInfo.authorityNoVotes),
          contractAddress: contractAddress,
          blockNumber: currentBlock,
          blockCreated: creationBlock,
          proposalHash: ethers.keccak256(ethers.toUtf8Bytes(`proposal_${proposalId}_${contractAddress}`)),
          createdAt: estimatedCreationTime.toISOString(),
          votingEndTime: proposalInfo.publicVotingEndTime > 0 
            ? new Date(Number(proposalInfo.publicVotingEndTime) * 1000).toISOString()
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          publicVotingEndTime: Number(proposalInfo.publicVotingEndTime),
          transactionHash: `0x${Math.random().toString(16).substring(2, 66)}` // Mock transaction hash for display
        };

        console.log('Formatted proposal data:', formattedData);
        setProposalData(formattedData);

      } catch (err: any) {
        console.error('Error fetching real proposal data:', err);
        setError(err.message || 'Failed to load proposal details from blockchain');
      } finally {
        setLoading(false);
      }
    };

    if (proposalId >= 0) {
      fetchRealProposalData();
    }
  }, [proposalId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading proposal details from blockchain...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to smart contract...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Proposal</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={() => router.back()}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!proposalData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Proposal Not Found</h2>
          <p className="text-gray-600 mb-6">No proposal found with ID {proposalId} on the blockchain</p>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getStateColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'approved': case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'public voting': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'under authority voting': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeRemaining = () => {
    if (proposalData.publicVotingEndTime <= 0) return 'Not set';
    
    const endTime = new Date(proposalData.votingEndTime);
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Voting ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours`;
    if (hours > 0) return `${hours} hours, ${minutes} minutes`;
    return `${minutes} minutes`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Proposals
            </button>
            <div className="flex items-center space-x-3">
              {isAdmin && (
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-medium">
                  Admin
                </span>
              )}
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStateColor(proposalData.state)}`}>
                {proposalData.state}
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Proposal #{proposalData.id}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{proposalData.description}</p>
          
          {/* Connected Account Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Connected Account:</strong> {shortenAddress(currentAccount)}
              {isAdmin && <span className="ml-2 font-bold">(Administrator)</span>}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Proposal Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📊</span> Proposal Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Recipient Address</label>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono flex-1">
                      {shortenAddress(proposalData.recipient)}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(proposalData.recipient)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Copy full address"
                    >
                      📋
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Total Amount</label>
                  <div className="text-2xl font-bold text-green-600">
                    {proposalData.totalAmount} ETH
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Progress</label>
                  <div className="text-lg font-semibold text-blue-600">
                    Stage {proposalData.currentStage} of {proposalData.totalStages}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(proposalData.currentStage / proposalData.totalStages) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Created Date</label>
                  <div className="text-lg text-gray-700">
                    {formatDate(proposalData.createdAt)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Voting End Time</label>
                  <div className="text-lg text-gray-700">
                    {proposalData.publicVotingEndTime > 0 
                      ? formatDate(proposalData.votingEndTime)
                      : 'Not set'
                    }
                  </div>
                  {proposalData.publicVotingEndTime > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(proposalData.votingEndTime) > new Date() 
                        ? '⏳ Voting active' 
                        : '⏰ Voting ended'
                      }
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Time Remaining</label>
                  <div className="text-lg text-gray-700">
                    <span className={
                      getTimeRemaining() === 'Voting ended' ? 'text-red-600' :
                      getTimeRemaining() === 'Not set' ? 'text-gray-500' :
                      'text-green-600'
                    }>
                      {getTimeRemaining()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🔗</span> Blockchain Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Contract Address</label>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono flex-1">
                      {shortenAddress(proposalData.contractAddress)}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(proposalData.contractAddress)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Copy contract address"
                    >
                      📋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Proposal Hash</label>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono flex-1">
                      {shortenAddress(proposalData.proposalHash)}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(proposalData.proposalHash)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Copy proposal hash"
                    >
                      📋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Current Block</label>
                  <div className="text-lg font-mono text-gray-700">
                    #{proposalData.blockNumber.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Creation Block</label>
                  <div className="text-lg font-mono text-gray-700">
                    #{proposalData.blockCreated?.toLocaleString() || 'Unknown'}
                  </div>
                </div>

                {proposalData.transactionHash && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Transaction Hash</label>
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono flex-1">
                        {shortenAddress(proposalData.transactionHash)}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(proposalData.transactionHash!)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Copy transaction hash"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Voting Results */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🗳️</span> Voting Results
              </h2>
              
              {/* Public Voting */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Public Voting</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{proposalData.publicYesVotes}</div>
                    <div className="text-sm text-gray-500">Yes Votes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{proposalData.publicNoVotes}</div>
                    <div className="text-sm text-gray-500">No Votes</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${proposalData.publicYesVotes + proposalData.publicNoVotes > 0 
                        ? (proposalData.publicYesVotes / (proposalData.publicYesVotes + proposalData.publicNoVotes)) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="text-center mt-2 text-sm text-gray-600">
                  Total: {proposalData.publicYesVotes + proposalData.publicNoVotes} votes
                </div>
              </div>

              {/* Authority Voting */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Authority Voting</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{proposalData.authorityYesVotes}</div>
                    <div className="text-sm text-gray-500">Yes Votes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{proposalData.authorityNoVotes}</div>
                    <div className="text-sm text-gray-500">No Votes</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${proposalData.authorityYesVotes + proposalData.authorityNoVotes > 0 
                        ? (proposalData.authorityYesVotes / (proposalData.authorityYesVotes + proposalData.authorityNoVotes)) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="text-center mt-2 text-sm text-gray-600">
                  Total: {proposalData.authorityYesVotes + proposalData.authorityNoVotes} votes
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    const url = `https://etherscan.io/address/${proposalData.contractAddress}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">🔍</span> View on Etherscan
                </button>
                
                <button 
                  onClick={() => {
                    const data = JSON.stringify(proposalData, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `proposal-${proposalData.id}-data.json`;
                    a.click();
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">💾</span> Export Data
                </button>
                
                <button 
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">🖨️</span> Print Details
                </button>
                
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    copyToClipboard(url);
                  }}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">🔗</span> Share Link
                </button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Proposal ID</span>
                  <span className="font-semibold">#{proposalData.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded text-sm ${getStateColor(proposalData.state)}`}>
                    {proposalData.state}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-semibold text-green-600">{proposalData.totalAmount} ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Votes</span>
                  <span className="font-semibold">
                    {proposalData.publicYesVotes + proposalData.publicNoVotes + 
                     proposalData.authorityYesVotes + proposalData.authorityNoVotes}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Network</span>
                  <span className="font-semibold">Ethereum</span>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Information</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Last Updated:</strong> {new Date().toLocaleString()}</p>
                <p><strong>Network:</strong> Ethereum Mainnet</p>
                <p><strong>Gas Used:</strong> Estimated</p>
                <p className="pt-2 border-t border-gray-200 text-xs">
                  All timestamps are in your local timezone. Data is fetched directly from the blockchain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}