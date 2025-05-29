import { useState } from 'react';
import { useForm } from 'react-hook-form';

const PhotoForm = ({ onSubmit, onCancel, loading }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      category: 'front',
      notes: '',
    },
  });

  const handleFileChange = e => {
    const file = e.target.files[0];

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError('file', {
        type: 'required',
        message: 'Please select a photo to upload',
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('file', {
        type: 'fileType',
        message: 'Please select an image file (jpg, png, etc.)',
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('file', {
        type: 'fileSize',
        message: 'File size must be less than 5MB',
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Clear any existing file errors
    clearErrors('file');

    // Set the selected file
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    // Reset the file input
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const onFormSubmit = data => {
    // Check if file is selected
    if (!selectedFile) {
      setError('file', {
        type: 'required',
        message: 'Please select a photo to upload',
      });
      return;
    }

    // Ensure date is properly formatted without timezone conversion
    // The date input gives us YYYY-MM-DD format, keep it as-is
    const formDataWithFile = {
      ...data,
      date: data.date, // Keep the original date string
      file: selectedFile,
    };

    console.log('Submitting form with data:', formDataWithFile);
    console.log('Date being sent:', data.date);
    onSubmit(formDataWithFile);
  };

  // Common input classes for better visibility and sizing
  const inputClasses = hasError =>
    `
    mt-1 px-3 py-2 h-10 
    focus:ring-indigo-500 focus:border-indigo-500 
    block w-full shadow-sm sm:text-sm 
    ${
      hasError
        ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
    } 
    text-gray-900 dark:text-gray-100
    rounded-md
    placeholder-gray-400 dark:placeholder-gray-400
    focus:bg-white dark:focus:bg-gray-700
    transition-colors duration-200
  `.trim();

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-6'>
      {errors.file && (
        <div className='bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg'>
          {errors.file.message}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='date'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Date
            </label>
            <input
              type='date'
              id='date'
              className={inputClasses(errors.date)}
              {...register('date', {
                required: 'Date is required',
              })}
            />
            {errors.date && (
              <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                {errors.date.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='category'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Photo Category
            </label>
            <select
              id='category'
              className='mt-1 block w-full py-2 px-3 h-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200'
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
              <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='notes'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Notes
            </label>
            <textarea
              id='notes'
              rows='4'
              className='mt-1 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md placeholder-gray-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 transition-colors duration-200'
              placeholder='Optional notes about this photo'
              {...register('notes')}
            ></textarea>
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Photo
          </label>

          <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800'>
            {previewUrl ? (
              <div className='space-y-3 text-center'>
                <img
                  src={previewUrl}
                  alt='Preview'
                  className='mx-auto h-64 w-auto object-contain rounded-md'
                />
                <div className='flex justify-center space-x-3'>
                  <button
                    type='button'
                    onClick={removeFile}
                    className='inline-flex items-center px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors'
                  >
                    <svg
                      className='h-4 w-4 mr-1'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                      />
                    </svg>
                    Remove
                  </button>
                  <label
                    htmlFor='file-upload'
                    className='inline-flex items-center px-3 py-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 cursor-pointer transition-colors'
                  >
                    <svg
                      className='h-4 w-4 mr-1'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                      />
                    </svg>
                    Replace
                    <input
                      id='file-upload'
                      name='file-upload'
                      type='file'
                      className='sr-only'
                      accept='image/*'
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className='space-y-2 text-center'>
                <svg
                  className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500'
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
                    className='relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 dark:focus-within:ring-offset-gray-800 transition-colors'
                  >
                    <span>Upload a file</span>
                    <input
                      id='file-upload'
                      name='file-upload'
                      type='file'
                      className='sr-only'
                      accept='image/*'
                      onChange={handleFileChange}
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
            <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
              {errors.file.message}
            </p>
          )}
        </div>
      </div>

      <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
        <button
          type='button'
          onClick={onCancel}
          disabled={loading}
          className='bg-white dark:bg-gray-700 py-2 px-6 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 transition-colors'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={loading || !selectedFile}
          className='inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
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
              Uploading...
            </>
          ) : (
            'Upload Photo'
          )}
        </button>
      </div>
    </form>
  );
};

export default PhotoForm;
