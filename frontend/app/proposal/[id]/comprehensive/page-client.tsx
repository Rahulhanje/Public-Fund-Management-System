'use client';

import { useParams, useRouter } from 'next/navigation';
import { ComprehensiveProposalDetails } from '@/components/PublicFundManagement/ComprehensiveProposalDetailsReal';
import { ProposalErrorBoundary } from '@/components/PublicFundManagement/ProposalErrorBoundary';
import { Providers } from '@/app/providers';
import { useEffect, useState } from 'react';

export function ComprehensiveProposalPageClient() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [proposalId, setProposalId] = useState<number | null>(null);

  useEffect(() => {
    console.log('Params received:', params);
    const id = parseInt(params.id as string);
    console.log('Parsed ID:', id);
    
    if (isNaN(id) || id < 0) {
      setProposalId(null);
    } else {
      setProposalId(id);
    }
    setIsLoading(false);
  }, [params.id]);

  console.log('Rendering with proposalId:', proposalId, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading proposal details...</p>
        </div>
      </div>
    );
  }

  if (proposalId === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid Proposal ID</h1>
          <p className="text-gray-600 mb-6">The proposal ID "{params.id}" is not valid. Please check the URL and try again.</p>
          <div className="space-x-4">
            <button 
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
            <button 
              onClick={() => router.push('/dashboard/fund-mangement')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Proposals
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Providers>
      <ProposalErrorBoundary>
        <ComprehensiveProposalDetails proposalId={proposalId} />
      </ProposalErrorBoundary>
    </Providers>
  );
}