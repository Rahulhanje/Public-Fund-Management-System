import React, { useState } from 'react';
import { Notification } from './PublicFundManagement/Notification';

export function NotificationTestPage() {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    persistent?: boolean;
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info', persistent = false) => {
    setNotification({
      message,
      type,
      title: type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : 'Information',
      persistent
    });

    // Auto-hide if not persistent
    if (!persistent) {
      setTimeout(() => setNotification(null), 8000);
    }
  };

  const simulateAIProcessing = () => {
    // Step 1: Show processing
    showNotification("🔄 Document is being processed by AI...", 'info', false);
    
    setTimeout(() => {
      // Step 2: Show result (persistent)
      const isApproved = Math.random() > 0.5;
      if (isApproved) {
        showNotification("✅ AI Review Complete: Document APPROVED! Stage will be completed and funds released.", 'success', true);
      } else {
        showNotification("❌ AI Review Complete: Document REJECTED. Please review and resubmit with corrections.", 'error', true);
      }
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Document Processing Notification Test</h1>
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          title={notification.title}
          onClose={() => setNotification(null)}
          showKeepVisible={notification.persistent}
        />
      )}

      <div className="space-y-4 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Different Notification Types</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => showNotification("Document uploaded successfully to IPFS!", 'success', false)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Show Success (Auto-hide)
          </button>
          
          <button
            onClick={() => showNotification("AI processing failed due to network error", 'error', false)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Show Error (Auto-hide)
          </button>
          
          <button
            onClick={() => showNotification("Document approved! Stage completed successfully.", 'success', true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Show Success (Persistent)
          </button>
          
          <button
            onClick={() => showNotification("Document rejected by AI. Manual review required.", 'error', true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Show Error (Persistent)
          </button>
          
          <button
            onClick={() => showNotification("Your document is being reviewed. This may take a few minutes.", 'info', false)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Show Info (Auto-hide)
          </button>
          
          <button
            onClick={() => showNotification("Please verify your wallet connection before proceeding.", 'warning', false)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Show Warning (Auto-hide)
          </button>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-3">Simulate AI Document Processing</h3>
          <button
            onClick={simulateAIProcessing}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold"
          >
            🤖 Simulate AI Processing (Multi-step)
          </button>
          <p className="text-sm text-gray-600 mt-2">
            This will show the processing notification first, then show the result (which stays visible until manually closed).
          </p>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-3">Instructions</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>Auto-hide notifications</strong> disappear after 8 seconds</li>
            <li>• <strong>Persistent notifications</strong> stay visible until you click the × button</li>
            <li>• Use persistent notifications for important results that users need to see</li>
            <li>• The AI processing simulation shows both types in sequence</li>
          </ul>
        </div>
      </div>
    </div>
  );
}