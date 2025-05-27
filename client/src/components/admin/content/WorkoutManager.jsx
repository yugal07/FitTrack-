import { useState, useEffect } from 'react';
import adminService from '../../../services/adminService';
import WorkoutForm from './WorkoutForm';
import ConfirmModal from '../../ui/ConfirmModal';
import { useToast } from '../../../contexts/ToastContext';

const WorkoutManager = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // State for workout being edited
  const [editingWorkout, setEditingWorkout] = useState(null);

  // State for managing modal visibility
  const [showFormModal, setShowFormModal] = useState(false);

  // State for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    workoutId: null,
    workoutName: '',
    loading: false,
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [difficulty, setDifficulty] = useState('');

  // Toast hook
  const { success, error: showError } = useToast();

  const fetchWorkouts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await adminService.getWorkouts({
        page,
        limit: pagination.limit,
        search: searchTerm,
        type,
        fitnessLevel: difficulty,
        isCustom: false, // Only show preset workouts, not user-created ones
      });

      setWorkouts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch workouts:', err);
      setError('Failed to load workouts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    fetchWorkouts(1);
  };

  const handleTypeChange = e => {
    setType(e.target.value);
    fetchWorkouts(1);
  };

  const handleDifficultyChange = e => {
    setDifficulty(e.target.value);
    fetchWorkouts(1);
  };

  const handlePageChange = newPage => {
    fetchWorkouts(newPage);
  };

  const handleAddWorkout = () => {
    setEditingWorkout(null);
    setShowFormModal(true);
  };

  const handleEditWorkout = workout => {
    setEditingWorkout(workout);
    setShowFormModal(true);
  };

  const handleDeleteClick = workout => {
    setDeleteConfirm({
      isOpen: true,
      workoutId: workout._id,
      workoutName: workout.name,
      loading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteConfirm(prev => ({ ...prev, loading: true }));

    try {
      await adminService.deleteWorkout(deleteConfirm.workoutId);
      success('Workout template deleted successfully');
      fetchWorkouts(pagination.page);
      setDeleteConfirm({
        isOpen: false,
        workoutId: null,
        workoutName: '',
        loading: false,
      });
    } catch (err) {
      console.error('Failed to delete workout:', err);
      showError(
        err.error?.message || 'Failed to delete workout. Please try again.'
      );
      setDeleteConfirm(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteCancel = () => {
    if (!deleteConfirm.loading) {
      setDeleteConfirm({
        isOpen: false,
        workoutId: null,
        workoutName: '',
        loading: false,
      });
    }
  };

  const handleFormSubmit = async workoutData => {
    try {
      if (editingWorkout) {
        await adminService.updateWorkout(editingWorkout._id, workoutData);
        success('Workout template updated successfully');
      } else {
        await adminService.createWorkout(workoutData);
        success('Workout template created successfully');
      }

      setShowFormModal(false);
      fetchWorkouts(pagination.page);
    } catch (err) {
      console.error('Failed to save workout:', err);
      showError(
        err.error?.message || 'Failed to save workout. Please try again.'
      );
      return false;
    }

    return true;
  };

  const closeModal = () => {
    setShowFormModal(false);
  };

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'strength', label: 'Strength' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'hiit', label: 'HIIT' },
    { value: 'custom', label: 'Custom' },
  ];

  const difficultyOptions = [
    { value: '', label: 'All Difficulties' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const getWorkoutTypeClass = type => {
    switch (type) {
      case 'strength':
        return 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100';
      case 'cardio':
        return 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100';
      case 'flexibility':
        return 'bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100';
      case 'hybrid':
        return 'bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100';
      case 'hiit':
        return 'bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-100';
      case 'custom':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className='space-y-6'>
      <div className='border-b border-gray-200 dark:border-gray-700 pb-5 flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Workout Templates
          </h1>
          <p className='mt-1 text-gray-500 dark:text-gray-400'>
            Manage workout templates available to users
          </p>
        </div>
        <div>
          <button
            type='button'
            onClick={handleAddWorkout}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800'
          >
            <svg
              className='h-5 w-5 mr-2'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>
            Add Workout
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
        <form
          onSubmit={handleSearch}
          className='space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4'
        >
          <div className='w-full sm:max-w-xs'>
            <label htmlFor='search' className='sr-only'>
              Search workouts
            </label>
            <div className='relative rounded-md shadow-sm'>
              <input
                type='text'
                name='search'
                id='search'
                className='block w-full pr-10 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-red-500 focus:border-red-500'
                placeholder='Search workouts'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <svg
                  className='h-5 w-5 text-gray-400'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor='type' className='sr-only'>
              Workout Type
            </label>
            <select
              id='type'
              name='type'
              className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md'
              value={type}
              onChange={handleTypeChange}
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor='difficulty' className='sr-only'>
              Difficulty
            </label>
            <select
              id='difficulty'
              name='difficulty'
              className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md'
              value={difficulty}
              onChange={handleDifficultyChange}
            >
              {difficultyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type='submit'
            className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
          >
            Search
          </button>
        </form>
      </div>

      {/* Workouts Table */}
      <div className='bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg'>
        {loading ? (
          <div className='px-4 py-5 sm:p-6 text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto'></div>
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
              Loading workouts...
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
                      Workout
                    </th>
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
                      Difficulty
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                    >
                      Duration
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                    >
                      Rating
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                  {workouts.length > 0 ? (
                    workouts.map(workout => (
                      <tr
                        key={workout._id}
                        className='hover:bg-gray-50 dark:hover:bg-gray-700'
                      >
                        <td className='px-6 py-4'>
                          <div className='flex items-center'>
                            <div className='ml-0'>
                              <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                {workout.name}
                              </div>
                              <div className='text-sm text-gray-500 dark:text-gray-400 line-clamp-1'>
                                {workout.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getWorkoutTypeClass(workout.type)}`}
                          >
                            {workout.type}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              workout.fitnessLevel === 'beginner'
                                ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
                                : workout.fitnessLevel === 'intermediate'
                                  ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100'
                                  : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100'
                            }`}
                          >
                            {workout.fitnessLevel}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                          {workout.duration} min
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <svg
                              className='h-5 w-5 text-yellow-400'
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                            </svg>
                            <span className='ml-1'>
                              {workout.averageRating?.toFixed(1) || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <button
                            onClick={() => handleEditWorkout(workout)}
                            className='text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(workout)}
                            className='text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300'
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan='6'
                        className='px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400'
                      >
                        No workouts found
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

      {/* Workout Form Modal */}
      {showFormModal && (
        <div
          className='fixed z-10 inset-0 overflow-y-auto'
          aria-labelledby='modal-title'
          role='dialog'
          aria-modal='true'
        >
          <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
            {/* Background overlay */}
            <div
              className='fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity'
              aria-hidden='true'
              onClick={closeModal}
            ></div>

            {/* Modal panel */}
            <div className='inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full'>
              <WorkoutForm
                workout={editingWorkout}
                onSubmit={handleFormSubmit}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title='Delete Workout Template'
        message={`Are you sure you want to delete "${deleteConfirm.workoutName}"? This action cannot be undone and will remove this workout template from the system. Users who have saved this workout will lose access to it, and any scheduled workouts using this template will be affected.`}
        confirmText='Delete Template'
        cancelText='Cancel'
        variant='danger'
        loading={deleteConfirm.loading}
      />
    </div>
  );
};

export default WorkoutManager;
