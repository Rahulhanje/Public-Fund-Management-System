'use client';

import { Proposal } from '@/lib/types';
import { getPublicFundingContract } from '@/lib/publicFundingContract';
import { useState } from 'react';

interface ProposalsListProps {
  proposals: Proposal[];
  isAdmin: boolean;
  showNotification: (message: string) => void;
  onError: (message: string) => void;
}

export function ProposalsList({ proposals, isAdmin, showNotification, onError }: ProposalsListProps) {
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);

  const closePublicVoting = async (proposalId: number) => {
    try {
      const contract = await getPublicFundingContract();
      const tx = await contract.closePublicVoting(proposalId);
      await tx.wait();

      showNotification(`Public voting closed for proposal #${proposalId}`);
    } catch (err) {
      console.error("Error closing public voting:", err);
      onError("Failed to close voting. " + (err as Error).message);
    }
  };

  const releaseStageAmount = async (proposalId: number) => {
    try {
      const contract = await getPublicFundingContract();
      const tx = await contract.releaseStageAmount(proposalId);
      await tx.wait();

      showNotification(`Stage funds released for proposal #${proposalId}`);
    } catch (err) {
      console.error("Error releasing stage amount:", err);
      onError("Failed to release funds. " + (err as Error).message);
    }
  };

  const shortenAddress = (address: string): string => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification("Address copied to clipboard!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">All Proposals</h2>
        <div className="text-sm text-gray-600">
          {proposals.length} total proposal{proposals.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-6">
        {proposals.map(proposal => (
          <div key={proposal.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-2xl font-bold text-gray-800">Proposal #{proposal.id}</h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    proposal.state === 'Completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                    proposal.state === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                    proposal.state === 'Approved' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    proposal.state === 'InProgress' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {proposal.state}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  {/* View Details Button */}
                  <button
                    onClick={() => setSelectedProposal(selectedProposal === proposal.id ? null : proposal.id)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    {selectedProposal === proposal.id ? 'Hide Details' : 'View Details'}
                  </button>
                  
                  {/* Comprehensive View Button */}
                  <button
                    onClick={() => {
                      // Create a new window/tab with comprehensive details
                      const url = `/proposal/${proposal.id}/comprehensive`;
                      window.open(url, '_blank');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    Full Details
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed">{proposal.description}</p>
            </div>

            {/* Quick Stats Section */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    <p className="text-gray-600 font-medium">Total Amount</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{proposal.totalAmount} ETH</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-600 font-medium">Progress</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{proposal.currentStage}/{proposal.totalStages}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(proposal.currentStage / proposal.totalStages) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600 font-medium">Public Votes</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">✓ {proposal.publicYesVotes}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-lg font-bold text-red-600">✗ {proposal.publicNoVotes}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-600 font-medium">Authority Votes</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">✓ {proposal.authorityYesVotes}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-lg font-bold text-red-600">✗ {proposal.authorityNoVotes}</span>
                  </div>
                </div>
              </div>

              {/* Recipient Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-800 font-medium mb-1">Recipient Address</p>
                    <div className="flex items-center">
                      <code className="text-sm font-mono text-blue-700 bg-blue-100 px-3 py-1 rounded">
                        {shortenAddress(proposal.recipient)}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(proposal.recipient)}
                        className="ml-2 text-blue-600 hover:text-blue-800 p-1"
                        title="Copy full address"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(`https://etherscan.io/address/${proposal.recipient}`, '_blank')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                    </svg>
                    View on Etherscan
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedProposal === proposal.id && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">📊 Detailed Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Voting Progress */}
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Public Voting Progress</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Yes: {proposal.publicYesVotes}</span>
                            <span>No: {proposal.publicNoVotes}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${proposal.publicYesVotes + proposal.publicNoVotes > 0 
                                  ? (proposal.publicYesVotes / (proposal.publicYesVotes + proposal.publicNoVotes)) * 100 
                                  : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Authority Voting Progress</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Yes: {proposal.authorityYesVotes}</span>
                            <span>No: {proposal.authorityNoVotes}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${proposal.authorityYesVotes + proposal.authorityNoVotes > 0 
                                  ? (proposal.authorityYesVotes / (proposal.authorityYesVotes + proposal.authorityNoVotes)) * 100 
                                  : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Info */}
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Timeline Information</h5>
                        <div className="space-y-2 text-sm">
                          {proposal.publicVotingEndTime > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Voting Ends:</span>
                              <span className="font-medium">
                                {new Date(proposal.publicVotingEndTime * 1000).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Stage:</span>
                            <span className="font-medium">{proposal.currentStage} of {proposal.totalStages}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Quick Actions</h5>
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              const data = {
                                id: proposal.id,
                                description: proposal.description,
                                recipient: proposal.recipient,
                                totalAmount: proposal.totalAmount,
                                state: proposal.state
                              };
                              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `proposal-${proposal.id}.json`;
                              a.click();
                            }}
                            className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            📄 Export Proposal Data
                          </button>
                          <button
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: `Proposal #${proposal.id}`,
                                  text: proposal.description,
                                  url: window.location.href + `#proposal-${proposal.id}`,
                                });
                              } else {
                                copyToClipboard(window.location.href + `#proposal-${proposal.id}`);
                              }
                            }}
                            className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            🔗 Share Proposal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Actions */}
              {isAdmin && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    Admin Actions
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {proposal.state === 'PublicVoting' && (
                      <button
                        onClick={() => closePublicVoting(proposal.id)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Close Public Voting
                      </button>
                    )}
                    {(proposal.state === 'Approved' || proposal.state === 'InProgress') && (
                      <button
                        onClick={() => releaseStageAmount(proposal.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Release Next Stage
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {proposals.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Proposals Found</h3>
            <p className="text-gray-500">No proposals have been created yet. Be the first to submit a proposal!</p>
          </div>
        )}
      </div>
    </div>
  );
}