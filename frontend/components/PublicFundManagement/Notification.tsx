'use client';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  onClose?: () => void;
}

// Function to clean and beautify error messages
const beautifyErrorMessage = (rawMessage: string): string => {
  // Remove common technical prefixes
  let cleanMessage = rawMessage
    .replace(/^Error:\s*/i, '')
    .replace(/^Failed to\s*/i, '')
    .replace(/execution reverted:\s*/i, '')
    .replace(/MetaMask Tx Signature:\s*/i, '')
    .replace(/User denied transaction signature/i, 'Transaction was cancelled')
    .replace(/insufficient funds/i, 'Insufficient funds in your wallet')
    .replace(/gas estimation failed/i, 'Transaction failed - please check your wallet balance')
    .replace(/network error/i, 'Network connection issue')
    .replace(/connect ECONNREFUSED/i, 'Unable to connect to the service')
    .replace(/timeout/i, 'Request timed out - please try again')
    .replace(/401|unauthorized/i, 'Authentication required')
    .replace(/403|forbidden/i, 'Access denied')
    .replace(/404|not found/i, 'Resource not found')
    .replace(/500|internal server error/i, 'Server error - please try again later');

  // Capitalize first letter and ensure proper punctuation
  cleanMessage = cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);
  if (!cleanMessage.endsWith('.') && !cleanMessage.endsWith('!') && !cleanMessage.endsWith('?')) {
    cleanMessage += '.';
  }

  // Map common blockchain errors to user-friendly messages
  const errorMappings: { [key: string]: string } = {
    'Transaction failed.': 'Transaction failed. Please check your wallet balance and try again.',
    'Network connection issue.': 'Network connection issue. Please check your internet connection.',
    'Insufficient funds in your wallet.': 'Insufficient funds. Please add more ETH to your wallet.',
    'Transaction was cancelled.': 'Transaction was cancelled. You can try again when ready.',
    'Gas estimation failed.': 'Transaction failed. Please ensure you have enough ETH for gas fees.',
    'Unable to connect to the service.': 'Service temporarily unavailable. Please try again in a moment.'
  };

  return errorMappings[cleanMessage] || cleanMessage;
};

export function Notification({ message, type, title, onClose }: NotificationProps) {
  const cleanMessage = type === 'error' ? beautifyErrorMessage(message) : message;

  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: '✅',
          iconBg: 'bg-green-100'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: '❌',
          iconBg: 'bg-red-100'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: '⚠️',
          iconBg: 'bg-yellow-100'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'ℹ️',
          iconBg: 'bg-blue-100'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: '📝',
          iconBg: 'bg-gray-100'
        };
    }
  };

  const styles = getNotificationStyles();

  return (
    <div className={`mb-6 p-4 ${styles.bg} border ${styles.border} rounded-lg shadow-sm`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center mr-3`}>
          <span className="text-sm">{styles.icon}</span>
        </div>
        <div className="flex-1">
          {title && (
            <h4 className={`${styles.text} font-semibold text-sm mb-1`}>{title}</h4>
          )}
          <p className={`${styles.text} ${title ? '' : 'font-medium'}`}>{cleanMessage}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className={`flex-shrink-0 ml-3 ${styles.text} hover:opacity-70 font-bold text-lg leading-none`}
            aria-label="Close notification"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}