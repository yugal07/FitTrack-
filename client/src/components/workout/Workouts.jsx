import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import WorkoutList from './WorkoutList';
import AvailableWorkouts from './AvailableWorkout';
import WorkoutForm from './WorkoutForm';
import WorkoutLogger from './WorkoutLogger';

const Workouts = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [showWorkoutLogger, setShowWorkoutLogger] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [workoutLoggerData, setWorkoutLoggerData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get toast functions and navigate
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we should start a workout immediately (from scheduled workout)
  useEffect(() => {
    if (location.state?.startWorkout) {
      setShowWorkoutForm(true);
      setEditingWorkout(null);
      setWorkoutLoggerData(null);
      // Clear the state to prevent re-triggering
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.openLogger) {
      const loggerData = {
        workoutId: location.state.workoutId,
        scheduledWorkoutId: location.state.scheduledWorkoutId,
      };
      setWorkoutLoggerData(loggerData);
      setShowWorkoutLogger(true);
      setShowWorkoutForm(false);
      setEditingWorkout(null);
      // Clear the state to prevent re-triggering
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleStartWorkout = () => {
    setShowWorkoutForm(true);
    setShowWorkoutLogger(false);
    setEditingWorkout(null);
    setWorkoutLoggerData(null);
    setMobileMenuOpen(false);
  };

  const handleScheduleWorkout = () => {
    navigate('/scheduled-workouts/new');
  };

  const handleEditWorkout = workout => {
    setEditingWorkout(workout);
    setShowWorkoutForm(true);
    setShowWorkoutLogger(false);
    setWorkoutLoggerData(null);
  };

  const handleWorkoutSubmit = () => {
    // Reset all states
    setShowWorkoutForm(false);
    setShowWorkoutLogger(false);
    setEditingWorkout(null);
    setWorkoutLoggerData(null);

    // Show success message
    toast.success(
      editingWorkout
        ? 'Workout updated successfully!'
        : 'Workout logged successfully!'
    );

    // Ensure we're on the history tab to see the new workout
    setActiveTab('history');
  };

  const handleWorkoutComplete = workoutData => {
    console.log('Workout completed:', workoutData);

    // Reset all states immediately
    setShowWorkoutLogger(false);
    setShowWorkoutForm(false);
    setEditingWorkout(null);
    setWorkoutLoggerData(null);

    // Show success message
    toast.success('Workout completed successfully!');

    // Ensure we're on the history tab
    setActiveTab('history');

    // Force a small delay to ensure state is updated before any potential re-render
    setTimeout(() => {
      console.log('Workout completion handled, should be on history tab');
    }, 100);
  };

  const handleCancelWorkout = () => {
    // Reset all states
    setShowWorkoutForm(false);
    setShowWorkoutLogger(false);
    setEditingWorkout(null);
    setWorkoutLoggerData(null);
  };

  const handleViewSchedule = () => {
    navigate('/scheduled-workouts');
  };

  // Debug logging
  useEffect(() => {
    console.log('Workouts component state:', {
      showWorkoutForm,
      showWorkoutLogger,
      editingWorkout: !!editingWorkout,
      activeTab,
      workoutLoggerData,
    });
  }, [
    showWorkoutForm,
    showWorkoutLogger,
    editingWorkout,
    activeTab,
    workoutLoggerData,
  ]);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
        {/* Mobile-First Header */}
        <div className='bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 mb-4 sm:mb-6'>
          <div className='p-4 sm:p-6'>
            {/* Header Content */}
            <div className='flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white'>
                  Workouts
                </h1>
                <p className='mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400'>
                  Track, schedule, and manage your activities
                </p>
              </div>

              {/* Mobile Action Menu Toggle */}
              <div className='sm:hidden'>
                <Button
                  variant='primary'
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className='w-full justify-center'
                  disabled={showWorkoutForm || showWorkoutLogger}
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
                      d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                    />
                  </svg>
                  Quick Actions
                </Button>
              </div>

              {/* Desktop Actions */}
              <div className='hidden sm:flex sm:space-x-3'>
                <Button
                  variant='secondary'
                  onClick={handleViewSchedule}
                  disabled={showWorkoutForm || showWorkoutLogger}
                  size='sm'
                >
                  <svg
                    className='h-4 w-4 mr-2'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                      clipRule='evenodd'
                    />
                  </svg>
                  View Schedule
                </Button>
                <Button
                  variant='secondary'
                  onClick={handleScheduleWorkout}
                  disabled={showWorkoutForm || showWorkoutLogger}
                  size='sm'
                >
                  <svg
                    className='h-4 w-4 mr-2'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Schedule
                </Button>
                <Button
                  variant='primary'
                  onClick={handleStartWorkout}
                  disabled={showWorkoutForm || showWorkoutLogger}
                >
                  <svg
                    className='h-4 w-4 mr-2'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Log Workout
                </Button>
              </div>
            </div>

            {/* Mobile Action Menu */}
            {mobileMenuOpen && (
              <div className='mt-4 sm:hidden border-t border-gray-200 dark:border-gray-700 pt-4'>
                <div className='grid grid-cols-1 gap-3'>
                  <Button
                    variant='secondary'
                    onClick={handleViewSchedule}
                    disabled={showWorkoutForm || showWorkoutLogger}
                    className='w-full justify-start'
                  >
                    <svg
                      className='h-5 w-5 mr-3'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                        clipRule='evenodd'
                      />
                    </svg>
                    View Schedule
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={handleScheduleWorkout}
                    disabled={showWorkoutForm || showWorkoutLogger}
                    className='w-full justify-start'
                  >
                    <svg
                      className='h-5 w-5 mr-3'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Schedule Workout
                  </Button>
                  <Button
                    variant='primary'
                    onClick={handleStartWorkout}
                    disabled={showWorkoutForm || showWorkoutLogger}
                    className='w-full justify-start'
                  >
                    <svg
                      className='h-5 w-5 mr-3'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Log Workout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conditional rendering with explicit checks */}
        {showWorkoutLogger ? (
          <div>
            <WorkoutLogger
              workoutId={workoutLoggerData?.workoutId}
              scheduledWorkoutId={workoutLoggerData?.scheduledWorkoutId}
              onComplete={handleWorkoutComplete}
              onCancel={handleCancelWorkout}
            />
          </div>
        ) : showWorkoutForm ? (
          <div className='bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700'>
            <div className='p-4 sm:p-6'>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6'>
                {editingWorkout
                  ? 'Edit Workout'
                  : workoutLoggerData?.scheduledWorkoutId
                    ? 'Complete Scheduled Workout'
                    : 'Log New Workout'}
              </h2>
              <WorkoutForm
                workout={editingWorkout}
                scheduledWorkoutId={workoutLoggerData?.scheduledWorkoutId}
                onSubmit={handleWorkoutSubmit}
                onCancel={handleCancelWorkout}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Mobile-Responsive Tabs */}
            <div className='bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 mb-4 sm:mb-6 overflow-hidden'>
              {/* Mobile Tab Selector */}
              <div className='sm:hidden'>
                <select
                  value={activeTab}
                  onChange={e => setActiveTab(e.target.value)}
                  className='block w-full px-4 py-3 text-base border-0 bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white dark:bg-gray-800'
                >
                  <option value='history'>Workout History</option>
                  <option value='templates'>Workout Templates</option>
                </select>
              </div>

              {/* Desktop Tabs */}
              <div className='hidden sm:block border-b border-gray-200 dark:border-gray-700'>
                <nav className='flex -mb-px'>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'history'
                        ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    Workout History
                  </button>
                  <button
                    onClick={() => setActiveTab('templates')}
                    className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'templates'
                        ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    Workout Templates
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content with Mobile-Responsive Container */}
            <div className='bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700'>
              <div className='p-4 sm:p-6'>
                {activeTab === 'history' ? (
                  <WorkoutList onEditWorkout={handleEditWorkout} />
                ) : (
                  <AvailableWorkouts />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Workouts;
