import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import api from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';
import Button from '../ui/Button';
import {
  startScheduledWorkout,
  completeScheduledWorkout,
} from '../../services/scheduledWorkoutService';

const WorkoutLogger = ({
  workoutId: propWorkoutId,
  scheduledWorkoutId: propScheduledWorkoutId,
  onComplete,
  onCancel,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // State management
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [scheduledWorkoutId, setScheduledWorkoutId] = useState(
    propScheduledWorkoutId || location.state?.scheduledWorkoutId || null
  );
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      workoutName: '',
      workoutType: 'strength',
      notes: '',
      feeling: 3, // 1-5 scale
    },
  });

  // Fetch exercises and handle scheduled workout
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/exercises');
        setAvailableExercises(response.data.data || []);

        // Check if we're starting from a scheduled workout
        const targetScheduledWorkoutId =
          scheduledWorkoutId || location.state?.scheduledWorkoutId;
        if (targetScheduledWorkoutId) {
          await loadScheduledWorkout(targetScheduledWorkoutId);
        }
      } catch (err) {
        console.error('Error fetching exercises:', err);
        toast.error('Failed to load exercises');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();

    // Cleanup timer on unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  // Handle completion screen auto-redirect
  useEffect(() => {
    if (showCompletionScreen) {
      const timer = setTimeout(() => {
        handleCompletionRedirect();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showCompletionScreen]);

  const handleCompletionRedirect = () => {
    if (onComplete) {
      // If we have an onComplete prop, use it (when used within Workouts component)
      onComplete();
    } else {
      // Fallback to direct navigation (standalone usage)
      navigate('/workouts');
    }
  };

  const handleCancel = () => {
    // Stop timer if running
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    if (onCancel) {
      onCancel();
    } else {
      navigate('/workouts');
    }
  };

  const loadScheduledWorkout = async scheduledWorkoutId => {
    try {
      const result = await startScheduledWorkout(scheduledWorkoutId);

      if (result.success) {
        const workoutData = result.data.formData;
        setValue('workoutName', workoutData.name || 'Scheduled Workout');
        setValue('workoutType', workoutData.type || 'strength');

        if (workoutData.exercises) {
          setSelectedExercises(
            workoutData.exercises.map(ex => ({
              exerciseId: ex.exerciseId || ex._id,
              exerciseName: ex.name || ex.exerciseName,
              targetSets: ex.sets || 3,
              targetReps: ex.reps || 10,
              targetWeight: ex.weight || 0,
              completedSets: [],
              isCompleted: false,
            }))
          );
        }

        setScheduledWorkoutId(scheduledWorkoutId);
        toast.success('Scheduled workout loaded successfully');
      } else {
        toast.error(result.error || 'Failed to load scheduled workout');
      }
    } catch (err) {
      console.error('Error loading scheduled workout:', err);
      toast.error('Failed to load scheduled workout');
    }
  };

  const startWorkoutTimer = () => {
    setWorkoutStarted(true);
    const interval = setInterval(() => {
      setWorkoutTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopWorkoutTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const addExercise = exerciseId => {
    const exercise = availableExercises.find(ex => ex._id === exerciseId);
    if (
      exercise &&
      !selectedExercises.find(ex => ex.exerciseId === exerciseId)
    ) {
      setSelectedExercises(prev => [
        ...prev,
        {
          exerciseId: exercise._id,
          exerciseName: exercise.name,
          targetSets: 3,
          targetReps: 10,
          targetWeight: 0,
          completedSets: [],
          isCompleted: false,
        },
      ]);
    }
  };

  const removeExercise = exerciseId => {
    setSelectedExercises(prev =>
      prev.filter(ex => ex.exerciseId !== exerciseId)
    );
    if (currentExerciseIndex >= selectedExercises.length - 1) {
      setCurrentExerciseIndex(Math.max(0, selectedExercises.length - 2));
    }
  };

  const addSet = (exerciseIndex, setData) => {
    setSelectedExercises(prev => {
      const updated = [...prev];
      updated[exerciseIndex].completedSets.push({
        reps: parseInt(setData.reps) || 0,
        weight: parseFloat(setData.weight) || 0,
        duration: parseInt(setData.duration) || 0,
        restTime: parseInt(setData.restTime) || 0,
        completed: true,
        timestamp: new Date().toISOString(),
      });
      return updated;
    });
  };

  const markExerciseComplete = exerciseIndex => {
    setSelectedExercises(prev => {
      const updated = [...prev];
      updated[exerciseIndex].isCompleted = true;
      return updated;
    });

    // Move to next exercise
    if (exerciseIndex < selectedExercises.length - 1) {
      setCurrentExerciseIndex(exerciseIndex + 1);
    } else {
      // All exercises completed
      toast.success('All exercises completed! 🎉');
    }
  };

  const onSubmit = async formData => {
    try {
      setSubmitting(true);
      stopWorkoutTimer();

      if (selectedExercises.length === 0) {
        toast.error('Please add at least one exercise');
        return;
      }

      // Create custom workout if needed
      let workoutId = propWorkoutId;
      if (!workoutId && !scheduledWorkoutId) {
        try {
          const customWorkout = {
            name: formData.workoutName,
            description: 'Custom workout created during logging',
            type: formData.workoutType,
            fitnessLevel: 'intermediate',
            isCustom: true,
            duration: Math.floor(workoutTimer / 60),
            exercises: selectedExercises.map((ex, index) => ({
              exerciseId: ex.exerciseId,
              sets: ex.targetSets,
              reps: ex.targetReps,
              order: index + 1,
            })),
          };

          const workoutResponse = await api.post(
            '/api/workouts',
            customWorkout
          );
          workoutId = workoutResponse.data.data._id;
        } catch (err) {
          console.error('Error creating custom workout:', err);
          // Continue without workoutId if creation fails
        }
      }

      // Prepare workout session data
      const workoutSessionData = {
        name: formData.workoutName,
        type: formData.workoutType,
        duration: Math.floor(workoutTimer / 60),
        date: new Date().toISOString(),
        notes: formData.notes,
        feeling: parseInt(formData.feeling),
        completedExercises: selectedExercises.map(ex => ({
          exerciseId: ex.exerciseId,
          sets: ex.completedSets,
          isCompleted: ex.isCompleted,
          targetSets: ex.targetSets,
          targetReps: ex.targetReps,
          targetWeight: ex.targetWeight,
        })),
      };

      // Add workoutId if we have one
      if (workoutId) {
        workoutSessionData.workoutId = workoutId;
      }

      // Save workout session - try different endpoint paths
      console.log('Sending workout session data:', workoutSessionData);
      let sessionResponse;

      try {
        // Try the standard endpoint first
        sessionResponse = await api.post(
          '/api/workout-sessions',
          workoutSessionData
        );
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('Trying alternative endpoint...');
          // Try alternative endpoint names
          try {
            sessionResponse = await api.post(
              '/api/workouts/session',
              workoutSessionData
            );
          } catch (altError) {
            try {
              sessionResponse = await api.post(
                '/api/sessions',
                workoutSessionData
              );
            } catch (finalError) {
              throw new Error(
                'Workout session endpoint not found. Please set up /api/workout-sessions'
              );
            }
          }
        } else {
          throw error;
        }
      }

      console.log('Session response:', sessionResponse);
      const workoutSessionId = sessionResponse.data.data._id;

      // Mark scheduled workout as completed if applicable
      if (scheduledWorkoutId) {
        await completeScheduledWorkout(scheduledWorkoutId, workoutSessionId);
        toast.success('Scheduled workout completed! 🎉');
      } else {
        toast.success('Workout logged successfully! 💪');
      }

      // Set completion states
      setWorkoutCompleted(true);
      setShowCompletionScreen(true);
    } catch (err) {
      console.error('Error saving workout:', err);
      toast.error('Failed to save workout');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto'></div>
          <p className='mt-3 text-sm text-gray-600 dark:text-gray-400'>
            Loading workout...
          </p>
        </div>
      </div>
    );
  }

  if (showCompletionScreen) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900'>
        <div className='text-center'>
          <div className='text-6xl mb-4 animate-bounce'>🎉</div>
          <h1 className='text-3xl font-bold text-white mb-2'>
            Workout Completed!
          </h1>
          <p className='text-indigo-200 mb-4 text-lg'>
            Total time: {formatTime(workoutTimer)}
          </p>
          <div className='flex items-center justify-center space-x-2 text-indigo-300'>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-300'></div>
            <p>Redirecting to workouts...</p>
          </div>
          <div className='mt-4'>
            <Button
              variant='secondary'
              onClick={handleCompletionRedirect}
              className='bg-white/20 hover:bg-white/30 text-white border-white/30'
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentExercise = selectedExercises[currentExerciseIndex];
  const completedExercises = selectedExercises.filter(
    ex => ex.isCompleted
  ).length;
  const totalExercises = selectedExercises.length;

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-4xl mx-auto px-4 py-6'>
        {/* Header */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                {workoutStarted ? 'Workout in Progress' : 'Start Your Workout'}
              </h1>
              {scheduledWorkoutId && (
                <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 mt-1'>
                  Scheduled Workout
                </span>
              )}
            </div>
            <div className='text-right'>
              {workoutStarted && (
                <div className='text-2xl font-mono text-indigo-600 dark:text-indigo-400'>
                  {formatTime(workoutTimer)}
                </div>
              )}
              <Button
                variant='secondary'
                onClick={handleCancel}
                className='ml-4'
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {!workoutStarted ? (
          /* Pre-workout Setup */
          <div className='space-y-6'>
            {/* Workout Details Form */}
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                Workout Details
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Workout Name
                  </label>
                  <input
                    type='text'
                    {...register('workoutName', {
                      required: 'Workout name is required',
                    })}
                    className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                    placeholder='e.g., Morning Strength Training'
                  />
                  {errors.workoutName && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.workoutName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Workout Type
                  </label>
                  <select
                    {...register('workoutType')}
                    className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                  >
                    <option value='strength'>Strength</option>
                    <option value='cardio'>Cardio</option>
                    <option value='hiit'>HIIT</option>
                    <option value='flexibility'>Flexibility</option>
                    <option value='hybrid'>Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Exercise Selection */}
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                Select Exercises
              </h2>

              {/* Add Exercise Dropdown */}
              <div className='mb-4'>
                <select
                  onChange={e => {
                    if (e.target.value) {
                      addExercise(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className='block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                >
                  <option value=''>Select an exercise to add...</option>
                  {availableExercises
                    .filter(
                      ex =>
                        !selectedExercises.find(
                          sel => sel.exerciseId === ex._id
                        )
                    )
                    .map(exercise => (
                      <option key={exercise._id} value={exercise._id}>
                        {exercise.name} ({exercise.category})
                      </option>
                    ))}
                </select>
              </div>

              {/* Selected Exercises */}
              {selectedExercises.length === 0 ? (
                <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                  No exercises selected. Add exercises to start your workout.
                </div>
              ) : (
                <div className='space-y-3'>
                  {selectedExercises.map((exercise, index) => (
                    <div
                      key={`selected-${exercise.exerciseId}-${index}`}
                      className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'
                    >
                      <div>
                        <h3 className='font-medium text-gray-900 dark:text-white'>
                          {exercise.exerciseName}
                        </h3>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          Target: {exercise.targetSets} sets ×{' '}
                          {exercise.targetReps} reps
                        </p>
                      </div>
                      <button
                        onClick={() => removeExercise(exercise.exerciseId)}
                        className='text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300'
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Start Workout Button */}
            {selectedExercises.length > 0 && (
              <div className='text-center'>
                <Button
                  variant='primary'
                  onClick={startWorkoutTimer}
                  className='px-8 py-3 text-lg'
                >
                  🚀 Start Workout
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* During Workout */
          <div className='space-y-6'>
            {/* Progress Bar */}
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Progress
                </span>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {completedExercises} of {totalExercises} exercises
                </span>
              </div>
              <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                <div
                  className='bg-indigo-600 h-2 rounded-full transition-all duration-300'
                  style={{
                    width: `${totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Current Exercise */}
            {currentExercise && (
              <ExerciseTracker
                exercise={currentExercise}
                exerciseIndex={currentExerciseIndex}
                onAddSet={setData => addSet(currentExerciseIndex, setData)}
                onCompleteExercise={() =>
                  markExerciseComplete(currentExerciseIndex)
                }
              />
            )}

            {/* Exercise Navigation */}
            <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-4'>
              <div className='flex space-x-2 overflow-x-auto'>
                {selectedExercises.map((exercise, index) => (
                  <button
                    key={`nav-${exercise.exerciseId}-${index}`}
                    onClick={() => setCurrentExerciseIndex(index)}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      index === currentExerciseIndex
                        ? 'bg-indigo-600 text-white'
                        : exercise.isCompleted
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {exercise.exerciseName}
                    {exercise.isCompleted && ' ✓'}
                  </button>
                ))}
              </div>
            </div>

            {/* Finish Workout */}
            {completedExercises === totalExercises && (
              <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  Finish Your Workout
                </h3>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      How did you feel? (1-5)
                    </label>
                    <select
                      {...register('feeling')}
                      className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                    >
                      <option value='1'>1 - Very Easy</option>
                      <option value='2'>2 - Easy</option>
                      <option value='3'>3 - Moderate</option>
                      <option value='4'>4 - Hard</option>
                      <option value='5'>5 - Very Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Notes
                    </label>
                    <textarea
                      {...register('notes')}
                      rows='3'
                      className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                      placeholder='How did the workout feel? Any achievements or challenges?'
                    />
                  </div>
                  <Button
                    variant='primary'
                    onClick={handleSubmit(onSubmit)}
                    disabled={submitting}
                    className='w-full'
                  >
                    {submitting ? 'Saving...' : '🎉 Complete Workout'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Exercise Tracker Component
const ExerciseTracker = ({
  exercise,
  exerciseIndex,
  onAddSet,
  onCompleteExercise,
}) => {
  const [setData, setSetData] = useState({
    reps: '',
    weight: '',
    duration: '',
    restTime: '',
  });

  const handleAddSet = () => {
    if (!setData.reps && !setData.duration) {
      return;
    }

    onAddSet(setData);
    setSetData({
      reps: setData.reps, // Keep previous values for convenience
      weight: setData.weight,
      duration: '',
      restTime: '',
    });
  };

  return (
    <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
          {exercise.exerciseName}
        </h2>
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          Set {exercise.completedSets.length + 1}
        </span>
      </div>

      {/* Completed Sets */}
      {exercise.completedSets.length > 0 && (
        <div className='mb-6'>
          <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Completed Sets
          </h3>
          <div className='space-y-2'>
            {exercise.completedSets.map((set, index) => (
              <div
                key={`set-${index}-${set.timestamp || index}`}
                className='flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded'
              >
                <span className='text-sm text-gray-900 dark:text-white'>
                  Set {index + 1}
                </span>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  {set.weight > 0 && `${set.weight}kg × `}
                  {set.reps > 0 ? `${set.reps} reps` : `${set.duration}s`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Set */}
      <div className='space-y-4'>
        <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Log Next Set
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div>
            <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Weight (kg)
            </label>
            <input
              type='number'
              value={setData.weight}
              onChange={e =>
                setSetData(prev => ({ ...prev, weight: e.target.value }))
              }
              className='w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              placeholder='0'
            />
          </div>
          <div>
            <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Reps
            </label>
            <input
              type='number'
              value={setData.reps}
              onChange={e =>
                setSetData(prev => ({ ...prev, reps: e.target.value }))
              }
              className='w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              placeholder='10'
            />
          </div>
          <div>
            <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Duration (s)
            </label>
            <input
              type='number'
              value={setData.duration}
              onChange={e =>
                setSetData(prev => ({ ...prev, duration: e.target.value }))
              }
              className='w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              placeholder='60'
            />
          </div>
          <div>
            <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Rest (s)
            </label>
            <input
              type='number'
              value={setData.restTime}
              onChange={e =>
                setSetData(prev => ({ ...prev, restTime: e.target.value }))
              }
              className='w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              placeholder='90'
            />
          </div>
        </div>

        <div className='flex space-x-3'>
          <Button
            variant='primary'
            onClick={handleAddSet}
            disabled={!setData.reps && !setData.duration}
            className='flex-1'
          >
            Add Set
          </Button>
          <Button
            variant='secondary'
            onClick={onCompleteExercise}
            className='flex-1'
          >
            Complete Exercise
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutLogger;
