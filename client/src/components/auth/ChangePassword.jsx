import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { changePassword } = useAuth();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  // For password validation
  const newPassword = watch('newPassword');

  const onSubmit = async data => {
    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      await changePassword(data.currentPassword, data.newPassword);

      // Reset form
      reset();

      setSuccess(true);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.error?.message || 'Failed to update password');
      console.error('Change password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden'>
      <div className='px-6 py-5 border-b border-gray-200 dark:border-gray-700'>
        <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
          Change Password
        </h3>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Update your password to keep your account secure
        </p>
      </div>

      <div className='p-6'>
        {success && (
          <div className='mb-6 rounded-md bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-green-400 dark:text-green-300'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-green-800 dark:text-green-200'>
                  Your password has been changed successfully.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className='mb-6 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-red-400 dark:text-red-300'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-red-800 dark:text-red-200'>
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <label
              htmlFor='current-password'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
            >
              Current Password
            </label>
            <input
              id='current-password'
              type='password'
              autoComplete='current-password'
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.currentPassword
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-300 dark:border-gray-600'
              } shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-base`}
              placeholder='Enter your current password'
              {...register('currentPassword', {
                required: 'Current password is required',
              })}
            />
            {errors.currentPassword && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='new-password'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
            >
              New Password
            </label>
            <input
              id='new-password'
              type='password'
              autoComplete='new-password'
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.newPassword
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-300 dark:border-gray-600'
              } shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-base`}
              placeholder='Enter your new password'
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
              })}
            />
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
              Password must be at least 8 characters long
            </p>
            {errors.newPassword && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='confirm-password'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
            >
              Confirm New Password
            </label>
            <input
              id='confirm-password'
              type='password'
              autoComplete='new-password'
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.confirmPassword
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-300 dark:border-gray-600'
              } shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-base`}
              placeholder='Confirm your new password'
              {...register('confirmPassword', {
                required: 'Please confirm your new password',
                validate: value =>
                  value === newPassword || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className='pt-4'>
            <button
              type='submit'
              disabled={loading}
              className='w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 transition-colors'
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
                  Changing Password...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </div>

          <div className='text-sm text-center text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
            For additional security options, please contact support.
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
