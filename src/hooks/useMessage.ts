import { useState, useCallback } from 'react';

interface MessageState {
  type: 'success' | 'error' | 'warning' | 'info' | null;
  message: string;
  visible: boolean;
  autoClose?: boolean;
  duration?: number;
}

interface MessageOptions {
  autoClose?: boolean;
  duration?: number;
}

export const useMessage = (defaultDuration = 5000) => {
  const [messageState, setMessageState] = useState<MessageState>({
    type: null,
    message: '',
    visible: false,
    autoClose: true,
    duration: defaultDuration
  });

  const showMessage = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    options: MessageOptions = {}
  ) => {
    const { autoClose = true, duration = defaultDuration } = options;
    
    setMessageState({
      type,
      message,
      visible: true,
      autoClose,
      duration
    });

    // Auto hide if enabled
    if (autoClose && duration > 0) {
      setTimeout(() => {
        hideMessage();
      }, duration);
    }
  }, [defaultDuration]);

  const showSuccess = useCallback((message: string, options?: MessageOptions) => {
    showMessage('success', message, options);
  }, [showMessage]);

  const showError = useCallback((message: string, options?: MessageOptions) => {
    showMessage('error', message, options);
  }, [showMessage]);

  const showWarning = useCallback((message: string, options?: MessageOptions) => {
    showMessage('warning', message, options);
  }, [showMessage]);

  const showInfo = useCallback((message: string, options?: MessageOptions) => {
    showMessage('info', message, options);
  }, [showMessage]);

  const hideMessage = useCallback(() => {
    setMessageState(prev => ({
      ...prev,
      visible: false
    }));
  }, []);

  const clearMessage = useCallback(() => {
    setMessageState({
      type: null,
      message: '',
      visible: false,
      autoClose: true,
      duration: defaultDuration
    });
  }, [defaultDuration]);

  return {
    messageState,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showMessage,
    hideMessage,
    clearMessage
  };
};
