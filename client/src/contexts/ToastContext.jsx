import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from './ThemeContext';

// Toast component
const Toast = ({
  id,
  type,
  title,
  message,
  onDismiss,
  autoCloseTime = 5000,
}) => {
  const { isDark } = useTheme();

  // Determine styles based on type
  const styles = {
    info: {
      background: 'bg-blue-50 dark:bg-blue-900',
      border: 'border-blue-300 dark:border-blue-700',
      title: 'text-blue-800 dark:text-blue-200',
      message: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-500 dark:text-blue-400',
    },
    success: {
      background: 'bg-green-50 dark:bg-green-900',
      border: 'border-green-300 dark:border-green-700',
      title: 'text-green-800 dark:text-green-200',
      message: 'text-green-700 dark:text-green-300',
      icon: 'text-green-500 dark:text-green-400',
    },
    warning: {
      background: 'bg-yellow-50 dark:bg-yellow-900',
      border: 'border-yellow-300 dark:border-yellow-700',
      title: 'text-yellow-800 dark:text-yellow-200',
      message: 'text-yellow-700 dark:text-yellow-300',
      icon: 'text-yellow-500 dark:text-yellow-400',
    },
    error: {
      background: 'bg-red-50 dark:bg-red-900',
      border: 'border-red-300 dark:border-red-700',
      title: 'text-red-800 dark:text-red-200',
      message: 'text-red-700 dark:text-red-300',
      icon: 'text-red-500 dark:text-red-400',
    },
  };

  // Icons for each type
  const icons = {
    info: (
      <svg
        className='h-5 w-5'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
          clipRule='evenodd'
        />
      </svg>
    ),
    success: (
      <svg
        className='h-5 w-5'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
          clipRule='evenodd'
        />
      </svg>
    ),
    warning: (
      <svg
        className='h-5 w-5'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
          clipRule='evenodd'
        />
      </svg>
    ),
    error: (
      <svg
        className='h-5 w-5'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
          clipRule='evenodd'
        />
      </svg>
    ),
  };

  return (
    <div
      className={`flex items-center p-4 mb-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out 
      ${styles[type].background} ${styles[type].border} w-full max-w-sm`}
      role='alert'
    >
      <div className={`flex-shrink-0 ${styles[type].icon}`}>{icons[type]}</div>
      <div className='ml-3 flex-1'>
        {title && (
          <h3 className={`text-sm font-medium ${styles[type].title}`}>
            {title}
          </h3>
        )}
        <div
          className={`${title ? 'mt-1' : ''} text-sm ${styles[type].message}`}
        >
          {message}
        </div>
      </div>
      <button
        type='button'
        onClick={() => onDismiss(id)}
        className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 
        ${styles[type].icon} hover:bg-opacity-20 hover:bg-gray-500 focus:outline-none`}
      >
        <span className='sr-only'>Dismiss</span>
        <svg
          className='h-5 w-5'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </div>
  );
};

// Create the ToastContext
const ToastContext = createContext();

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  // Keep track of recent toast messages to prevent duplicates
  const recentToastsRef = useRef(new Map());

  // Add a new toast with deduplication
  const addToast = useCallback(toast => {
    const id = Date.now().toString();
    const newToast = { id, ...toast };

    // Check for duplicate toast messages within the last 3 seconds
    const messageKey = `${toast.type}-${toast.message}`;
    const now = Date.now();
    const duplicateThreshold = 3000; // 3 seconds

    // If we have a recent identical toast, don't add a new one
    if (recentToastsRef.current.has(messageKey)) {
      const timestamp = recentToastsRef.current.get(messageKey);
      if (now - timestamp < duplicateThreshold) {
        // Skip this toast as it's a duplicate
        return id;
      }
    }

    // Record this toast message and timestamp
    recentToastsRef.current.set(messageKey, now);

    // Clean up old entries from the map
    for (const [key, timestamp] of recentToastsRef.current.entries()) {
      if (now - timestamp > duplicateThreshold) {
        recentToastsRef.current.delete(key);
      }
    }

    setToasts(prevToasts => [...prevToasts, newToast]);

    // Auto dismiss after specified time if autoClose is true
    if (toast.autoClose !== false) {
      const autoCloseTime = toast.autoCloseTime || 5000;
      setTimeout(() => {
        dismissToast(id);
      }, autoCloseTime);
    }

    return id;
  }, []);

  // Dismiss a toast by ID
  const dismissToast = useCallback(id => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Toast container
  const ToastContainer = () => {
    return createPortal(
      <div className='fixed top-4 right-4 z-50 flex flex-col items-end space-y-2 max-w-sm'>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type || 'info'}
            title={toast.title}
            message={toast.message}
            onDismiss={dismissToast}
            autoCloseTime={toast.autoCloseTime}
          />
        ))}
      </div>,
      document.body
    );
  };

  return (
    <ToastContext.Provider value={{ addToast, dismissToast, clearToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    toast: (message, options = {}) => {
      return context.addToast({ message, type: 'info', ...options });
    },
    success: (message, options = {}) => {
      return context.addToast({ message, type: 'success', ...options });
    },
    error: (message, options = {}) => {
      return context.addToast({ message, type: 'error', ...options });
    },
    warning: (message, options = {}) => {
      return context.addToast({ message, type: 'warning', ...options });
    },
    dismiss: context.dismissToast,
    clear: context.clearToasts,
  };
};

export default ToastContext;
