// Error handling utility functions for beautiful error display

export interface ErrorInfo {
  message: string;
  type: 'error' | 'warning' | 'info';
  title?: string;
  duration?: number;
}

export const processError = (error: any): ErrorInfo => {
  let message = '';
  let type: 'error' | 'warning' | 'info' = 'error';
  let title = 'Error';

  // Extract message from different error formats
  if (typeof error === 'string') {
    message = error;
  } else if (error?.message) {
    message = error.message;
  } else if (error?.reason) {
    message = error.reason;
  } else if (error?.data?.message) {
    message = error.data.message;
  } else if (error?.error?.message) {
    message = error.error.message;
  } else {
    message = 'An unexpected error occurred';
  }

  // Categorize and beautify common blockchain/web3 errors
  if (message.includes('user rejected') || message.includes('User denied')) {
    return {
      message: 'Transaction was cancelled by user.',
      type: 'warning',
      title: 'Transaction Cancelled'
    };
  }

  if (message.includes('insufficient funds') || message.includes('insufficient balance')) {
    return {
      message: 'Insufficient funds in your wallet. Please add more ETH and try again.',
      type: 'error',
      title: 'Insufficient Funds'
    };
  }

  if (message.includes('gas') && (message.includes('estimation failed') || message.includes('out of gas'))) {
    return {
      message: 'Transaction failed due to gas estimation issues. Please check your wallet balance.',
      type: 'error',
      title: 'Gas Estimation Failed'
    };
  }

  if (message.includes('network') || message.includes('connection')) {
    return {
      message: 'Network connection issue. Please check your internet connection and try again.',
      type: 'warning',
      title: 'Network Error'
    };
  }

  if (message.includes('MetaMask') || message.includes('wallet')) {
    return {
      message: 'Wallet connection issue. Please ensure MetaMask is connected and try again.',
      type: 'warning',
      title: 'Wallet Error'
    };
  }

  if (message.includes('execution reverted')) {
    const revertReason = message.split('execution reverted: ')[1] || 'Transaction failed';
    return {
      message: `Smart contract rejected the transaction: ${revertReason}`,
      type: 'error',
      title: 'Transaction Rejected'
    };
  }

  if (message.includes('nonce too low') || message.includes('replacement transaction underpriced')) {
    return {
      message: 'Transaction conflict detected. Please reset your MetaMask account or wait a moment and try again.',
      type: 'warning',
      title: 'Transaction Conflict'
    };
  }

  if (message.includes('timeout') || message.includes('timed out')) {
    return {
      message: 'Request timed out. Please try again in a moment.',
      type: 'warning',
      title: 'Request Timeout'
    };
  }

  // API/Backend errors
  if (message.includes('400') || message.includes('Bad Request')) {
    return {
      message: 'Invalid request. Please check your input and try again.',
      type: 'error',
      title: 'Invalid Request'
    };
  }

  if (message.includes('401') || message.includes('Unauthorized')) {
    return {
      message: 'Authentication required. Please refresh the page and connect your wallet.',
      type: 'warning',
      title: 'Authentication Required'
    };
  }

  if (message.includes('403') || message.includes('Forbidden')) {
    return {
      message: 'Access denied. You may not have permission for this action.',
      type: 'error',
      title: 'Access Denied'
    };
  }

  if (message.includes('404') || message.includes('Not Found')) {
    return {
      message: 'Resource not found. The item you are looking for may have been moved or deleted.',
      type: 'info',
      title: 'Not Found'
    };
  }

  if (message.includes('500') || message.includes('Internal Server Error')) {
    return {
      message: 'Server error occurred. Please try again in a few moments.',
      type: 'error',
      title: 'Server Error'
    };
  }

  // IPFS/File upload errors
  if (message.includes('IPFS') || message.includes('Pinata')) {
    return {
      message: 'File upload failed. Please check your internet connection and try again.',
      type: 'error',
      title: 'Upload Failed'
    };
  }

  // AI/Backend processing errors
  if (message.includes('AI') || message.includes('analysis') || message.includes('processing')) {
    return {
      message: 'Document analysis failed. Please ensure your file is valid and try again.',
      type: 'error',
      title: 'Analysis Failed'
    };
  }

  // Contract interaction errors
  if (message.includes('proposal') && message.includes('not found')) {
    return {
      message: 'Proposal not found. It may have been removed or you may not have access.',
      type: 'info',
      title: 'Proposal Not Found'
    };
  }

  if (message.includes('unauthorized') || message.includes('not authorized')) {
    return {
      message: 'You are not authorized to perform this action.',
      type: 'warning',
      title: 'Unauthorized Action'
    };
  }

  // Generic error cleanup
  let cleanMessage = message
    .replace(/^Error:\s*/i, '')
    .replace(/^Failed to\s*/i, '')
    .replace(/execution reverted:\s*/i, '')
    .trim();

  // Capitalize first letter
  cleanMessage = cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);

  // Add period if not present
  if (!cleanMessage.endsWith('.') && !cleanMessage.endsWith('!') && !cleanMessage.endsWith('?')) {
    cleanMessage += '.';
  }

  return {
    message: cleanMessage || 'An unexpected error occurred. Please try again.',
    type: 'error',
    title: 'Error'
  };
};

export const processSuccess = (message: string): string => {
  // Clean up success messages
  return message
    .replace(/^Success:\s*/i, '')
    .replace(/Transaction hash:\s*0x[a-fA-F0-9]+/i, '')
    .trim() || message;
};