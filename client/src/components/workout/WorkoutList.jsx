import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useToast } from '../../contexts/ToastContext';
import { apiWithToast } from '../../utils/api';
import Button from '../ui/Button';
import WorkoutDetail from './WorkoutDetail';

const WorkoutList = ({ onEditWorkout }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    type: '',
    search: '',
  });

  // Get toast functions
  const toast = useToast();
  // Get toast-enabled API
  const api = apiWithToast(toast);

  // Load workouts from API
  useEffect(() => {
    fetchWorkouts();
  }, [filter]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);

      // Construct query params
      const params = new URLSearchParams();
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);
      if (filter.type) params.append('type', filter.type);
      if (filter.search) params.append('search', filter.search);

      const response = await api.get(
        `/api/workout-sessions?${params.toString()}`
      );
      setWorkouts(response.data.data);
    } catch (err) {
      // Error is handled by the API interceptor
      console.error('Error fetching workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilter = () => {
    setFilter({
      startDate: '',
      endDate: '',
      type: '',
      search: '',
    });
    toast.info('Filters reset');
  };

  const handleViewDetail = workout => {
    setSelectedWorkout(workout);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedWorkout(null);
  };

  const handleEditSelected = () => {
    if (selectedWorkout) {
      onEditWorkout(selectedWorkout);
      setShowDetail(false);
      setSelectedWorkout(null);
    }
  };

  const handleDeleteWorkout = async workoutId => {
    if (
      !window.confirm(
        'Are you sure you want to delete this workout? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await api.delete(`/api/workout-sessions/${workoutId}`);

      // Remove from state
      setWorkouts(prev => prev.filter(workout => workout._id !== workoutId));

      // Close detail view if open
      if (selectedWorkout && selectedWorkout._id === workoutId) {
        setShowDetail(false);
        setSelectedWorkout(null);
      }

      toast.success('Workout deleted successfully');
    } catch (err) {
      // Error is handled by the API interceptor
      console.error('Error deleting workout:', err);
    }
  };

  // Group workouts by month for better organization
  const groupWorkoutsByMonth = () => {
    const grouped = {};

    workouts.forEach(workout => {
      const date = new Date(workout.date);
      const monthYear = format(date, 'MMMM yyyy');

      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }

      grouped[monthYear].push(workout);
    });

    return grouped;
  };

  const groupedWorkouts = groupWorkoutsByMonth();

  // Helper function to get workout icon based on type
  const getWorkoutTypeIcon = type => {
    switch (type) {
      case 'strength':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
            />
          </svg>
        );
      case 'cardio':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 10V3L4 14h7v7l9-11h-7z'
            />
          </svg>
        );
      case 'flexibility':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
            />
          </svg>
        );
      case 'hiit':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 10V3L4 14h7v7l9-11h-7z'
            />
          </svg>
        );
      case 'hybrid':
      case 'custom':
      default:
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
            />
          </svg>
        );
    }
  };

  return (
    <div>
      {showDetail && selectedWorkout ? (
        <WorkoutDetail
          workout={selectedWorkout}
          onClose={handleCloseDetail}
          onEdit={handleEditSelected}
          onDelete={() => handleDeleteWorkout(selectedWorkout._id)}
        />
      ) : (
        <>
          {/* Filter Controls */}
          <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-3'>
              Filter Workouts
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div>
                <label
                  htmlFor='startDate'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Start Date
                </label>
                <input
                  type='date'
                  id='startDate'
                  name='startDate'
                  value={filter.startDate}
                  onChange={handleFilterChange}
                  className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                />
              </div>

              <div>
                <label
                  htmlFor='endDate'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  End Date
                </label>
                <input
                  type='date'
                  id='endDate'
                  name='endDate'
                  value={filter.endDate}
                  onChange={handleFilterChange}
                  className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                />
              </div>

              <div>
                <label
                  htmlFor='type'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Workout Type
                </label>
                <select
                  id='type'
                  name='type'
                  value={filter.type}
                  onChange={handleFilterChange}
                  className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                >
                  <option value=''>All Types</option>
                  <option value='strength'>Strength</option>
                  <option value='cardio'>Cardio</option>
                  <option value='flexibility'>Flexibility</option>
                  <option value='hybrid'>Hybrid</option>
                  <option value='hiit'>HIIT</option>
                  <option value='custom'>Custom</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor='search'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Search
                </label>
                <input
                  type='text'
                  id='search'
                  name='search'
                  value={filter.search}
                  onChange={handleFilterChange}
                  placeholder='Search workouts...'
                  className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                />
              </div>
            </div>

            <div className='mt-4 flex justify-end'>
              <Button variant='outline' onClick={handleResetFilter} size='sm'>
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Workouts List */}
          {loading ? (
            <div className='flex justify-center items-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
            </div>
          ) : workouts.length === 0 ? (
            <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='mx-auto h-12 w-12 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 10h16M4 14h16M4 18h16'
                />
              </svg>
              <h3 className='mt-2 text-base font-medium text-gray-900 dark:text-white'>
                No workouts found
              </h3>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                {Object.values(filter).some(val => val)
                  ? 'Try changing your filters to see more results.'
                  : 'Get started by logging your first workout!'}
              </p>
            </div>
          ) : (
            <div className='space-y-6'>
              {Object.entries(groupedWorkouts).map(
                ([monthYear, monthlyWorkouts]) => (
                  <div key={monthYear}>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-3'>
                      {monthYear}
                    </h3>

                    <div className='bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700'>
                      <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {monthlyWorkouts.map(workout => (
                          <li key={workout._id}>
                            <button
                              className='w-full text-left px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                              onClick={() => handleViewDetail(workout)}
                            >
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                  <div className='flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400'>
                                    {getWorkoutTypeIcon(
                                      workout.workoutId?.type || 'custom'
                                    )}
                                  </div>
                                  <div className='ml-4'>
                                    <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                      {workout.workoutId?.name ||
                                        'Custom Workout'}
                                    </div>
                                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                                      {format(
                                        new Date(workout.date),
                                        'EEEE, MMMM d, yyyy • h:mm a'
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className='flex items-center'>
                                  <div className='mr-4 text-right'>
                                    <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                      {workout.duration} min
                                    </div>
                                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                                      {workout.caloriesBurned
                                        ? `${workout.caloriesBurned} kcal`
                                        : '—'}
                                    </div>
                                  </div>
                                  <svg
                                    className='h-5 w-5 text-gray-400'
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                  >
                                    <path
                                      fillRule='evenodd'
                                      d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                                      clipRule='evenodd'
                                    />
                                  </svg>
                                </div>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkoutList;
