import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect location from state if available
  const from = location.state?.from?.pathname || '/dashboard';

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async data => {
    try {
      setLoading(true);
      setError('');
      const response = await login(data.email, data.password);

      // Check if user is admin and redirect appropriately
      if (response.data.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(
        err.error?.message || 'Failed to log in. Please check your credentials.'
      );
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors'>
      {/* Left side with illustration/branding (hidden on small screens) */}
      <div className='hidden lg:flex lg:w-1/2 bg-indigo-600 dark:bg-indigo-900 flex-col justify-between items-center py-12 px-8 transition-colors'>
        <div className='w-full flex justify-end'>
          <ThemeToggle className='bg-white/10 text-white' />
        </div>

        <div className='flex flex-col items-center max-w-md text-white'>
          <h1 className='text-4xl font-bold mb-2'>FitTrack Pro</h1>
          <p className='text-xl mb-8 text-center font-light'>
            Your personal fitness journey starts here
          </p>

          {/* Placeholder for illustration/image */}
          <div className='w-64 h-64 bg-white/10 rounded-lg flex items-center justify-center mb-8'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-32 h-32 text-white/80'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M18 8h1a4 4 0 0 1 0 8h-1'></path>
              <path d='M6 8H5a4 4 0 0 0 0 8h1'></path>
              <line x1='6' y1='12' x2='18' y2='12'></line>
            </svg>
          </div>

          <div className='mt-4 text-center text-white/80'>
            <p>
              Track workouts, set goals, and achieve results with our
              comprehensive fitness platform.
            </p>
          </div>
        </div>

        <div className='text-white/60 text-sm'>
          &copy; {new Date().getFullYear()} FitTrack Pro. All rights reserved.
        </div>
      </div>

      {/* Right side with login form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative'>
        <div className='absolute top-4 right-4 lg:hidden'>
          <ThemeToggle />
        </div>

        <div className='w-full max-w-md space-y-8'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white'>
              Welcome back
            </h2>
            <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
              Sign in to access your fitness dashboard
            </p>
          </div>

          <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div
                className='bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative'
                role='alert'
              >
                <span className='block sm:inline'>{error}</span>
              </div>
            )}

            <div className='space-y-5'>
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
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                >
                  Password
                </label>
                <input
                  id='password'
                  type='password'
                  autoComplete='current-password'
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.password
                      ? 'border-red-300 dark:border-red-700'
                      : 'border-gray-300 dark:border-gray-700'
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder='••••••••'
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                {errors.password && (
                  <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800'
                  {...register('rememberMe')}
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
                >
                  Remember me
                </label>
              </div>

              <div className='text-sm'>
                <Link
                  to='/forgot-password'
                  className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type='submit'
                disabled={loading}
                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 transition-colors'
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
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Don't have an account?{' '}
                <Link
                  to='/register'
                  className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
                >
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
