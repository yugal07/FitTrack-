import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ConfirmModal from '../ui/ConfirmModal';
import api from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';

const ScheduledWorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [scheduledWorkout, setScheduledWorkout] = useState(null);
  const [error, setError] = useState(null);
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    loading: false,
  });

  useEffect(() => {
    const fetchScheduledWorkout = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/scheduled-workouts/${id}`);
        setScheduledWorkout(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching scheduled workout:', err);
        setError('Failed to load workout details');
        toast.error('Failed to load workout details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchScheduledWorkout();
    }
  }, [id]);

  const handleStartWorkout = async () => {
    try {
      navigate('/workouts', {
        state: {
          openLogger: true,
          workoutId: scheduledWorkout.workoutId._id,
          scheduledWorkoutId: scheduledWorkout._id,
        },
      });
    } catch (err) {
      console.error('Error starting workout:', err);
      toast.error('Failed to start workout');
    }
  };

  const handleEditWorkout = () => {
    navigate(`/scheduled-workouts/${id}/edit`);
  };

  const handleDeleteWorkout = async () => {
    setDeleteConfirm(prev => ({ ...prev, loading: true }));

    try {
      await api.delete(`/api/scheduled-workouts/${id}`);
      toast.success('Workout deleted successfully');
      navigate('/workouts');
    } catch (err) {
      console.error('Error deleting scheduled workout:', err);
      toast.error('Failed to delete workout');
      setDeleteConfirm(prev => ({ ...prev, loading: false }));
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  if (error || !scheduledWorkout) {
    return (
      <div className='min-h-screen flex justify-center items-center p-4'>
        <Card className='w-full max-w-md'>
          <div className='text-center py-8'>
            <div className='w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-red-600 dark:text-red-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
              {error || 'Workout not found'}
            </h3>
            <Button variant='primary' onClick={() => navigate('/workouts')}>
              Back to Workouts
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const isWorkoutInPast = new Date(scheduledWorkout.scheduledFor) < new Date();

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8'>
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Header */}
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
          {/* Mobile-first header */}
          <div className='bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div className='flex items-start gap-3'>
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={() => navigate('/workouts')}
                  className='bg-white/20 hover:bg-white/30 text-white border-white/30'
                >
                  <svg
                    className='w-4 h-4 mr-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                  Back
                </Button>
                <div>
                  <h1 className='text-xl sm:text-2xl font-bold text-white'>
                    {scheduledWorkout.name}
                  </h1>
                  <p className='text-indigo-100 text-sm mt-1'>
                    Scheduled Workout Details
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Workout Status Banner */}
          <div className='px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    scheduledWorkout.isCompleted
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : isWorkoutInPast
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                  }`}
                >
                  {scheduledWorkout.isCompleted
                    ? 'Completed'
                    : isWorkoutInPast
                      ? 'Overdue'
                      : 'Scheduled'}
                </span>
                {scheduledWorkout.isCompleted &&
                  scheduledWorkout.workoutSessionId && (
                    <Button
                      variant='link'
                      size='sm'
                      onClick={() =>
                        navigate(
                          `/workout-sessions/${scheduledWorkout.workoutSessionId._id}`
                        )
                      }
                      className='text-indigo-600 hover:text-indigo-500 p-0 h-auto'
                    >
                      View Session →
                    </Button>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column - Main Details */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Schedule Information */}
            <Card className='p-4 sm:p-6'>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center'>
                <svg
                  className='w-5 h-5 mr-2 text-indigo-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                Schedule Information
              </h2>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                  <div className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                    Date
                  </div>
                  <div className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {format(
                      new Date(scheduledWorkout.scheduledFor),
                      'EEEE, MMMM d'
                    )}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-300'>
                    {format(new Date(scheduledWorkout.scheduledFor), 'yyyy')}
                  </div>
                </div>

                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                  <div className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                    Time
                  </div>
                  <div className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {format(new Date(scheduledWorkout.scheduledFor), 'h:mm a')}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-300'>
                    {isWorkoutInPast ? 'Past due' : 'Upcoming'}
                  </div>
                </div>
              </div>
            </Card>

            {/* Workout Information */}
            {scheduledWorkout.workoutId && (
              <Card className='p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>
                  <h2 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center'>
                    <svg
                      className='w-5 h-5 mr-2 text-indigo-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 10V3L4 14h7v7l9-11h-7z'
                      />
                    </svg>
                    Workout Information
                  </h2>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setShowWorkoutDetails(!showWorkoutDetails)}
                  >
                    {showWorkoutDetails ? 'Hide Details' : 'Show Details'}
                  </Button>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-indigo-600 dark:text-indigo-400'>
                      {scheduledWorkout.duration}
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      Minutes
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-indigo-600 dark:text-indigo-400'>
                      {scheduledWorkout.workoutId.exercises?.length || 0}
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      Exercises
                    </div>
                  </div>
                  <div className='text-center col-span-2 sm:col-span-1'>
                    <div className='text-lg font-bold text-indigo-600 dark:text-indigo-400 capitalize'>
                      {scheduledWorkout.workoutId.fitnessLevel || 'All'}
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      Level
                    </div>
                  </div>
                </div>

                <div className='flex flex-wrap gap-2'>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'>
                    {scheduledWorkout.workoutId.type
                      ? scheduledWorkout.workoutId.type
                          .charAt(0)
                          .toUpperCase() +
                        scheduledWorkout.workoutId.type.slice(1)
                      : 'Custom'}
                  </span>
                </div>

                {/* Expandable Workout Details */}
                {showWorkoutDetails && scheduledWorkout.workoutId && (
                  <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
                    {/* Workout Description */}
                    {scheduledWorkout.workoutId.description && (
                      <div className='mb-6'>
                        <h4 className='text-md font-medium text-gray-900 dark:text-white mb-2'>
                          Description
                        </h4>
                        <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                          <p className='text-gray-700 dark:text-gray-300'>
                            {scheduledWorkout.workoutId.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Exercise List */}
                    {scheduledWorkout.workoutId.exercises &&
                      scheduledWorkout.workoutId.exercises.length > 0 && (
                        <div>
                          <h4 className='text-md font-medium text-gray-900 dark:text-white mb-3'>
                            Exercises (
                            {scheduledWorkout.workoutId.exercises.length})
                          </h4>
                          <div className='space-y-3'>
                            {scheduledWorkout.workoutId.exercises
                              .sort((a, b) => (a.order || 0) - (b.order || 0))
                              .map((exercise, index) => (
                                <div
                                  key={exercise._id || index}
                                  className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600'
                                >
                                  <div className='flex items-start justify-between mb-3'>
                                    <div className='flex-1'>
                                      <div className='flex items-center gap-2 mb-2'>
                                        <span className='text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-600 px-2 py-1 rounded'>
                                          #{exercise.order || index + 1}
                                        </span>
                                        <h5 className='text-base font-semibold text-gray-900 dark:text-white'>
                                          {exercise.exerciseId?.name ||
                                            exercise.name ||
                                            'Unknown Exercise'}
                                        </h5>
                                      </div>

                                      {/* Exercise Details Grid */}
                                      <div className='grid grid-cols-3 gap-3 mb-3'>
                                        <div className='text-center bg-white dark:bg-gray-600 rounded p-2'>
                                          <div className='text-xs text-gray-500 dark:text-gray-400'>
                                            Sets
                                          </div>
                                          <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                            {exercise.sets || '—'}
                                          </div>
                                        </div>
                                        <div className='text-center bg-white dark:bg-gray-600 rounded p-2'>
                                          <div className='text-xs text-gray-500 dark:text-gray-400'>
                                            Reps
                                          </div>
                                          <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                            {exercise.reps || '—'}
                                          </div>
                                        </div>
                                        <div className='text-center bg-white dark:bg-gray-600 rounded p-2'>
                                          <div className='text-xs text-gray-500 dark:text-gray-400'>
                                            Weight
                                          </div>
                                          <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                            {exercise.weight
                                              ? `${exercise.weight} kg`
                                              : 'Body weight'}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Tags */}
                                      <div className='flex flex-wrap gap-1'>
                                        {exercise.exerciseId?.category && (
                                          <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'>
                                            {exercise.exerciseId.category}
                                          </span>
                                        )}
                                        {exercise.exerciseId?.muscleGroups
                                          ?.slice(0, 2)
                                          .map((muscle, idx) => (
                                            <span
                                              key={idx}
                                              className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                            >
                                              {muscle}
                                            </span>
                                          ))}
                                        {exercise.exerciseId?.muscleGroups
                                          ?.length > 2 && (
                                          <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'>
                                            +
                                            {exercise.exerciseId.muscleGroups
                                              .length - 2}{' '}
                                            more
                                          </span>
                                        )}
                                      </div>

                                      {/* Instructions (collapsed by default on mobile) */}
                                      {exercise.exerciseId?.instructions && (
                                        <details className='mt-3'>
                                          <summary className='text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300'>
                                            View Instructions
                                          </summary>
                                          <p className='text-sm text-gray-600 dark:text-gray-400 mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600'>
                                            {exercise.exerciseId.instructions}
                                          </p>
                                        </details>
                                      )}

                                      {/* Exercise Notes */}
                                      {exercise.notes && (
                                        <div className='mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-3 border-yellow-400'>
                                          <div className='text-xs text-yellow-700 dark:text-yellow-300 font-medium'>
                                            Note:
                                          </div>
                                          <p className='text-sm text-yellow-800 dark:text-yellow-200'>
                                            {exercise.notes}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </Card>
            )}

            {/* Notes */}
            <Card className='p-4 sm:p-6'>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center'>
                <svg
                  className='w-5 h-5 mr-2 text-indigo-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
                Notes
              </h2>
              {scheduledWorkout.notes ? (
                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                  <p className='text-gray-700 dark:text-gray-300 whitespace-pre-line'>
                    {scheduledWorkout.notes}
                  </p>
                </div>
              ) : (
                <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                  <svg
                    className='w-12 h-12 mx-auto mb-3 opacity-50'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1}
                      d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                    />
                  </svg>
                  <p>No notes for this workout</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Actions & Quick Info */}
          <div className='space-y-6'>
            {/* Quick Actions */}
            <Card className='p-4 sm:p-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Actions
              </h3>
              <div className='space-y-3'>
                {!scheduledWorkout.isCompleted && (
                  <Button
                    variant='primary'
                    onClick={handleStartWorkout}
                    className='w-full'
                    size='lg'
                  >
                    <svg
                      className='w-5 h-5 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a3.5 3.5 0 110 7H9V10zm0 0V9a2 2 0 012-2h1.5a3.5 3.5 0 010 7H12'
                      />
                    </svg>
                    {isWorkoutInPast ? 'Log Workout' : 'Start Workout'}
                  </Button>
                )}

                <Button
                  variant='secondary'
                  onClick={handleEditWorkout}
                  className='w-full'
                >
                  <svg
                    className='w-4 h-4 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                    />
                  </svg>
                  Edit
                </Button>

                <Button
                  variant='danger'
                  onClick={() =>
                    setDeleteConfirm({ isOpen: true, loading: false })
                  }
                  className='w-full'
                >
                  <svg
                    className='w-4 h-4 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                  Delete
                </Button>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className='p-4 sm:p-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Quick Stats
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    Duration
                  </span>
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {scheduledWorkout.duration} min
                  </span>
                </div>
                {scheduledWorkout.workoutId && (
                  <>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        Exercises
                      </span>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {scheduledWorkout.workoutId.exercises?.length || 0}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        Type
                      </span>
                      <span className='font-medium text-gray-900 dark:text-white capitalize'>
                        {scheduledWorkout.workoutId.type || 'Custom'}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        Level
                      </span>
                      <span className='font-medium text-gray-900 dark:text-white capitalize'>
                        {scheduledWorkout.workoutId.fitnessLevel || 'All'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Time Until Workout (for upcoming workouts) */}
            {!scheduledWorkout.isCompleted && !isWorkoutInPast && (
              <Card className='p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700'>
                <h3 className='text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2'>
                  Upcoming
                </h3>
                <p className='text-sm text-indigo-700 dark:text-indigo-300'>
                  Your workout is scheduled for{' '}
                  {format(new Date(scheduledWorkout.scheduledFor), 'EEEE')} at{' '}
                  {format(new Date(scheduledWorkout.scheduledFor), 'h:mm a')}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, loading: false })}
        onConfirm={handleDeleteWorkout}
        title='Delete Scheduled Workout'
        message='Are you sure you want to delete this scheduled workout? This action cannot be undone.'
        confirmText='Delete Workout'
        cancelText='Cancel'
        variant='danger'
        loading={deleteConfirm.loading}
      />
    </div>
  );
};

export default ScheduledWorkoutDetail;
