import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';
import Button from '../ui/Button';
import { startScheduledWorkout, completeScheduledWorkout } from '../../services/scheduledWorkoutService';

const WorkoutForm = ({ workout = null, onSubmit, onCancel }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [scheduledWorkoutId, setScheduledWorkoutId] = useState(null);

  // Your existing form state
  const [formData, setFormData] = useState({
    workoutId: '',
    name: '',
    type: 'strength',
    duration: 60,
    exercises: [], // List of selected exercises
    notes: '',
    rating: 0,
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await api.get('/api/exercises');
        setAvailableExercises(response.data.data || []);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        toast.error('Failed to load exercises');
      }
    };

    fetchExercises();

    // Check if we're starting from a scheduled workout
    if (location.state?.workoutId && location.state?.scheduledWorkoutId) {
      loadScheduledWorkout(location.state.scheduledWorkoutId);
    }
    
    // If editing an existing workout
    if (workout) {
      setFormData({
        ...formData,
        workoutId: workout.workoutId || '',
        name: workout.name || '',
        type: workout.type || 'strength',
        duration: workout.duration || 60,
        exercises: workout.exercises || [],
        notes: workout.notes || '',
        rating: workout.rating || 0,
      });
    }

  }, [workout, location.state, toast]);

  const loadScheduledWorkout = async (scheduledWorkoutId) => {
    setLoading(true);
    const result = await startScheduledWorkout(scheduledWorkoutId);
    
    if (result.success) {
      // Set the form data from the scheduled workout
      setFormData({
        ...formData,
        ...result.data.formData
      });
      
      // Store the scheduled workout ID for later use
      setScheduledWorkoutId(scheduledWorkoutId);
      toast.success('Scheduled workout loaded successfully');
    } else {
      toast.error(result.error || 'Failed to load scheduled workout');
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Build your workout session data from form
      const workoutSessionData = {
        workoutId: formData.workoutId,
        name: formData.name,
        type: formData.type,
        duration: formData.duration,
        notes: formData.notes,
        rating: formData.rating,
      };
      
      // Save workout session
      const response = await api.post('/api/workout-sessions', workoutSessionData);
      const workoutSessionId = response.data.data._id;
      
      // If this was a scheduled workout, mark it as completed
      if (scheduledWorkoutId) {
        await completeScheduledWorkout(scheduledWorkoutId, workoutSessionId);
        toast.success('Scheduled workout completed!');
      }
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(response.data.data);
      } else {
        toast.success('Workout saved successfully');
        navigate('/workouts');
      }
    } catch (err) {
      console.error('Error submitting workout:', err);
      toast.error('Failed to save workout');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form header - show if it's a scheduled workout */}
      {scheduledWorkoutId && (
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Scheduled Workout
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>
                  You're logging a workout from your schedule. When you submit this form, the workout will be marked as completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Basic Info Fields */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Workout Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Workout Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="hiit">HIIT</option>
            <option value="flexibility">Flexibility</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            id="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            max="300"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Workout Rating
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="0">Select Rating</option>
            <option value="1">1 - Very Easy</option>
            <option value="2">2 - Easy</option>
            <option value="3">3 - Moderate</option>
            <option value="4">4 - Hard</option>
            <option value="5">5 - Very Hard</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={formData.notes || ''}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Add notes about this workout session..."
        ></textarea>
      </div>

      {/* Exercises would go here */}
      {/* ... Your exercise selection UI ... */}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            scheduledWorkoutId ? 'Complete Workout' : 'Save Workout'
          )}
        </Button>
      </div>
    </form>
  );
};

export default WorkoutForm;