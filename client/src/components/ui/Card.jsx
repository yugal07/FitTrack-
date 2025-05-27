const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors ${className}`}
    >
      {(title || subtitle) && (
        <div
          className={`px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 ${headerClassName}`}
        >
          {title && (
            <h3 className='text-lg leading-6 font-medium text-gray-900 dark:text-white'>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className='mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400'>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className={`px-4 py-5 sm:p-6 ${bodyClassName}`}>{children}</div>

      {footer && (
        <div
          className={`px-4 py-4 sm:px-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 ${footerClassName}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
