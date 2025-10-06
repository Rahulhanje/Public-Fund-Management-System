'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProposalPageClient() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // Redirect to comprehensive view
    router.replace(`/proposal/${params.id}/comprehensive`);
  }, [params.id, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to comprehensive view...</p>
      </div>
    </div>
  );
}