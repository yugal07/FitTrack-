import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center border font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  // Variant classes
  const variantClasses = {
    primary: `text-white bg-indigo-600 hover:bg-indigo-700 border-transparent focus:ring-indigo-500 ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`,
    secondary: `text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 border-transparent focus:ring-indigo-500 ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`,
    outline: `text-indigo-600 dark:text-indigo-400 bg-transparent border-indigo-500 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 focus:ring-indigo-500 ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`,
    danger: `text-white bg-red-600 hover:bg-red-700 border-transparent focus:ring-red-500 ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`,
    ghost: `text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border-transparent focus:ring-gray-500 ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Dark mode adjustment
  const darkModeClasses = 'dark:focus:ring-offset-gray-900';
  
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${darkModeClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;