import { useEffect } from 'react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger', 'warning', 'info'
  loading = false,
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = event => {
      if (event.keyCode === 27 && isOpen && !loading) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, loading, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getVariantClasses = () => {
    switch (variant) {
      case 'danger':
        return {
          button:
            'bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:focus:ring-offset-gray-800',
          icon: 'text-red-600 dark:text-red-400',
          iconBg: 'bg-red-100 dark:bg-red-900',
        };
      case 'warning':
        return {
          button:
            'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 dark:focus:ring-offset-gray-800',
          icon: 'text-yellow-600 dark:text-yellow-400',
          iconBg: 'bg-yellow-100 dark:bg-yellow-900',
        };
      case 'info':
        return {
          button:
            'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-offset-gray-800',
          icon: 'text-blue-600 dark:text-blue-400',
          iconBg: 'bg-blue-100 dark:bg-blue-900',
        };
      default:
        return {
          button:
            'bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:focus:ring-offset-gray-800',
          icon: 'text-red-600 dark:text-red-400',
          iconBg: 'bg-red-100 dark:bg-red-900',
        };
    }
  };

  const variantClasses = getVariantClasses();

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <svg
            className={`h-6 w-6 ${variantClasses.icon}`}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        );
      case 'warning':
        return (
          <svg
            className={`h-6 w-6 ${variantClasses.icon}`}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        );
      case 'info':
        return (
          <svg
            className={`h-6 w-6 ${variantClasses.icon}`}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 overflow-y-auto'
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
      aria-describedby='modal-description'
    >
      {/* Background overlay */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300'
        onClick={handleBackdropClick}
      ></div>

      {/* Modal container */}
      <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div className='inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
          <div className='sm:flex sm:items-start'>
            {/* Icon */}
            <div
              className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${variantClasses.iconBg} sm:mx-0 sm:h-10 sm:w-10`}
            >
              {getIcon()}
            </div>

            {/* Content */}
            <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1'>
              <h3
                id='modal-title'
                className='text-lg leading-6 font-medium text-gray-900 dark:text-white'
              >
                {title}
              </h3>
              <div className='mt-2'>
                <p
                  id='modal-description'
                  className='text-sm text-gray-500 dark:text-gray-400'
                >
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
            <button
              type='button'
              onClick={onConfirm}
              disabled={loading}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${variantClasses.button}`}
            >
              {loading ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
            <button
              type='button'
              onClick={onClose}
              disabled={loading}
              className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
