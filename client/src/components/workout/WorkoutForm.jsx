import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import api from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';
import Button from '../ui/Button';
import ExerciseForm from './ExerciseForm'; // Assuming this component exists
import {
  startScheduledWorkout,
  completeScheduledWorkout,
} from '../../services/scheduledWorkoutService';

const WorkoutForm = ({ workout = null, onSubmit, onCancel }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // State management
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [scheduledWorkoutId, setScheduledWorkoutId] = useState(null);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(null);
  const [exercises, setExercises] = useState([]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      duration: '',
      type: 'strength',
      notes: '',
    },
  });

  // For validation and conditional rendering
  const watchFields = watch();

  // Fetch exercises and handle workout loading
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
  }, [location.state]); // Remove toast from dependencies

  // Load workout data if editing
  useEffect(() => {
    if (workout) {
      // Format the date and time
      const workoutDate = new Date(workout.date);

      setValue('date', format(workoutDate, 'yyyy-MM-dd'));
      setValue('time', format(workoutDate, 'HH:mm'));
      setValue('duration', workout.duration.toString());
      setValue('type', workout.workoutId?.type || 'strength');
      setValue('notes', workout.notes || '');

      // Set exercises
      setExercises(
        workout.completedExercises?.map(ex => ({
          exerciseId: ex.exerciseId?._id || ex.exerciseId,
          exerciseName: ex.exerciseId?.name || 'Unknown Exercise',
          sets:
            ex.sets?.map(set => ({
              weight: set.weight?.toString() || '',
              reps: set.reps?.toString() || '',
              duration: set.duration?.toString() || '',
              completed: set.completed !== undefined ? set.completed : true,
            })) || [],
        })) || []
      );
    }
  }, [workout, setValue]);

  const loadScheduledWorkout = async scheduledWorkoutId => {
    setLoading(true);
    try {
      const result = await startScheduledWorkout(scheduledWorkoutId);

      if (result.success) {
        // Set the form data from the scheduled workout
        const formData = result.data.formData;

        setValue('date', formData.date || format(new Date(), 'yyyy-MM-dd'));
        setValue('time', formData.time || format(new Date(), 'HH:mm'));
        setValue('duration', formData.duration?.toString() || '');
        setValue('type', formData.type || 'strength');
        setValue('notes', formData.notes || '');

        if (formData.exercises) {
          setExercises(formData.exercises);
        }

        // Store the scheduled workout ID for later use
        setScheduledWorkoutId(scheduledWorkoutId);
        toast.success('Scheduled workout loaded successfully');
      } else {
        toast.error(result.error || 'Failed to load scheduled workout');
      }
    } catch (err) {
      console.error('Error loading scheduled workout:', err);
      toast.error('Failed to load scheduled workout');
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = async formData => {
    try {
      setSubmitting(true);

      // Validate exercises
      if (exercises.length === 0) {
        toast.error('Please add at least one exercise to your workout');
        return;
      }

      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      // Format data for API
      const workoutData = {
        date: dateTime.toISOString(),
        duration: parseInt(formData.duration),
        type: formData.type,
        notes: formData.notes,
        completedExercises: exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets.map(set => ({
            weight: set.weight ? parseFloat(set.weight) : undefined,
            reps: set.reps ? parseInt(set.reps) : undefined,
            duration: set.duration ? parseInt(set.duration) : undefined,
            completed: set.completed,
          })),
        })),
      };

      // Add workout ID if editing
      if (workout) {
        workoutData.workoutId = workout.workoutId?._id || workout.workoutId;
      }

      let workoutSessionId;

      // Submit to API
      if (workout) {
        const response = await api.put(
          `/api/workout-sessions/${workout._id}`,
          workoutData
        );
        workoutSessionId = response.data.data._id;
      } else {
        // For new workouts, we need a workoutId
        // If user didn't select a specific workout template, we'll create a custom one
        if (!workoutData.workoutId) {
          // Create a custom workout first
          const customWorkout = {
            name: `Custom Workout - ${format(dateTime, 'MMM d, yyyy')}`,
            description: 'Custom workout created during workout logging',
            type: formData.type,
            fitnessLevel: 'intermediate', // Default
            isCustom: true,
            duration: parseInt(formData.duration),
            exercises: exercises.map((ex, index) => ({
              exerciseId: ex.exerciseId,
              sets: 1,
              reps: 0,
              order: index + 1,
            })),
          };

          const workoutResponse = await api.post(
            '/api/workouts',
            customWorkout
          );
          workoutData.workoutId = workoutResponse.data.data._id;
        }

        // Now log the workout session
        const response = await api.post('/api/workout-sessions', workoutData);
        workoutSessionId = response.data.data._id;
      }

      // If this was a scheduled workout, mark it as completed
      if (scheduledWorkoutId) {
        await completeScheduledWorkout(scheduledWorkoutId, workoutSessionId);
        toast.success('Scheduled workout completed!');
      } else {
        toast.success(
          workout
            ? 'Workout updated successfully!'
            : 'Workout logged successfully!'
        );
      }

      // Call the onSubmit callback
      if (onSubmit) {
        onSubmit();
      } else {
        navigate('/workouts');
      }
    } catch (err) {
      console.error('Error saving workout:', err);
      toast.error('Failed to save workout');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddExercise = () => {
    setCurrentExercise(null);
    setCurrentExerciseIndex(null);
    setShowExerciseForm(true);
  };

  const handleEditExercise = index => {
    setCurrentExercise(exercises[index]);
    setCurrentExerciseIndex(index);
    setShowExerciseForm(true);
  };

  const handleRemoveExercise = index => {
    setExercises(prev => prev.filter((_, i) => i !== index));
    toast.success('Exercise removed');
  };

  const handleExerciseSubmit = exerciseData => {
    if (currentExerciseIndex !== null) {
      // Edit existing exercise
      setExercises(prev => {
        const updated = [...prev];
        updated[currentExerciseIndex] = exerciseData;
        return updated;
      });
      toast.success('Exercise updated');
    } else {
      // Add new exercise
      setExercises(prev => [...prev, exerciseData]);
      toast.success('Exercise added');
    }

    setShowExerciseForm(false);
    setCurrentExercise(null);
    setCurrentExerciseIndex(null);
  };

  const handleExerciseCancel = () => {
    setShowExerciseForm(false);
    setCurrentExercise(null);
    setCurrentExerciseIndex(null);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  return (
    <div>
      {/* Form header - show if it's a scheduled workout */}
      {scheduledWorkoutId && (
        <div className='bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-6'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-blue-400'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-blue-800 dark:text-blue-200'>
                Scheduled Workout
              </h3>
              <div className='mt-2 text-sm text-blue-700 dark:text-blue-300'>
                <p>
                  You're logging a workout from your schedule. When you submit
                  this form, the workout will be marked as completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExerciseForm ? (
        <ExerciseForm
          exercise={currentExercise}
          onSubmit={handleExerciseSubmit}
          onCancel={handleExerciseCancel}
        />
      ) : (
        <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-6'>
          {/* Date and Time */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='date'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Date*
              </label>
              <input
                type='date'
                id='date'
                className={`mt-1 block w-full rounded-md ${
                  errors.date
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-700'
                } dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                {...register('date', {
                  required: 'Date is required',
                })}
              />
              {errors.date && (
                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='time'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Time
              </label>
              <input
                type='time'
                id='time'
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                {...register('time')}
              />
            </div>
          </div>

          {/* Workout Type and Duration */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='type'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Workout Type*
              </label>
              <select
                id='type'
                className={`mt-1 block w-full rounded-md ${
                  errors.type
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-700'
                } dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                {...register('type', {
                  required: 'Workout type is required',
                })}
              >
                <option value='strength'>Strength</option>
                <option value='cardio'>Cardio</option>
                <option value='flexibility'>Flexibility</option>
                <option value='hybrid'>Hybrid</option>
                <option value='hiit'>HIIT</option>
                <option value='custom'>Custom</option>
              </select>
              {errors.type && (
                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                  {errors.type.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='duration'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Duration (minutes)*
              </label>
              <input
                type='number'
                id='duration'
                min='1'
                onInput={e => {
                  // Prevent negative values by setting to empty if user tries to enter a negative number
                  if (e.target.value < 0) {
                    e.target.value = '';
                  }
                }}
                className={`mt-1 block w-full rounded-md ${
                  errors.duration
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-700'
                } dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                {...register('duration', {
                  required: 'Duration is required',
                  min: {
                    value: 1,
                    message: 'Duration must be at least 1 minute',
                  },
                  validate: {
                    positive: value =>
                      parseInt(value) > 0 || 'Negative values are not allowed',
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Duration must be a positive number',
                  },
                })}
              />
              {errors.duration && (
                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                  {errors.duration.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor='notes'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Notes
            </label>
            <textarea
              id='notes'
              rows='3'
              className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              placeholder='How did the workout feel? Any achievements or challenges?'
              {...register('notes')}
            ></textarea>
          </div>

          {/* Exercises Section */}
          <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                Exercises
              </h3>
              <Button
                type='button'
                variant='secondary'
                onClick={handleAddExercise}
              >
                Add Exercise
              </Button>
            </div>

            {exercises.length === 0 ? (
              <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                No exercises added yet. Click "Add Exercise" to start building
                your workout.
              </div>
            ) : (
              <div className='space-y-4'>
                {exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'
                  >
                    <div className='flex justify-between items-start'>
                      <div>
                        <h4 className='font-medium text-gray-900 dark:text-white'>
                          {exercise.exerciseName}
                        </h4>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          {exercise.sets.length}{' '}
                          {exercise.sets.length === 1 ? 'set' : 'sets'}
                        </p>
                      </div>
                      <div className='flex space-x-2'>
                        <button
                          type='button'
                          onClick={() => handleEditExercise(index)}
                          className='text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300'
                        >
                          Edit
                        </button>
                        <button
                          type='button'
                          onClick={() => handleRemoveExercise(index)}
                          className='text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300'
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Show sets summary */}
                    {exercise.sets.length > 0 && (
                      <div className='mt-3 border-t border-gray-200 dark:border-gray-700 pt-3'>
                        <div className='grid grid-cols-4 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
                          <div>Set</div>
                          <div>Weight</div>
                          <div>Reps</div>
                          <div>Status</div>
                        </div>
                        {exercise.sets.map((set, setIndex) => (
                          <div
                            key={setIndex}
                            className='grid grid-cols-4 gap-2 text-sm'
                          >
                            <div>{setIndex + 1}</div>
                            <div>{set.weight ? `${set.weight} kg` : '-'}</div>
                            <div>
                              {set.reps ||
                                (set.duration ? `${set.duration}s` : '-')}
                            </div>
                            <div>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  set.completed
                                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                }`}
                              >
                                {set.completed ? 'Completed' : 'Skipped'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className='flex justify-end space-x-3'>
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancel
            </Button>
            <Button type='submit' variant='primary' disabled={submitting}>
              {submitting ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : scheduledWorkoutId ? (
                'Complete Workout'
              ) : workout ? (
                'Update Workout'
              ) : (
                'Log Workout'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default WorkoutForm;
