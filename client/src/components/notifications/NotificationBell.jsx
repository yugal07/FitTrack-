import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { toast } = useToast();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/notifications?limit=10');
      setNotifications(response.data.data);

      // Count unread notifications
      const unread = response.data.data.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async notificationId => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`);

      // Update local state
      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await api.patch('/api/notifications/read-all');

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  // Delete notification
  const deleteNotification = async notificationId => {
    try {
      await api.delete(`/api/notifications/${notificationId}`);

      // Update local state
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      const notification = notifications.find(n => n._id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  // Handle clicking on notification
  const handleNotificationClick = async notification => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }

    if (notification.actionLink) {
      window.location.href = notification.actionLink;
    }

    setIsOpen(false);
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
        return 'text-green-600 dark:text-green-400';
      case 'goal':
        return 'text-purple-600 dark:text-purple-400';
      case 'nutrition':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'system':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications on mount and periodically
  useEffect(() => {
    fetchNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative' ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 rounded-full'
      >
        <Bell className='h-6 w-6' />
        {unreadCount > 0 && (
          <span className='absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-medium'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50'>
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className='text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300'
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className='max-h-96 overflow-y-auto'>
            {loading ? (
              <div className='p-4 text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto'></div>
              </div>
            ) : notifications.length > 0 ? (
              <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                {notifications.map(notification => (
                  <li
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      !notification.read
                        ? 'bg-indigo-50 dark:bg-indigo-900/20'
                        : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className='flex space-x-3'>
                      <div className='flex-shrink-0'>
                        <span className='text-2xl'>
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p
                          className={`text-sm font-medium ${getNotificationColor(notification.type)}`}
                        >
                          {notification.title}
                        </p>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                          {notification.message}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            { addSuffix: true }
                          )}
                        </p>
                      </div>
                      <div className='flex-shrink-0'>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className='text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                        >
                          <svg
                            className='h-4 w-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className='p-8 text-center'>
                <Bell className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  No notifications yet
                </p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
              <a
                href='/notifications'
                className='text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium'
              >
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
