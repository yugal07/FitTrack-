import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const ProfileEditForm = ({ initialData, onSave, onCancel, loading }) => {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      fitnessLevel: 'beginner',
    },
  });

  // Initialize form with initial data when available
  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        dateOfBirth: initialData.dateOfBirth
          ? new Date(initialData.dateOfBirth).toISOString().split('T')[0]
          : '',
        gender: initialData.gender || '',
        fitnessLevel: initialData.fitnessLevel || 'beginner',
      });
    }
  }, [initialData, reset]);

  const onSubmit = data => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label
            htmlFor='firstName'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            First Name
          </label>
          <input
            type='text'
            id='firstName'
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm ${
              errors.firstName
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } dark:bg-gray-800 dark:text-white rounded-md`}
            {...register('firstName', {
              required: 'First name is required',
              validate: value =>
                value.trim() !== '' || 'First name cannot be empty',
            })}
          />
          {errors.firstName && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='lastName'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Last Name
          </label>
          <input
            type='text'
            id='lastName'
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm ${
              errors.lastName
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } dark:bg-gray-800 dark:text-white rounded-md`}
            {...register('lastName', {
              required: 'Last name is required',
              validate: value =>
                value.trim() !== '' || 'Last name cannot be empty',
            })}
          />
          {errors.lastName && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='dateOfBirth'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Date of Birth
          </label>
          <input
            type='date'
            id='dateOfBirth'
            className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md'
            {...register('dateOfBirth', {
              validate: value => {
                if (value) {
                  const birthDate = new Date(value);
                  const today = new Date();
                  return (
                    birthDate < today || 'Birth date cannot be in the future'
                  );
                }
                return true;
              },
            })}
          />
          {errors.dateOfBirth && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='gender'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Gender
          </label>
          <select
            id='gender'
            className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            {...register('gender')}
          >
            <option value=''>Select gender</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='other'>Other</option>
            <option value='prefer not to say'>Prefer not to say</option>
          </select>
        </div>

        <div>
          <label
            htmlFor='fitnessLevel'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Fitness Level
          </label>
          <select
            id='fitnessLevel'
            className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            {...register('fitnessLevel', {
              required: 'Fitness level is required',
            })}
          >
            <option value='beginner'>Beginner</option>
            <option value='intermediate'>Intermediate</option>
            <option value='advanced'>Advanced</option>
          </select>
          {errors.fitnessLevel && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.fitnessLevel.message}
            </p>
          )}
        </div>
      </div>

      <div className='pt-5 flex justify-end space-x-3'>
        <button
          type='button'
          onClick={onCancel}
          disabled={loading}
          className='bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={loading}
          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50'
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
