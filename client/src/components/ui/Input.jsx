import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      id,
      name,
      type = 'text',
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      disabled = false,
      error,
      helperText,
      className = '',
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={id}
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            {label}
            {required && <span className='text-red-500 ml-1'>*</span>}
          </label>
        )}
        <div className='mt-1 relative rounded-md shadow-sm'>
          <input
            ref={ref}
            id={id}
            name={name}
            type={type}
            className={`block w-full rounded-md sm:text-sm 
            ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'} 
            ${error ? 'border-red-300 dark:border-red-700 text-red-900 dark:text-red-300 placeholder-red-300 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-600 dark:focus:border-red-600' : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white'}
          `}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            {...props}
          />
          {error && (
            <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
              <svg
                className='h-5 w-5 text-red-500'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={`mt-2 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
