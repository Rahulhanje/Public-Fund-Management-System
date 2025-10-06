import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proposal Details - Public Fund Management',
  description: 'Comprehensive proposal details with blockchain information and voting interface',
};

export default function ProposalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}