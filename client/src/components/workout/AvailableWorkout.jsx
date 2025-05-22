import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { apiWithToast } from '../../utils/api';
import Button from '../ui/Button';

const AvailableWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    fitnessLevel: '',
    type: '',
    search: '',
  });

  // Get toast functions
  const toast = useToast();
  // Get toast-enabled API
  const api = apiWithToast(toast);

  // Load available workout templates
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/workouts?isCustom=false');
        setWorkouts(response.data.data);
        setFilteredWorkouts(response.data.data);
      } catch (err) {
        // Error is handled by the API interceptor
        console.error('Error fetching workout templates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    let results = [...workouts];

    if (filter.fitnessLevel) {
      results = results.filter(
        workout => workout.fitnessLevel === filter.fitnessLevel
      );
    }

    if (filter.type) {
      results = results.filter(workout => workout.type === filter.type);
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      results = results.filter(
        workout =>
          workout.name.toLowerCase().includes(searchTerm) ||
          workout.description.toLowerCase().includes(searchTerm) ||
          (workout.tags &&
            workout.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    }

    setFilteredWorkouts(results);
  }, [filter, workouts]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilter = () => {
    setFilter({
      fitnessLevel: '',
      type: '',
      search: '',
    });
  };

  const handleStartWorkout = async workoutId => {
    try {
      // Navigate to create workout session with this template
      window.location.href = `/workouts?template=${workoutId}`;
    } catch (err) {
      // Show toast error
      toast.error('Failed to start workout. Please try again.');
      console.error('Error starting workout:', err);
    }
  };

  // Helper to format fitness level
  const formatFitnessLevel = level => {
    if (!level) return '';
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <div>
      {/* Filters */}
      <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-3'>
          Find Workouts
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label
              htmlFor='fitnessLevel'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Fitness Level
            </label>
            <select
              id='fitnessLevel'
              name='fitnessLevel'
              value={filter.fitnessLevel}
              onChange={handleFilterChange}
              className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
            >
              <option value=''>All Levels</option>
              <option value='beginner'>Beginner</option>
              <option value='intermediate'>Intermediate</option>
              <option value='advanced'>Advanced</option>
            </select>
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
              placeholder='Search by name, description, or tags...'
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

      {/* Workout Templates */}
      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
        </div>
      ) : filteredWorkouts.length === 0 ? (
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
              d='M19 14l-7 7m0 0l-7-7m7 7V3'
            />
          </svg>
          <h3 className='mt-2 text-base font-medium text-gray-900 dark:text-white'>
            No workouts found
          </h3>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Try adjusting your filters to see available workouts.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredWorkouts.map(workout => (
            <div
              key={workout._id}
              className='bg-white dark:bg-gray-800 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-1'>
                      {workout.name}
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {workout.type.charAt(0).toUpperCase() +
                        workout.type.slice(1)}{' '}
                      • {workout.duration} min
                    </p>
                  </div>
                  <div className='bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded text-xs font-medium text-indigo-800 dark:text-indigo-200'>
                    {formatFitnessLevel(workout.fitnessLevel)}
                  </div>
                </div>
              </div>

              <div className='px-6 py-4'>
                <p className='text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3'>
                  {workout.description}
                </p>

                {/* Exercise summary */}
                <div className='mb-4'>
                  <h4 className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>
                    Exercises
                  </h4>
                  <ul className='space-y-1'>
                    {workout.exercises?.slice(0, 3).map((exercise, index) => (
                      <li
                        key={index}
                        className='text-sm text-gray-600 dark:text-gray-300 flex items-center'
                      >
                        <svg
                          className='h-4 w-4 text-indigo-500 mr-2'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                            clipRule='evenodd'
                          />
                        </svg>
                        {exercise.exerciseId?.name || 'Unknown exercise'}
                      </li>
                    ))}
                    {workout.exercises?.length > 3 && (
                      <li className='text-sm text-gray-500 dark:text-gray-400 italic'>
                        + {workout.exercises.length - 3} more exercises
                      </li>
                    )}
                  </ul>
                </div>

                {/* Tags */}
                {workout.tags && workout.tags.length > 0 && (
                  <div className='flex flex-wrap gap-1 mb-4'>
                    {workout.tags.map((tag, i) => (
                      <span
                        key={i}
                        className='bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Rating */}
                {workout.averageRating > 0 && (
                  <div className='flex items-center mb-4'>
                    <div className='flex'>
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(workout.averageRating)
                              ? 'text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                        </svg>
                      ))}
                    </div>
                    <span className='ml-1 text-xs text-gray-500 dark:text-gray-400'>
                      {workout.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <div className='px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700'>
                <Button
                  variant='primary'
                  fullWidth
                  onClick={() => handleStartWorkout(workout._id)}
                >
                  Use This Workout
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableWorkouts;
