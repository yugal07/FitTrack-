import { useState, useEffect } from 'react';
import adminService from '../../../services/adminService';

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Filters
  const [type, setType] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const response = await adminService.getNotifications({
        page,
        limit: pagination.limit,
        type: type || undefined,
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined,
      });

      setNotifications(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTypeChange = e => {
    setType(e.target.value);
  };

  const handleDateChange = e => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    fetchNotifications(1);
  };

  const handlePageChange = newPage => {
    fetchNotifications(newPage);
  };

  return (
    <div className='space-y-6'>
      <div className='border-b border-gray-200 dark:border-gray-700 pb-5'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Notification History
        </h1>
        <p className='mt-1 text-gray-500 dark:text-gray-400'>
          View all notifications sent to users
        </p>
      </div>

      {/* Filter Form */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Filter Notifications
        </h2>
        <form
          onSubmit={handleFilterSubmit}
          className='space-y-4 sm:flex sm:items-end sm:space-y-0 sm:space-x-4'
        >
          <div className='sm:w-1/4'>
            <label
              htmlFor='type'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Notification Type
            </label>
            <select
              id='type'
              name='type'
              value={type}
              onChange={handleTypeChange}
              className='shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md py-2.5 px-4 border-2'
            >
              <option value=''>All Types</option>
              <option value='system'>System</option>
              <option value='workout'>Workout</option>
              <option value='goal'>Goal</option>
              <option value='nutrition'>Nutrition</option>
            </select>
          </div>

          <div className='sm:w-1/4'>
            <label
              htmlFor='startDate'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Start Date
            </label>
            <input
              type='date'
              name='startDate'
              id='startDate'
              value={dateRange.startDate}
              onChange={handleDateChange}
              className='shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md py-2.5 px-4 border-2'
            />
          </div>

          <div className='sm:w-1/4'>
            <label
              htmlFor='endDate'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              End Date
            </label>
            <input
              type='date'
              name='endDate'
              id='endDate'
              value={dateRange.endDate}
              onChange={handleDateChange}
              className='shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md py-2.5 px-4 border-2'
            />
          </div>

          <div className='sm:flex-shrink-0'>
            <button
              type='submit'
              className='w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800'
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>

      {/* Notifications List */}
      <div className='bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg'>
        {loading ? (
          <div className='px-4 py-5 sm:p-6 text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto'></div>
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
              Loading notifications...
            </p>
          </div>
        ) : error ? (
          <div className='px-4 py-5 sm:p-6 text-center'>
            <p className='text-red-500'>{error}</p>
          </div>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                <thead className='bg-gray-50 dark:bg-gray-900'>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                    >
                      Type
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                    >
                      Title
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                    >
                      Message
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <tr
                        key={notification._id}
                        className='hover:bg-gray-50 dark:hover:bg-gray-700'
                      >
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              notification.type === 'system'
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                : notification.type === 'workout'
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                  : notification.type === 'goal'
                                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            }`}
                          >
                            {notification.type}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                          {notification.title}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-400'>
                          <div className='line-clamp-2'>
                            {notification.message}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                          {new Date(notification.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan='4'
                        className='px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400'
                      >
                        No notifications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className='bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6'>
                <div className='flex-1 flex justify-between sm:hidden'>
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${pagination.page === 1 ? 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${pagination.page === pagination.pages ? 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    Next
                  </button>
                </div>
                <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
                  <div>
                    <p className='text-sm text-gray-700 dark:text-gray-300'>
                      Showing{' '}
                      <span className='font-medium'>
                        {(pagination.page - 1) * pagination.limit + 1}
                      </span>{' '}
                      to{' '}
                      <span className='font-medium'>
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total
                        )}
                      </span>{' '}
                      of <span className='font-medium'>{pagination.total}</span>{' '}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                      aria-label='Pagination'
                    >
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${pagination.page === 1 ? 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        <span className='sr-only'>Previous</span>
                        <svg
                          className='h-5 w-5'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                          aria-hidden='true'
                        >
                          <path
                            fillRule='evenodd'
                            d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </button>

                      {/* Page Numbers */}
                      {[...Array(pagination.pages).keys()].map(page => (
                        <button
                          key={page + 1}
                          onClick={() => handlePageChange(page + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${pagination.page === page + 1 ? 'z-10 bg-red-50 dark:bg-red-900 border-red-500 dark:border-red-500 text-red-600 dark:text-red-200' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                          {page + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${pagination.page === pagination.pages ? 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        <span className='sr-only'>Next</span>
                        <svg
                          className='h-5 w-5'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                          aria-hidden='true'
                        >
                          <path
                            fillRule='evenodd'
                            d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats Section */}
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-3'>
        <div className='bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-blue-100 dark:bg-blue-800 rounded-md p-3'>
                <svg
                  className='h-6 w-6 text-blue-600 dark:text-blue-300'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z'
                  />
                </svg>
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                    Total Notifications
                  </dt>
                  <dd>
                    <div className='text-lg font-medium text-gray-900 dark:text-white'>
                      {pagination.total || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-green-100 dark:bg-green-800 rounded-md p-3'>
                <svg
                  className='h-6 w-6 text-green-600 dark:text-green-300'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                    System Announcements
                  </dt>
                  <dd>
                    <div className='text-lg font-medium text-gray-900 dark:text-white'>
                      {notifications.filter(n => n.type === 'system').length ||
                        0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-purple-100 dark:bg-purple-800 rounded-md p-3'>
                <svg
                  className='h-6 w-6 text-purple-600 dark:text-purple-300'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                    Latest Notification
                  </dt>
                  <dd>
                    <div className='text-lg font-medium text-gray-900 dark:text-white'>
                      {notifications.length > 0
                        ? new Date(
                            notifications[0].createdAt
                          ).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationHistory;
