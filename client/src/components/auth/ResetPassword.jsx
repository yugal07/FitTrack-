import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';
import api from '../../utils/api';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [tokenValidating, setTokenValidating] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  // For password validation
  const password = watch('password');

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Reset token is missing');
        setTokenChecked(true);
        setTokenValidating(false);
        return;
      }

      try {
        // This endpoint would need to be implemented on the backend
        const response = await api.post('/api/auth/verify-reset-token', {
          token,
        });
        setTokenValid(response.data.success);
        setTokenChecked(true);
        setTokenValidating(false);
      } catch (err) {
        setError('Invalid or expired reset token');
        setTokenChecked(true);
        setTokenValidating(false);
      }
    };

    verifyToken();
  }, [token]);

  const onSubmit = async data => {
    try {
      setLoading(true);
      setError('');

      // This endpoint would need to be implemented on the backend
      await api.post('/api/auth/reset-password', {
        token,
        newPassword: data.password,
      });

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Failed to reset password'
      );
    } finally {
      setLoading(false);
    }
  };

  // Content for different states
  const renderContent = () => {
    // Loading state
    if (tokenValidating) {
      return (
        <div className='flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700'>
          <div className='animate-spin h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 rounded-full mb-4'></div>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
            Verifying reset token...
          </h3>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Please wait while we verify your reset token
          </p>
        </div>
      );
    }

    // Invalid token state
    if (!tokenValid) {
      return (
        <div className='p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700'>
          <div className='flex flex-col items-center text-center'>
            <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4'>
              <svg
                className='h-6 w-6 text-red-600 dark:text-red-400'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              Password Reset Failed
            </h3>
            <div className='mt-3 text-sm text-gray-700 dark:text-gray-300'>
              <p>{error || 'Invalid or expired reset token'}</p>
            </div>
            <div className='mt-6'>
              <Link
                to='/forgot-password'
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900'
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Success state
    if (success) {
      return (
        <div className='p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700'>
          <div className='flex flex-col items-center text-center'>
            <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4'>
              <svg
                className='h-6 w-6 text-green-600 dark:text-green-400'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              Password reset successful
            </h3>
            <div className='mt-3 text-sm text-gray-700 dark:text-gray-300'>
              <p>
                Your password has been reset successfully. You will be
                redirected to the login page in a few seconds.
              </p>
            </div>
            <div className='mt-6'>
              <Link
                to='/login'
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900'
              >
                Go to login
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Reset password form
    return (
      <div className='p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700'>
        {error && (
          <div
            className='mb-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative'
            role='alert'
          >
            <span className='block sm:inline'>{error}</span>
          </div>
        )}

        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              New Password
            </label>
            <input
              id='password'
              type='password'
              autoComplete='new-password'
              className={`appearance-none relative block w-full px-3 py-2 border ${
                errors.password
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-700'
              } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              placeholder='••••••••'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
              })}
            />
            {errors.password && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.password.message}
              </p>
            )}
            <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
              Password must be at least 8 characters long
            </p>
          </div>

          <div>
            <label
              htmlFor='confirm-password'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Confirm New Password
            </label>
            <input
              id='confirm-password'
              type='password'
              autoComplete='new-password'
              className={`appearance-none relative block w-full px-3 py-2 border ${
                errors.confirmPassword
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-700'
              } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              placeholder='••••••••'
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value =>
                  value === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <button
              type='submit'
              disabled={loading}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 transition-colors'
            >
              {loading ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
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
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className='min-h-screen flex bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors'>
      <div className='w-full max-w-md mx-auto flex flex-col justify-center px-4 sm:px-6 md:px-8 py-12 relative'>
        <div className='absolute top-4 right-4'>
          <ThemeToggle />
        </div>

        <div className='w-full space-y-8'>
          <div>
            <h2 className='text-center text-3xl font-bold text-gray-900 dark:text-white'>
              Reset your password
            </h2>
            <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
              Choose a new password for your account
            </p>
          </div>

          {renderContent()}

          <div className='text-center mt-4'>
            <Link
              to='/login'
              className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
