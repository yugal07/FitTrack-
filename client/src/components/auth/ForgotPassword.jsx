import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { forgotPassword } = useAuth();
  const { isDark } = useTheme();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  // For displaying the email in success message
  const watchEmail = watch('email', '');

  const onSubmit = async data => {
    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      await forgotPassword(data.email);
      setSuccess(true);
    } catch (err) {
      setError(err.error?.message || 'An error occurred. Please try again.');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
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
              Enter your email address and we'll send you instructions to reset
              your password
            </p>
          </div>

          {success ? (
            <div className='rounded-lg bg-white dark:bg-gray-800 shadow-md p-6 border border-gray-200 dark:border-gray-700'>
              <div className='flex flex-col items-center text-center'>
                <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4'>
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
                  Check your email
                </h3>
                <div className='mt-3 text-sm text-gray-700 dark:text-gray-300'>
                  <p>
                    If an account exists with the email{' '}
                    <span className='font-medium'>{watchEmail}</span>, we've
                    sent instructions to reset your password.
                  </p>
                </div>
                <div className='mt-6'>
                  <Link
                    to='/login'
                    className='w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900'
                  >
                    Return to login
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className='mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
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
                    htmlFor='email-address'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                  >
                    Email address
                  </label>
                  <input
                    id='email-address'
                    type='email'
                    autoComplete='email'
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.email
                        ? 'border-red-300 dark:border-red-700'
                        : 'border-gray-300 dark:border-gray-700'
                    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder='name@example.com'
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Please enter a valid email address',
                      },
                    })}
                  />
                  {errors.email && (
                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                      {errors.email.message}
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
                        Sending...
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

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

export default ForgotPassword;
