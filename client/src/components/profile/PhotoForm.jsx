import { useState } from 'react';
import { useForm } from 'react-hook-form';

const PhotoForm = ({ onSubmit, onCancel, loading }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      category: 'front',
      notes: '',
      file: null,
    },
  });

  // Watch file input for preview
  const watchFile = watch('file');

  const handleFileChange = e => {
    const file = e.target.files[0];

    if (!file) {
      setValue('file', null);
      setPreviewUrl(null);
      return;
    }

    // File will be validated by React Hook Form rules

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Set file in form state
    setValue('file', file);
  };

  const removeFile = () => {
    setValue('file', null);
    setPreviewUrl(null);
  };

  const onFormSubmit = data => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
      {errors.file && (
        <div className='bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg'>
          {errors.file.message}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <div className='mb-4'>
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

          <div className='mb-4'>
            <label
              htmlFor='category'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Photo Category
            </label>
            <select
              id='category'
              className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              {...register('category', {
                required: 'Category is required',
              })}
            >
              <option value='front'>Front View</option>
              <option value='side'>Side View</option>
              <option value='back'>Back View</option>
              <option value='custom'>Custom</option>
            </select>
            {errors.category && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.category.message}
              </p>
            )}
          </div>

          <div className='mb-4'>
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
              placeholder='Optional notes about this photo'
              {...register('notes')}
            ></textarea>
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Photo
          </label>

          <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md'>
            {previewUrl ? (
              <div className='space-y-2 text-center'>
                <img
                  src={previewUrl}
                  alt='Preview'
                  className='mx-auto h-64 w-auto object-contain'
                />
                <div className='flex justify-center'>
                  <button
                    type='button'
                    onClick={removeFile}
                    className='text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300'
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className='space-y-1 text-center'>
                <svg
                  className='mx-auto h-12 w-12 text-gray-400'
                  stroke='currentColor'
                  fill='none'
                  viewBox='0 0 48 48'
                  aria-hidden='true'
                >
                  <path
                    d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <div className='flex text-sm text-gray-600 dark:text-gray-400'>
                  <label
                    htmlFor='file-upload'
                    className='relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 dark:focus-within:ring-offset-gray-800'
                  >
                    <span>Upload a file</span>
                    <input
                      id='file-upload'
                      name='file-upload'
                      type='file'
                      className='sr-only'
                      accept='image/*'
                      onChange={handleFileChange}
                      {...register('file', {
                        required: 'Please select a photo to upload',
                        validate: {
                          fileType: file =>
                            !file ||
                            file.type.startsWith('image/') ||
                            'Please select an image file (jpg, png, etc.)',
                          fileSize: file =>
                            !file ||
                            file.size <= 5 * 1024 * 1024 ||
                            'File size must be less than 5MB',
                        },
                      })}
                    />
                  </label>
                  <p className='pl-1'>or drag and drop</p>
                </div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
          </div>
          {errors.file && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.file.message}
            </p>
          )}
        </div>
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
          {loading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </div>
    </form>
  );
};

export default PhotoForm;
