import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Button from '../ui/Button';
import Card from '../ui/Card';
import api from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';

const ScheduledWorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [scheduledWorkout, setScheduledWorkout] = useState(null);
  const [error, setError] = useState(null);

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
      // Navigate to workout form with pre-filled data from scheduled workout
      navigate(`/workouts/start`, { 
        state: { 
          workoutId: scheduledWorkout.workoutId._id,
          scheduledWorkoutId: scheduledWorkout._id
        } 
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
    if (window.confirm('Are you sure you want to delete this scheduled workout?')) {
      try {
        await api.delete(`/api/scheduled-workouts/${id}`);
        toast.success('Workout deleted successfully');
        navigate('/workouts');
      } catch (err) {
        console.error('Error deleting scheduled workout:', err);
        toast.error('Failed to delete workout');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !scheduledWorkout) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-500">{error || 'Workout not found'}</p>
          <Button 
            variant="primary" 
            className="mt-4"
            onClick={() => navigate('/workouts')}
          >
            Back to Workouts
          </Button>
        </div>
      </Card>
    );
  }

  const isWorkoutInPast = new Date(scheduledWorkout.scheduledFor) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Scheduled Workout Details
          </h1>
          <div className="mt-4 sm:mt-0 space-x-2">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/workouts')}
            >
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Workout Details */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="space-y-6">
          {/* Main info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{scheduledWorkout.name}</h2>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Scheduled for:</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {format(new Date(scheduledWorkout.scheduledFor), 'EEEE, MMMM d, yyyy')} at {format(new Date(scheduledWorkout.scheduledFor), 'h:mm a')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Duration:</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {scheduledWorkout.duration} minutes
                </p>
              </div>
            </div>
          </div>

          {/* Workout Type & Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Workout Information</h3>
            {scheduledWorkout.workoutId ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Type:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {scheduledWorkout.workoutId.type ? scheduledWorkout.workoutId.type.charAt(0).toUpperCase() + scheduledWorkout.workoutId.type.slice(1) : 'Custom'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fitness Level:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {scheduledWorkout.workoutId.fitnessLevel ? scheduledWorkout.workoutId.fitnessLevel.charAt(0).toUpperCase() + scheduledWorkout.workoutId.fitnessLevel.slice(1) : 'All levels'}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/workouts/${scheduledWorkout.workoutId._id}`)}
                    className="text-sm"
                  >
                    View Workout Details
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Workout details not available</p>
            )}
          </div>

          {/* Notes */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notes</h3>
            {scheduledWorkout.notes ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {scheduledWorkout.notes}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No notes for this workout</p>
            )}
          </div>

          {/* Status */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Status</h3>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                scheduledWorkout.isCompleted
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
              }`}>
                {scheduledWorkout.isCompleted ? 'Completed' : 'Scheduled'}
              </span>
              {scheduledWorkout.isCompleted && scheduledWorkout.workoutSessionId && (
                <Button
                  variant="link"
                  className="ml-4 text-indigo-600 hover:text-indigo-500"
                  onClick={() => navigate(`/workout-sessions/${scheduledWorkout.workoutSessionId._id}`)}
                >
                  View Completed Workout
                </Button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-wrap justify-end gap-3">
            <Button
              variant="danger"
              onClick={handleDeleteWorkout}
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={handleEditWorkout}
            >
              Edit
            </Button>
            {!scheduledWorkout.isCompleted && (
              <Button
                variant="primary"
                onClick={handleStartWorkout}
                disabled={scheduledWorkout.isCompleted}
              >
                {isWorkoutInPast ? 'Log Workout' : 'Start Workout'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledWorkoutDetail;