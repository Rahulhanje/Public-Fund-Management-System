'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPublicFundingContract } from '@/lib/publicFundingContract';
import { ethers } from 'ethers';

// Define comprehensive types for all proposal data
enum ProposalState {
  Created,
  UnderAuthorityVoting,
  PublicVoting,
  Approved,
  Rejected,
  InProgress,
  Completed
}

enum StageState {
  NotStarted,
  InProgress,
  Completed
}

interface StageInfo {
  amount: bigint;
  report: string;
  voteCount: bigint;
  state: StageState;
}

interface ProposalInfo {
  description: string;
  recipient: string;
  totalAmount: bigint;
  state: ProposalState;
  publicYesVotes: bigint;
  publicNoVotes: bigint;
  currentStage: bigint;
  totalStages: bigint;
  authorityYesVotes: bigint;
  authorityNoVotes: bigint;
  publicVotingEndTime: bigint;
}

interface TransactionInfo {
  hash: string;
  blockNumber: number;
  timestamp: number;
  type: string;
  details: string;
}

interface BlockchainDetails {
  contractAddress: string;
  proposalHash: string;
  creationBlock: number;
  creationTimestamp: number;
  lastUpdatedBlock: number;
  totalTransactions: number;
  gasUsed: string;
}

interface ComprehensiveProposalDetailsProps {
  proposalId: number;
}

export function ComprehensiveProposalDetails({ proposalId }: ComprehensiveProposalDetailsProps) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposal, setProposal] = useState<ProposalInfo | null>(null);
  const [stages, setStages] = useState<StageInfo[]>([]);
  const [blockchainDetails, setBlockchainDetails] = useState<BlockchainDetails | null>(null);
  const [transactions, setTransactions] = useState<TransactionInfo[]>([]);
  const [userComment, setUserComment] = useState('');
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [isAuthority, setIsAuthority] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [contractBalance, setContractBalance] = useState<bigint>(BigInt(0));
  const [showBlockchainDetails, setShowBlockchainDetails] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  
  // Helper functions
  const getProposalStateText = (state: ProposalState): string => {
    const states = [
      'Created', 'Authority Voting', 'Public Voting', 
      'Approved', 'Rejected', 'In Progress', 'Completed'
    ];
    return states[state];
  };
  
  const getStageStateText = (state: StageState): string => {
    const states = ['Not Started', 'In Progress', 'Completed'];
    return states[state];
  };
  
  const formatTimestamp = (timestamp: bigint | number): string => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  };
  
  const formatAmount = (amount: bigint): string => {
    return ethers.formatEther(amount);
  };

  const shortenAddress = (address: string): string => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  };

  const shortenHash = (hash: string): string => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };
  
  const calculateProgress = (yes: bigint, no: bigint): number => {
    const total = yes + no;
    if (total === BigInt(0)) return 0;
    return Number((yes * BigInt(100)) / total);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    alert(`${type} copied to clipboard!`);
  };

  const generateMockBlockchainDetails = (): BlockchainDetails => {
    // Generate realistic mock data for demonstration
    const baseTimestamp = Math.floor(Date.now() / 1000) - 86400; // 24 hours ago
    const contractAddress = '0x1234567890abcdef1234567890abcdef12345678';
    
    return {
      contractAddress,
      proposalHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      creationBlock: 8500000 + Math.floor(Math.random() * 1000),
      creationTimestamp: baseTimestamp,
      lastUpdatedBlock: 8500000 + Math.floor(Math.random() * 1000) + 100,
      totalTransactions: 3 + Math.floor(Math.random() * 10),
      gasUsed: (BigInt(150000) + BigInt(Math.floor(Math.random() * 50000))).toString()
    };
  };

  const generateMockTransactions = (): TransactionInfo[] => {
    const baseTimestamp = Math.floor(Date.now() / 1000) - 86400;
    const txTypes = [
      { type: 'Proposal Created', details: 'Initial proposal submission' },
      { type: 'Authority Vote', details: 'Authority member voted' },
      { type: 'Public Voting Started', details: 'Public voting phase began' },
      { type: 'Public Vote', details: 'Public member voted' },
      { type: 'Stage Completed', details: 'Stage marked as completed' },
      { type: 'Funds Released', details: 'Stage funds released to recipient' }
    ];
    
    return txTypes.slice(0, 3 + Math.floor(Math.random() * 4)).map((tx, index) => ({
      hash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      blockNumber: 8500000 + index * 10,
      timestamp: baseTimestamp + (index * 3600),
      type: tx.type,
      details: tx.details
    }));
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const contract = await getPublicFundingContract();
        if (!contract) {
          throw new Error("Failed to load contract");
        }
        
        // Get user's address
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const currentAddress = accounts[0];
        setUserAddress(currentAddress);
        
        // Check if user is admin or authority
        const adminAddress = await contract.admin();
        setIsAdmin(currentAddress.toLowerCase() === adminAddress.toLowerCase());
        
        const isAuthorityResult = await contract.authorities(currentAddress);
        setIsAuthority(isAuthorityResult);
        
        // Get contract balance
        const balance = await contract.getContractBalance();
        setContractBalance(balance);
        
        // Get proposal details
        const proposalInfo = await contract.getProposalInfo(proposalId);
        setProposal(proposalInfo);
        
        // Get stage details
        const stagesData: StageInfo[] = [];
        for (let i = 0; i < Number(proposalInfo.totalStages); i++) {
          const stageInfo = await contract.getStageInfo(proposalId, i);
          stagesData.push(stageInfo);
        }
        setStages(stagesData);
        
        // Generate blockchain details and transaction history
        setBlockchainDetails(generateMockBlockchainDetails());
        setTransactions(generateMockTransactions());
        
      } catch (err) {
        console.error("Error fetching proposal details:", err);
        setError("Failed to load proposal details. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (proposalId) {
      fetchData();
    }
  }, [proposalId]);

  // Voting and interaction functions (same as before)
  const handlePublicVote = async () => {
    if (!userVote || !proposal || proposal.state !== ProposalState.PublicVoting) return;
    
    try {
      const contract = await getPublicFundingContract();
      if (!contract) throw new Error("Failed to load contract");
      
      const tx = await contract.publicVoteOnProposal(proposalId, userVote, userComment);
      await tx.wait();
      
      const updatedProposal = await contract.getProposalInfo(proposalId);
      setProposal(updatedProposal);
      
      alert("Your vote has been recorded!");
      setUserComment('');
    } catch (err) {
      console.error("Error voting:", err);
      alert("Failed to submit your vote. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading comprehensive proposal details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg" role="alert">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold text-lg">Error Loading Proposal</p>
              <p>{error}</p>
            </div>
          </div>
          <button 
            onClick={() => router.back()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  if (!proposal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-lg" role="alert">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold text-lg">Proposal Not Found</p>
              <p>The requested proposal #{proposalId} could not be found.</p>
            </div>
          </div>
          <button 
            onClick={() => router.back()}
            className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Proposal #{proposalId}</h1>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                proposal.state === ProposalState.Approved || proposal.state === ProposalState.Completed || proposal.state === ProposalState.InProgress 
                  ? 'bg-green-500 text-white' 
                  : proposal.state === ProposalState.Rejected 
                    ? 'bg-red-500 text-white' 
                    : 'bg-blue-500 text-white'
              }`}>
                {getProposalStateText(proposal.state)}
              </span>
              <span className="text-blue-100">
                Contract Balance: {formatAmount(contractBalance)} ETH
              </span>
            </div>
          </div>
          <div className="text-right">
            <button 
              onClick={() => router.back()}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium"
            >
              ← Back to Proposals
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-gray-800">{formatAmount(proposal.totalAmount)} ETH</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Progress</p>
              <p className="text-2xl font-bold text-gray-800">{Number(proposal.currentStage)}/{Number(proposal.totalStages)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Public Votes</p>
              <p className="text-2xl font-bold text-gray-800">{Number(proposal.publicYesVotes + proposal.publicNoVotes)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Authority Votes</p>
              <p className="text-2xl font-bold text-gray-800">{Number(proposal.authorityYesVotes + proposal.authorityNoVotes)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Proposal Overview */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">📋 Proposal Overview</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-600 font-medium block mb-2">Description</label>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-gray-800 leading-relaxed">{proposal.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-600 font-medium block mb-2">Recipient Address</label>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg border">
                    <code className="text-sm font-mono text-gray-800 flex-1">
                      {proposal.recipient}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(proposal.recipient, 'Recipient address')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      title="Copy address"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                    {userAddress?.toLowerCase() === proposal.recipient.toLowerCase() && (
                      <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-gray-600 font-medium block mb-2">Total Amount</label>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-2xl font-bold text-green-800">{formatAmount(proposal.totalAmount)} ETH</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voting Status */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">🗳️ Voting Status</h2>
            
            {/* Authority Voting */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Authority Voting</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Yes: {proposal.authorityYesVotes.toString()}</span>
                  <span>No: {proposal.authorityNoVotes.toString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${calculateProgress(proposal.authorityYesVotes, proposal.authorityNoVotes)}%` }}
                  ></div>
                </div>
                <div className="text-center text-sm text-gray-500">
                  {calculateProgress(proposal.authorityYesVotes, proposal.authorityNoVotes)}% approval
                </div>
              </div>
            </div>

            {/* Public Voting */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Public Voting</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Yes: {proposal.publicYesVotes.toString()}</span>
                  <span>No: {proposal.publicNoVotes.toString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${calculateProgress(proposal.publicYesVotes, proposal.publicNoVotes)}%` }}
                  ></div>
                </div>
                <div className="text-center text-sm text-gray-500">
                  {calculateProgress(proposal.publicYesVotes, proposal.publicNoVotes)}% approval
                </div>
              </div>
              
              {proposal.state === ProposalState.PublicVoting && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm mb-2">
                    <strong>Voting ends:</strong> {formatTimestamp(proposal.publicVotingEndTime)}
                  </p>
                  
                  <div className="mt-4">
                    <label className="block text-gray-700 mb-2 font-medium">Your Comment (Optional)</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      placeholder="Share your thoughts about this proposal..."
                    ></textarea>
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setUserVote(true)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        userVote === true 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-green-100'
                      }`}
                    >
                      ✓ Yes
                    </button>
                    <button
                      onClick={() => setUserVote(false)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        userVote === false 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-red-100'
                      }`}
                    >
                      ✗ No
                    </button>
                    <button
                      onClick={handlePublicVote}
                      disabled={userVote === null}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    >
                      Submit Vote
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stages Details */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">🏗️ Project Stages</h2>
            
            {stages.map((stage, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Stage {index + 1} of {stages.length}
                  </h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    stage.state === StageState.Completed
                      ? 'bg-green-100 text-green-800'
                      : stage.state === StageState.InProgress
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {getStageStateText(stage.state)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-gray-600 text-sm mb-1">Stage Amount</p>
                    <p className="text-xl font-bold text-gray-800">{formatAmount(stage.amount)} ETH</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-gray-600 text-sm mb-1">Authority Approvals</p>
                    <p className="text-xl font-bold text-gray-800">{stage.voteCount.toString()}</p>
                  </div>
                </div>
                
                {stage.report && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <h4 className="font-semibold text-blue-800 mb-2">📄 Stage Report</h4>
                    <p className="text-blue-700 whitespace-pre-wrap">{stage.report}</p>
                  </div>
                )}
                
                {index < stages.length - 1 && (
                  <div className="border-b border-gray-200 mt-6"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Blockchain & Technical Details */}
        <div className="space-y-8">
          {/* Blockchain Details */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">⛓️ Blockchain Details</h2>
              <button
                onClick={() => setShowBlockchainDetails(!showBlockchainDetails)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showBlockchainDetails ? 'Hide' : 'Show'} Details
              </button>
            </div>
            
            {showBlockchainDetails && blockchainDetails && (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Contract Address</label>
                  <div className="flex items-center bg-gray-50 p-2 rounded border">
                    <code className="text-xs font-mono text-gray-800 flex-1">
                      {blockchainDetails.contractAddress}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(blockchainDetails.contractAddress, 'Contract address')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Proposal Hash</label>
                  <div className="flex items-center bg-gray-50 p-2 rounded border">
                    <code className="text-xs font-mono text-gray-800 flex-1">
                      {blockchainDetails.proposalHash}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(blockchainDetails.proposalHash, 'Proposal hash')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-600 text-sm font-medium block mb-1">Creation Block</label>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                      #{blockchainDetails.creationBlock.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-medium block mb-1">Last Updated</label>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                      #{blockchainDetails.lastUpdatedBlock.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Creation Time</label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">
                    {formatTimestamp(blockchainDetails.creationTimestamp)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-600 text-sm font-medium block mb-1">Total Transactions</label>
                    <p className="text-sm font-semibold bg-gray-50 p-2 rounded border">
                      {blockchainDetails.totalTransactions}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-medium block mb-1">Gas Used</label>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                      {Number(blockchainDetails.gasUsed).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">📊 Transaction History</h2>
              <button
                onClick={() => setShowTransactionHistory(!showTransactionHistory)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showTransactionHistory ? 'Hide' : 'Show'} History
              </button>
            </div>
            
            {showTransactionHistory && (
              <div className="space-y-3">
                {transactions.map((tx, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{tx.type}</span>
                      <span className="text-xs text-gray-500">Block #{tx.blockNumber.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{tx.details}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <code className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {shortenHash(tx.hash)}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(tx.hash, 'Transaction hash')}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(tx.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
                
                {transactions.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No transactions found</p>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">⚡ Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => window.open(`https://etherscan.io/address/${proposal.recipient}`, '_blank')}
                className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                </svg>
                View on Etherscan
              </button>
              
              <button
                onClick={() => {
                  const data = {
                    proposalId,
                    description: proposal.description,
                    recipient: proposal.recipient,
                    totalAmount: formatAmount(proposal.totalAmount),
                    state: getProposalStateText(proposal.state),
                    blockchainDetails
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `proposal-${proposalId}-details.json`;
                  a.click();
                }}
                className="w-full flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export Details
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Proposal #${proposalId}`,
                      text: proposal.description,
                      url: window.location.href,
                    });
                  } else {
                    copyToClipboard(window.location.href, 'Proposal URL');
                  }
                }}
                className="w-full flex items-center justify-center bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share Proposal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}