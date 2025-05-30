import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../../utils/api';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ConfirmModal from '../ui/ConfirmModal';
import { useToast } from '../../contexts/ToastContext';

const ScheduledWorkoutList = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [scheduledWorkouts, setScheduledWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    workoutId: null,
    workoutName: '',
    loading: false,
  });

  useEffect(() => {
    fetchWorkouts();
  }, [activeTab]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const completed = activeTab === 'completed';
      const response = await api.get(
        `/api/scheduled-workouts?completed=${completed}`
      );
      setScheduledWorkouts(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching scheduled workouts:', err);
      setError('Failed to load workouts');
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (workout, e) => {
    e.stopPropagation();
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
      await api.delete(`/api/scheduled-workouts/${deleteConfirm.workoutId}`);
      toast.success('Workout deleted successfully');
      fetchWorkouts();
      setDeleteConfirm({
        isOpen: false,
        workoutId: null,
        workoutName: '',
        loading: false,
      });
    } catch (err) {
      console.error('Error deleting scheduled workout:', err);
      toast.error('Failed to delete workout');
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

  const handleWorkoutClick = id => {
    navigate(`/scheduled-workouts/${id}`);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Scheduled Workouts
          </h1>
          <div className='mt-4 sm:mt-0'>
            <Button
              variant='primary'
              onClick={() => navigate('/scheduled-workouts/new')}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                  clipRule='evenodd'
                />
              </svg>
              Schedule Workout
            </Button>
          </div>
        </div>
        <p className='mt-1 text-gray-500 dark:text-gray-400'>
          Plan and manage your upcoming workout schedule
        </p>
      </div>

      {/* Tabs */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden'>
        <div className='border-b border-gray-200 dark:border-gray-700'>
          <nav className='flex -mb-px'>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'upcoming'
                  ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Upcoming Workouts
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'completed'
                  ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Completed Workouts
            </button>
          </nav>
        </div>
      </div>

      {/* Workout List */}
      <Card>
        {loading ? (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
          </div>
        ) : error ? (
          <div className='text-center py-8'>
            <p className='text-red-500'>{error}</p>
            <Button variant='primary' className='mt-4' onClick={fetchWorkouts}>
              Try Again
            </Button>
          </div>
        ) : scheduledWorkouts.length === 0 ? (
          <div className='text-center py-12'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-12 w-12 mx-auto text-gray-400 dark:text-gray-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
            <h3 className='mt-4 text-lg font-medium text-gray-900 dark:text-white'>
              No {activeTab} workouts
            </h3>
            <p className='mt-1 text-gray-500 dark:text-gray-400'>
              {activeTab === 'upcoming'
                ? "You don't have any workouts scheduled."
                : "You haven't completed any scheduled workouts yet."}
            </p>
            {activeTab === 'upcoming' && (
              <Button
                variant='primary'
                className='mt-4'
                onClick={() => navigate('/scheduled-workouts/new')}
              >
                Schedule Your First Workout
              </Button>
            )}
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-800'>
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
                    Date & Time
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                  >
                    Duration
                  </th>
                  {activeTab === 'completed' && (
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                    >
                      Completed
                    </th>
                  )}
                  <th
                    scope='col'
                    className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                {scheduledWorkouts.map(workout => (
                  <tr
                    key={workout._id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                    onClick={() => handleWorkoutClick(workout._id)}
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div>
                          <div className='text-sm font-medium text-gray-900 dark:text-white'>
                            {workout.name}
                          </div>
                          <div className='text-xs text-gray-500 dark:text-gray-400'>
                            {workout.workoutId?.type
                              ? workout.workoutId.type.charAt(0).toUpperCase() +
                                workout.workoutId.type.slice(1)
                              : 'Custom'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900 dark:text-white'>
                        {format(
                          new Date(workout.scheduledFor),
                          'EEE, MMM d, yyyy'
                        )}
                      </div>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        {format(new Date(workout.scheduledFor), 'h:mm a')}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900 dark:text-white'>
                        {workout.duration} mins
                      </div>
                    </td>
                    {activeTab === 'completed' && (
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'>
                          Completed
                        </span>
                      </td>
                    )}
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <button
                        className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mr-4'
                        onClick={e => handleDeleteClick(workout, e)}
                      >
                        Delete
                      </button>
                      <button
                        className='text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300'
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/scheduled-workouts/${workout._id}/edit`);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title='Delete Scheduled Workout'
        message={`Are you sure you want to delete "${deleteConfirm.workoutName}"? This action cannot be undone.`}
        confirmText='Delete Workout'
        cancelText='Cancel'
        variant='danger'
        loading={deleteConfirm.loading}
      />
    </div>
  );
};

export default ScheduledWorkoutList;
