'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPublicFundingContract } from '@/lib/publicFundingContract';
import { ethers } from 'ethers';

interface SimpleProposalDetailsProps {
  proposalId: number;
}

// Define enums to match smart contract
enum ProposalState {
  Created,
  UnderAuthorityVoting,
  PublicVoting,
  Approved,
  Rejected,
  InProgress,
  Completed
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
}

export function ComprehensiveProposalDetails({ proposalId }: SimpleProposalDetailsProps) {
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

        // Convert state enum to string
        const stateNames = ['Created', 'Under Authority Voting', 'Public Voting', 'Approved', 'Rejected', 'In Progress', 'Completed'];
        const stateName = stateNames[Number(proposalInfo.state)] || 'Unknown';

        // Format the data
        const formattedData: ProposalData = {
          id: proposalId,
          description: proposalInfo.description || `Proposal #${proposalId}`,
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
          proposalHash: ethers.keccak256(ethers.toUtf8Bytes(`proposal_${proposalId}_${contractAddress}`)),
          createdAt: new Date().toISOString(), // Current time as creation time for now
          votingEndTime: proposalInfo.publicVotingEndTime > 0 
            ? new Date(Number(proposalInfo.publicVotingEndTime) * 1000).toISOString()
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          publicVotingEndTime: Number(proposalInfo.publicVotingEndTime)
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
      minute: '2-digit'
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
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Proposal Overview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Recipient Address</label>
                    <div className="flex items-center mt-1">
                      <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono flex-1">
                        {shortenAddress(proposalData.recipient)}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(proposalData.recipient)}
                        className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                        title="Copy full address"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Amount</label>
                    <p className="text-2xl font-bold text-green-600 mt-1">{proposalData.totalAmount} ETH</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Progress</label>
                    <div className="mt-1">
                      <p className="text-lg font-semibold text-gray-800">
                        Stage {proposalData.currentStage} of {proposalData.totalStages}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${(proposalData.currentStage / proposalData.totalStages) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Voting Deadline</label>
                    <p className="text-lg font-semibold text-gray-800 mt-1">
                      {new Date(proposalData.votingEndTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Details Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                </svg>
                Blockchain Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Contract Address</label>
                  <div className="flex items-center mt-1">
                    <code className="text-sm font-mono text-gray-800 flex-1">
                      {shortenAddress(proposalData.contractAddress)}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(proposalData.contractAddress)}
                      className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Proposal Hash</label>
                  <div className="flex items-center mt-1">
                    <code className="text-sm font-mono text-gray-800 flex-1">
                      {shortenAddress(proposalData.proposalHash)}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(proposalData.proposalHash)}
                      className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Block Number</label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">{proposalData.blockNumber.toLocaleString()}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Created Date</label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {new Date(proposalData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-4">
                <button 
                  onClick={() => window.open(`https://etherscan.io/address/${proposalData.contractAddress}`, '_blank')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                  </svg>
                  View on Etherscan
                </button>
                
                <button 
                  onClick={() => {
                    const data = JSON.stringify(proposalData, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `proposal-${proposalData.id}.json`;
                    a.click();
                  }}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voting Results */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Voting Results</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Public Votes</span>
                    <span className="text-sm text-gray-500">
                      {proposalData.publicYesVotes + proposalData.publicNoVotes} total
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-green-600 font-semibold">✓ {proposalData.publicYesVotes}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(proposalData.publicYesVotes / (proposalData.publicYesVotes + proposalData.publicNoVotes)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-red-600 font-semibold">✗ {proposalData.publicNoVotes}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Authority Votes</span>
                    <span className="text-sm text-gray-500">
                      {proposalData.authorityYesVotes + proposalData.authorityNoVotes} total
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-green-600 font-semibold">✓ {proposalData.authorityYesVotes}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(proposalData.authorityYesVotes / (proposalData.authorityYesVotes + proposalData.authorityNoVotes)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-red-600 font-semibold">✗ {proposalData.authorityNoVotes}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Proposal #${proposalData.id}`,
                        text: proposalData.description,
                        url: window.location.href,
                      });
                    } else {
                      copyToClipboard(window.location.href);
                    }
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Share Proposal
                </button>
                
                <button 
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                  </svg>
                  Print Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}