import { useState, useEffect } from 'react';
import { Bell, Filter, Check, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all'); // all, workout, goal, nutrition, system
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { toast } = useToast();

  // Format date
  const formatDate = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return formatRelativeTime(dateString);
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  // Format relative time
  const formatRelativeTime = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return formatDate(dateString);
  };

  // Fetch notifications
  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: pagination.limit,
      });

      if (filter === 'unread') params.append('read', 'false');
      if (filter === 'read') params.append('read', 'true');

      const response = await api.get(`/api/notifications?${params}`);
      setNotifications(response.data.data);
      setPagination(response.data.pagination);
      setSelectAll(false);
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Filter notifications by type
  const getFilteredNotifications = () => {
    if (typeFilter === 'all') return notifications;
    return notifications.filter(n => n.type === typeFilter);
  };

  // Mark selected as read
  const markSelectedAsRead = async () => {
    try {
      const unreadSelected = selectedNotifications.filter(id => {
        const notification = notifications.find(n => n._id === id);
        return notification && !notification.read;
      });

      if (unreadSelected.length === 0) {
        toast.warning('No unread notifications selected');
        return;
      }

      await Promise.all(
        unreadSelected.map(id => api.patch(`/api/notifications/${id}/read`))
      );

      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          unreadSelected.includes(n._id) ? { ...n, read: true } : n
        )
      );

      toast.success(`Marked ${unreadSelected.length} notifications as read`);
      setSelectedNotifications([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Failed to mark as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  // Delete selected notifications
  const deleteSelected = async () => {
    try {
      if (selectedNotifications.length === 0) {
        toast.warning('No notifications selected');
        return;
      }

      await Promise.all(
        selectedNotifications.map(id => api.delete(`/api/notifications/${id}`))
      );

      // Update local state
      setNotifications(prev =>
        prev.filter(n => !selectedNotifications.includes(n._id))
      );

      toast.success(`Deleted ${selectedNotifications.length} notifications`);
      setSelectedNotifications([]);
      setSelectAll(false);

      // Refetch if we deleted all on current page
      if (
        notifications.length === selectedNotifications.length &&
        pagination.page > 1
      ) {
        fetchNotifications(pagination.page - 1);
      }
    } catch (error) {
      console.error('Failed to delete notifications:', error);
      toast.error('Failed to delete notifications');
    }
  };

  // Toggle select all
  const handleSelectAll = () => {
    const filtered = getFilteredNotifications();
    if (selectAll) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filtered.map(n => n._id));
    }
    setSelectAll(!selectAll);
  };

  // Toggle individual notification selection
  const toggleNotificationSelection = notificationId => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // Handle notification click
  const handleNotificationClick = async notification => {
    if (!notification.read) {
      await api.patch(`/api/notifications/${notification._id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === notification._id ? { ...n, read: true } : n))
      );
    }

    if (notification.actionLink) {
      window.location.href = notification.actionLink;
    }
  };

  // Get icon for notification type
  const getNotificationIcon = type => {
    switch (type) {
      case 'workout':
        return '🏋️';
      case 'goal':
        return '🎯';
      case 'nutrition':
        return '🥗';
      case 'system':
        return '📢';
      default:
        return '📌';
    }
  };

  // Get color for notification type
  const getNotificationColor = type => {
    switch (type) {
      case 'workout':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'goal':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'nutrition':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'system':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  // Effect to update select all checkbox
  useEffect(() => {
    const filtered = getFilteredNotifications();
    setSelectAll(
      filtered.length > 0 &&
        filtered.every(n => selectedNotifications.includes(n._id))
    );
  }, [selectedNotifications, notifications, typeFilter]);

  // Fetch notifications on mount and filter change
  useEffect(() => {
    fetchNotifications(1);
  }, [filter]);

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <Bell className='h-8 w-8 text-indigo-600 dark:text-indigo-400' />
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                Notifications
              </h1>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Stay updated with your fitness journey
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-4'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0'>
          {/* Filters */}
          <div className='flex flex-wrap items-center gap-2'>
            <Filter className='h-4 w-4 text-gray-400' />

            {/* Read Status Filter */}
            <div className='flex rounded-md shadow-sm'>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm font-medium rounded-l-md border ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 text-sm font-medium border-t border-b ${
                  filter === 'unread'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-1 text-sm font-medium rounded-r-md border ${
                  filter === 'read'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Read
              </button>
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className='text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md'
            >
              <option value='all'>All Types</option>
              <option value='workout'>Workout</option>
              <option value='goal'>Goal</option>
              <option value='nutrition'>Nutrition</option>
              <option value='system'>System</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className='flex items-center space-x-2'>
              <button
                onClick={markSelectedAsRead}
                className='inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
              >
                <Check className='h-4 w-4 mr-1' />
                Mark as read
              </button>
              <button
                onClick={deleteSelected}
                className='inline-flex items-center px-3 py-1 border border-red-300 dark:border-red-600 text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900'
              >
                <Trash2 className='h-4 w-4 mr-1' />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden'>
        {loading ? (
          <div className='p-8 text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto'></div>
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
              Loading notifications...
            </p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <>
            {/* Select All */}
            <div className='px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded'
                />
                <span className='ml-2 text-sm text-gray-600 dark:text-gray-400'>
                  Select all
                </span>
              </label>
            </div>

            {/* Notifications */}
            <div className='divide-y divide-gray-200 dark:divide-gray-700'>
              {filteredNotifications.map(notification => (
                <div
                  key={notification._id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    !notification.read
                      ? 'bg-indigo-50 dark:bg-indigo-900/10'
                      : ''
                  }`}
                >
                  <div className='flex items-start space-x-4'>
                    <input
                      type='checkbox'
                      checked={selectedNotifications.includes(notification._id)}
                      onChange={() =>
                        toggleNotificationSelection(notification._id)
                      }
                      className='mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded'
                      onClick={e => e.stopPropagation()}
                    />

                    <div className='flex-shrink-0'>
                      <span className='text-2xl'>
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>

                    <div
                      className='flex-1 min-w-0 cursor-pointer'
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <p className='text-sm font-medium text-gray-900 dark:text-white'>
                            {notification.title}
                          </p>
                          <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                            {notification.message}
                          </p>
                          <div className='mt-2 flex items-center space-x-4 text-xs'>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}
                            >
                              {notification.type}
                            </span>
                            <span className='text-gray-500 dark:text-gray-400'>
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                        </div>

                        {!notification.read && (
                          <div className='ml-4 flex-shrink-0'>
                            <span className='inline-block h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400'></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
                <div className='flex items-center justify-between'>
                  <div className='text-sm text-gray-700 dark:text-gray-300'>
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{' '}
                    of {pagination.total} notifications
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => fetchNotifications(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={`px-3 py-1 text-sm font-medium rounded-md ${
                        pagination.page === 1
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchNotifications(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className={`px-3 py-1 text-sm font-medium rounded-md ${
                        pagination.page === pagination.pages
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className='p-12 text-center'>
            <Bell className='h-16 w-16 text-gray-400 mx-auto mb-4' />
            <p className='text-lg font-medium text-gray-900 dark:text-white'>
              No notifications found
            </p>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              {filter === 'unread'
                ? "You're all caught up! No unread notifications."
                : filter === 'read'
                  ? 'No read notifications to display.'
                  : "You don't have any notifications yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
