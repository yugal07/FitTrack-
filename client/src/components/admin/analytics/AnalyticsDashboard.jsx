import { useState, useEffect } from 'react';
import adminService from '../../../services/adminService';

// Sample chart using recharts
const BarChart = ({ data, dataKey, nameKey, color }) => {
  // This would typically use Recharts or another charting library
  // For simplicity, we'll create a basic chart visualization
  const maxValue = Math.max(...data.map(item => item[dataKey]));

  return (
    <div className='mt-4'>
      {data.map((item, index) => (
        <div key={index} className='flex items-center mb-2'>
          <div className='w-24 text-sm text-gray-600 dark:text-gray-400'>
            {item[nameKey]}
          </div>
          <div className='flex-1 h-5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
            <div
              className={`h-full ${color}`}
              style={{ width: `${(item[dataKey] / maxValue) * 100}%` }}
            ></div>
          </div>
          <div className='w-16 text-right text-sm font-medium text-gray-900 dark:text-white ml-2'>
            {item[dataKey]}
          </div>
        </div>
      ))}
    </div>
  );
};

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAnalytics({
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined,
      });
      setAnalytics(response.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleDateChange = e => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    fetchAnalytics();
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-md text-red-700 dark:text-red-300'>
        <p>{error}</p>
      </div>
    );
  }

  // Sample data for charts (would come from backend in a real implementation)
  const userGrowthData = analytics?.userGrowth || [
    { date: '2025-01', count: 24 },
    { date: '2025-02', count: 37 },
    { date: '2025-03', count: 52 },
    { date: '2025-04', count: 68 },
    { date: '2025-05', count: 95 },
  ];

  const workoutActivityData = analytics?.workoutActivity || [
    { date: '2025-01', count: 145 },
    { date: '2025-02', count: 237 },
    { date: '2025-03', count: 352 },
    { date: '2025-04', count: 418 },
    { date: '2025-05', count: 495 },
  ];

  const popularWorkoutsData = analytics?.popularWorkouts || [
    { name: 'Full Body HIIT', count: 87 },
    { name: 'Upper Body Strength', count: 65 },
    { name: 'Core Crusher', count: 43 },
    { name: 'Leg Day', count: 32 },
    { name: 'Cardio Blast', count: 28 },
  ];

  const usersByFitnessLevelData = analytics?.usersByFitnessLevel || [
    { _id: 'beginner', count: 45 },
    { _id: 'intermediate', count: 32 },
    { _id: 'advanced', count: 18 },
  ];

  return (
    <div className='space-y-6'>
      <div className='border-b border-gray-200 dark:border-gray-700 pb-5'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Analytics
        </h1>
        <p className='mt-1 text-gray-500 dark:text-gray-400'>
          Platform usage statistics and user engagement metrics
        </p>
      </div>

      {/* Date Range Filter */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Filter by Date Range
        </h2>
        <form onSubmit={handleFilterSubmit} className='sm:flex sm:items-center'>
          <div className='sm:flex-1 sm:flex sm:items-center sm:space-x-4'>
            <div className='w-full sm:w-1/3'>
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
                className='shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md'
              />
            </div>
            <div className='w-full sm:w-1/3 mt-4 sm:mt-0'>
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
                className='shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md'
              />
            </div>
            <div className='mt-4 sm:mt-0 sm:flex-shrink-0 sm:ml-auto'>
              <button
                type='submit'
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800'
              >
                Apply Filter
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Analytics Cards */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2'>
        {/* User Growth */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
          <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
            User Growth
          </h2>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
            Monthly new user registrations
          </p>

          <BarChart
            data={userGrowthData}
            dataKey='count'
            nameKey='date'
            color='bg-blue-500'
          />
        </div>

        {/* Workout Activity */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
          <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
            Workout Activity
          </h2>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
            Monthly completed workouts
          </p>

          <BarChart
            data={workoutActivityData}
            dataKey='count'
            nameKey='date'
            color='bg-green-500'
          />
        </div>

        {/* Popular Workouts */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
          <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
            Popular Workouts
          </h2>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
            Most frequently completed workouts
          </p>

          <BarChart
            data={popularWorkoutsData}
            dataKey='count'
            nameKey='name'
            color='bg-purple-500'
          />
        </div>

        {/* User Fitness Levels */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
          <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
            User Fitness Levels
          </h2>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
            Distribution of users by fitness level
          </p>

          <BarChart
            data={usersByFitnessLevelData}
            dataKey='count'
            nameKey='_id'
            color='bg-yellow-500'
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
