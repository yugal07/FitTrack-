import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import WorkoutList from './WorkoutList';
import AvailableWorkouts from './AvailableWorkout';
import WorkoutForm from './WorkoutForm';

const Workouts = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);

  // Get toast functions and navigate
  const toast = useToast();
  const navigate = useNavigate();

  const handleStartWorkout = () => {
    setShowWorkoutForm(true);
    setEditingWorkout(null);
  };

  const handleScheduleWorkout = () => {
    navigate('/scheduled-workouts/new');
  };

  const handleEditWorkout = workout => {
    setEditingWorkout(workout);
    setShowWorkoutForm(true);
  };

  const handleWorkoutSubmit = () => {
    setShowWorkoutForm(false);
    setEditingWorkout(null);

    // Show success message
    toast.success(
      editingWorkout
        ? 'Workout updated successfully!'
        : 'Workout logged successfully!'
    );

    // Refresh data or update state here
    setActiveTab('history');
  };

  const handleCancelWorkout = () => {
    setShowWorkoutForm(false);
    setEditingWorkout(null);
  };

  const handleViewSchedule = () => {
    navigate('/scheduled-workouts');
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Workouts
          </h1>
          <div className='mt-4 sm:mt-0 space-x-2'>
            <Button
              variant='secondary'
              onClick={handleViewSchedule}
              disabled={showWorkoutForm}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2'
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
              disabled={showWorkoutForm}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2'
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
              disabled={showWorkoutForm}
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
              Log Workout
            </Button>
          </div>
        </div>
        <p className='mt-1 text-gray-500 dark:text-gray-400'>
          Track, schedule, and manage your workout activities
        </p>
      </div>

      {/* Workout Form */}
      {showWorkoutForm ? (
        <Card title={editingWorkout ? 'Edit Workout' : 'Log New Workout'}>
          <WorkoutForm
            workout={editingWorkout}
            onSubmit={handleWorkoutSubmit}
            onCancel={handleCancelWorkout}
          />
        </Card>
      ) : (
        <>
          {/* Tabs */}
          <div className='bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden'>
            <div className='border-b border-gray-200 dark:border-gray-700'>
              <nav className='flex -mb-px'>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-3 font-medium text-sm border-b-2 ${
                    activeTab === 'history'
                      ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  Workout History
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`px-6 py-3 font-medium text-sm border-b-2 ${
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

          {/* Tab content */}
          <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
            {activeTab === 'history' ? (
              <WorkoutList onEditWorkout={handleEditWorkout} />
            ) : (
              <AvailableWorkouts />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Workouts;
