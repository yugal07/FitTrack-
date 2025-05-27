import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const MeasurementForm = ({ initialData, onSubmit, onCancel, loading }) => {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      weight: '',
      bodyFat: '',
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: '',
      notes: '',
    },
  });

  // Set initial data when editing
  useEffect(() => {
    if (initialData) {
      reset({
        date: initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        weight: initialData.weight || '',
        bodyFat: initialData.bodyFat || '',
        chest: initialData.chest || '',
        waist: initialData.waist || '',
        hips: initialData.hips || '',
        arms: initialData.arms || '',
        thighs: initialData.thighs || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = data => {
    // Convert string values to numbers where applicable
    const processedData = {
      ...data,
      weight: data.weight ? parseFloat(data.weight) : undefined,
      bodyFat: data.bodyFat ? parseFloat(data.bodyFat) : undefined,
      chest: data.chest ? parseFloat(data.chest) : undefined,
      waist: data.waist ? parseFloat(data.waist) : undefined,
      hips: data.hips ? parseFloat(data.hips) : undefined,
      arms: data.arms ? parseFloat(data.arms) : undefined,
      thighs: data.thighs ? parseFloat(data.thighs) : undefined,
    };

    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div>
          <label
            htmlFor='date'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Date
          </label>
          <input
            type='date'
            id='date'
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm ${
              errors.date
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } dark:bg-gray-800 dark:text-white rounded-md`}
            {...register('date', {
              required: 'Date is required',
            })}
          />
          {errors.date && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.date.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='weight'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Weight (kg)
          </label>
          <input
            type='number'
            step='0.1'
            id='weight'
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm ${
              errors.weight
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } dark:bg-gray-800 dark:text-white rounded-md`}
            {...register('weight', {
              min: {
                value: 0,
                message: 'Weight must be a positive number',
              },
              pattern: {
                value: /^\d*\.?\d*$/,
                message: 'Please enter a valid number',
              },
            })}
          />
          {errors.weight && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.weight.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='bodyFat'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Body Fat (%)
          </label>
          <input
            type='number'
            step='0.1'
            id='bodyFat'
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm ${
              errors.bodyFat
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } dark:bg-gray-800 dark:text-white rounded-md`}
            {...register('bodyFat', {
              min: {
                value: 0,
                message: 'Body fat must be a positive number',
              },
              max: {
                value: 100,
                message: 'Body fat cannot exceed 100%',
              },
              pattern: {
                value: /^\d*\.?\d*$/,
                message: 'Please enter a valid number',
              },
            })}
          />
          {errors.bodyFat && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.bodyFat.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='chest'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Chest (cm)
          </label>
          <input
            type='number'
            step='0.1'
            id='chest'
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm ${
              errors.chest
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } dark:bg-gray-800 dark:text-white rounded-md`}
            {...register('chest', {
              min: {
                value: 0,
                message: 'Chest measurement must be a positive number',
              },
              pattern: {
                value: /^\d*\.?\d*$/,
                message: 'Please enter a valid number',
              },
            })}
          />
          {errors.chest && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.chest.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='waist'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Waist (cm)
          </label>
          <input
            type='number'
            step='0.1'
            id='waist'
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm ${
              errors.waist
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } dark:bg-gray-800 dark:text-white rounded-md`}
            {...register('waist', {
              min: {
                value: 0,
                message: 'Waist measurement must be a positive number',
              },
              pattern: {
                value: /^\d*\.?\d*$/,
                message: 'Please enter a valid number',
              },
            })}
          />
          {errors.waist && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.waist.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='hips'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Hips (cm)
          </label>
          <input
            type='number'
            step='0.1'
            id='hips'
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm ${
              errors.hips
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } dark:bg-gray-800 dark:text-white rounded-md`}
            {...register('hips', {
              min: {
                value: 0,
                message: 'Hips measurement must be a positive number',
              },
              pattern: {
                value: /^\d*\.?\d*$/,
                message: 'Please enter a valid number',
              },
            })}
          />
          {errors.hips && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.hips.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='arms'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Arms (cm)
          </label>
          <input
            type='number'
            step='0.1'
            id='arms'
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm ${
              errors.arms
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } dark:bg-gray-800 dark:text-white rounded-md`}
            {...register('arms', {
              min: {
                value: 0,
                message: 'Arms measurement must be a positive number',
              },
              pattern: {
                value: /^\d*\.?\d*$/,
                message: 'Please enter a valid number',
              },
            })}
          />
          {errors.arms && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.arms.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='thighs'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Thighs (cm)
          </label>
          <input
            type='number'
            step='0.1'
            id='thighs'
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm ${
              errors.thighs
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } dark:bg-gray-800 dark:text-white rounded-md`}
            {...register('thighs', {
              min: {
                value: 0,
                message: 'Thighs measurement must be a positive number',
              },
              pattern: {
                value: /^\d*\.?\d*$/,
                message: 'Please enter a valid number',
              },
            })}
          />
          {errors.thighs && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.thighs.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor='notes'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          Notes
        </label>
        <textarea
          id='notes'
          rows='3'
          className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md'
          {...register('notes')}
        ></textarea>
      </div>

      <div className='flex justify-end space-x-3'>
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
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default MeasurementForm;
