'use client';

import { useState } from 'react';
import { Notification } from './PublicFundManagement/Notification';
import { processError } from '@/lib/errorUtils';

export function ErrorTestComponent() {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
  } | null>(null);

  const testErrors = [
    "Error: user rejected transaction",
    "Error: insufficient funds for gas * price + value",
    "Error: execution reverted: Unauthorized access",
    "Error: network error - connection timeout",
    "MetaMask Tx Signature: User denied transaction signature",
    "Internal Server Error - 500",
    "404 Not Found - Resource not found",
    "IPFS upload failed: network error",
    "AI analysis failed: Bad Request",
    "Error: nonce too low"
  ];

  const showTestError = (rawError: string) => {
    const errorInfo = processError(rawError);
    setNotification({
      message: errorInfo.message,
      type: errorInfo.type,
      title: errorInfo.title
    });
    
    setTimeout(() => setNotification(null), 6000);
  };

  const showSuccess = () => {
    setNotification({
      message: 'Transaction completed successfully! Your proposal has been submitted.',
      type: 'success',
      title: 'Success'
    });
    
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Error Handling Demo</h2>
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          title={notification.title}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Test Success Message</h3>
          <button
            onClick={showSuccess}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Show Success
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Test Error Messages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {testErrors.map((error, index) => (
              <button
                key={index}
                onClick={() => showTestError(error)}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm text-left"
              >
                {error.substring(0, 40)}...
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Enhanced Features:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>🎨 Beautiful visual design with proper colors and icons</li>
            <li>🧠 Smart error message translation from technical to user-friendly</li>
            <li>🏷️ Categorized error types (error, warning, info)</li>
            <li>📝 Clear titles for different error categories</li>
            <li>⚡ Auto-dismiss with appropriate timing</li>
            <li>❌ Manual close button for user control</li>
            <li>♿ Improved accessibility with proper ARIA labels</li>
            <li>📱 Responsive design for all screen sizes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}