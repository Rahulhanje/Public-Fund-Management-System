'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useProposals } from '@/hooks/useProposals';
import { useContractData } from '@/hooks/useContractData';
import { Dashboard } from './Dashboard';
import { AdminPanel } from './AdminPanel';
import { AuthorityPanel } from './AuthorityPanel';
import { ProposalsList } from './ProposalsList';
import { PublicVoting } from './PublicVoting';
import { StageReports } from './StageReports';
import { Header } from './Header';
import { Notification } from './Notification';
import { TabNavigation } from './TabNavigation';
import { ComprehensiveProposalDetails } from './ComprehensiveProposalDetails';
import { processError, processSuccess, type ErrorInfo } from '@/lib/errorUtils';

interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  duration?: number;
  persistent?: boolean;
}

export function PublicFundManagement() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const { account, isAdmin, isAuthority } = useWallet();
  const { proposals, loadProposals } = useProposals();
  const { contractBalance, loadContractData } = useContractData();

  useEffect(() => {
    loadContractData();
    loadProposals();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', persistent = false) => {
    if (type === 'success') {
      const cleanMessage = processSuccess(message);
      setNotification({
        message: cleanMessage,
        type: 'success',
        title: 'Success',
        duration: persistent ? 0 : 10000 // Increased from 5000 to 10000
      });
    } else {
      const errorInfo = processError(message);
      setNotification({
        message: errorInfo.message,
        type: errorInfo.type,
        title: errorInfo.title,
        duration: persistent ? 0 : (errorInfo.duration || 15000) // Increased from 8000 to 15000
      });
    }

    // Auto-hide notification after duration (only if not persistent)
    if (!persistent) {
      setTimeout(() => setNotification(null), type === 'success' ? 10000 : 15000);
    }
  };

  const showError = (error: any) => {
    const errorInfo = processError(error);
    setNotification({
      message: errorInfo.message,
      type: errorInfo.type,
      title: errorInfo.title,
      duration: 8000
    });

    setTimeout(() => setNotification(null), 8000);
  };

  if (!account) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading Public Fund Management System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Header 
        account={account}
        isAdmin={isAdmin}
        isAuthority={isAuthority}
        contractBalance={contractBalance}
        onRefresh={loadContractData}
      />

      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type}
          title={notification.title}
          onClose={() => setNotification(null)}
          showKeepVisible={notification.persistent}
        />
      )}

      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        isAuthority={isAuthority}
        proposals={proposals}
      />

      {activeTab === 'dashboard' && <Dashboard address={account} proposals={proposals} contractBalance={contractBalance} />}
      {activeTab === 'admin' && isAdmin && <AdminPanel showNotification={showNotification} onError={showError} />}
      {activeTab === 'authority' && isAuthority && <AuthorityPanel showNotification={showNotification} onError={showError} />}
      {activeTab === 'proposals' && <ProposalsList proposals={proposals} isAdmin={isAdmin} showNotification={showNotification} onError={showError} />}
      {activeTab === 'voting' && <PublicVoting proposals={proposals.filter(p => p.state === 'PublicVoting')} showNotification={showNotification} onError={showError} />}
      {activeTab === 'reports' && <StageReports proposals={proposals.filter(p => p.state === 'InProgress')} isAuthority={isAuthority} showNotification={showNotification} onError={showError} />}
    </div>
  );
}

export { ComprehensiveProposalDetails };