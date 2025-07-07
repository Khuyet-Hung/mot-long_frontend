import React from 'react';
import Message from '../components/common/Message';
import { useMessage } from '../hooks/useMessage';

interface MessageDisplayProps {
  messageState: ReturnType<typeof useMessage>['messageState'];
  onClose?: () => void;
  className?: string;
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({ 
  messageState, 
  onClose,
  className = ''
}) => {
  if (!messageState.visible || !messageState.type) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${className}`}>
      <Message 
        type={messageState.type}
        message={messageState.message}
        onClose={onClose}
        autoClose={messageState.autoClose}
        duration={messageState.duration}
      />
    </div>
  );
};

// Message options interface
interface MessageOptions {
  autoClose?: boolean;
  duration?: number;
}

// Utility functions để sử dụng dễ dàng hơn
export const messageUtils = {
  // Message success với options
  success: (message: string, options: MessageOptions = {}) => {
    const event = new CustomEvent('showMessage', {
      detail: { type: 'success', message, options }
    });
    window.dispatchEvent(event);
  },

  // Message error với options
  error: (message: string, options: MessageOptions = {}) => {
    const event = new CustomEvent('showMessage', {
      detail: { type: 'error', message, options }
    });
    window.dispatchEvent(event);
  },

  // Message warning với options
  warning: (message: string, options: MessageOptions = {}) => {
    const event = new CustomEvent('showMessage', {
      detail: { type: 'warning', message, options }
    });
    window.dispatchEvent(event);
  },

  // Message info với options
  info: (message: string, options: MessageOptions = {}) => {
    const event = new CustomEvent('showMessage', {
      detail: { type: 'info', message, options }
    });
    window.dispatchEvent(event);
  },

  // Quick methods với defaults
  quickSuccess: (message: string) => messageUtils.success(message, { duration: 3000 }),
  quickError: (message: string) => messageUtils.error(message, { duration: 5000 }),
  quickWarning: (message: string) => messageUtils.warning(message, { duration: 4000 }),
  quickInfo: (message: string) => messageUtils.info(message, { duration: 3000 }),

  // Persistent messages (không tự động ẩn)
  persistentError: (message: string) => messageUtils.error(message, { autoClose: false }),
  persistentWarning: (message: string) => messageUtils.warning(message, { autoClose: false }),

  // Clear tất cả message
  clear: () => {
    const event = new CustomEvent('clearMessage');
    window.dispatchEvent(event);
  }
};

// Hook wrapper để lắng nghe global message events
export const useGlobalMessage = () => {
  const { 
    messageState, 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo, 
    clearMessage 
  } = useMessage();

  React.useEffect(() => {
    const handleShowMessage = (event: CustomEvent) => {
      const { type, message, options = {} } = event.detail;
      
      switch (type) {
        case 'success':
          showSuccess(message, options);
          break;
        case 'error':
          showError(message, options);
          break;
        case 'warning':
          showWarning(message, options);
          break;
        case 'info':
          showInfo(message, options);
          break;
        default:
          console.warn('Unknown message type:', type);
      }
    };

    const handleClearMessage = () => {
      clearMessage();
    };

    window.addEventListener('showMessage', handleShowMessage as EventListener);
    window.addEventListener('clearMessage', handleClearMessage);

    return () => {
      window.removeEventListener('showMessage', handleShowMessage as EventListener);
      window.removeEventListener('clearMessage', handleClearMessage);
    };
  }, [showSuccess, showError, showWarning, showInfo, clearMessage]);

  return { messageState, clearMessage };
};
