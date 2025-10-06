import { ComprehensiveProposalPageClient } from './page-client';

// Generate static params for static export - matching existing pattern
export function generateStaticParams() {
  return [
    { id: '0' },
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
    { id: '11' },
    { id: '12' },
    { id: '13' },
    { id: '14' },
    { id: '15' }
  ];
}

export default function ComprehensiveProposalPage() {
  return <ComprehensiveProposalPageClient />;
}