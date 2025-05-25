import api from '../utils/api';

// Function to start a workout from a scheduled workout
export const startScheduledWorkout = async scheduledWorkoutId => {
  try {
    // Get the scheduled workout details
    const response = await api.get(
      `/api/scheduled-workouts/${scheduledWorkoutId}`
    );
    const scheduledWorkout = response.data.data;

    // Get the workout details
    const workoutResponse = await api.get(
      `/api/workouts/${scheduledWorkout.workoutId._id}`
    );
    const workout = workoutResponse.data.data;

    // Return the combined data needed to start a workout
    return {
      success: true,
      data: {
        scheduledWorkout,
        workout,
        // Pre-fill form data
        formData: {
          workoutId: workout._id,
          name: workout.name,
          type: workout.type,
          exercises: workout.exercises,
          notes: scheduledWorkout.notes || '',
          scheduledWorkoutId, // Keep reference to the scheduled workout
        },
      },
    };
  } catch (error) {
    console.error('Error starting scheduled workout:', error);
    return {
      success: false,
      error: 'Failed to load workout details',
    };
  }
};

// Function to complete a scheduled workout
export const completeScheduledWorkout = async (
  scheduledWorkoutId,
  workoutSessionId
) => {
  try {
    // Update the scheduled workout to mark it as completed
    const response = await api.put(
      `/api/scheduled-workouts/${scheduledWorkoutId}/complete`,
      {
        workoutSessionId,
      }
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error completing scheduled workout:', error);
    return {
      success: false,
      error: 'Failed to mark workout as completed',
    };
  }
};
