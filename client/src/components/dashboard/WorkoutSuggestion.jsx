// src/components/dashboard/WorkoutSuggestion.jsx
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

// Mock data to use when API fails
const MOCK_WORKOUT = {
  _id: 'mock-workout-1',
  name: 'Full Body Strength',
  description: 'A comprehensive workout targeting all major muscle groups for balanced strength development.',
  type: 'strength',
  fitnessLevel: 'intermediate',
  duration: 45,
  exercises: [
    { exerciseId: { name: 'Push-ups' }, sets: 3, reps: 12 },
    { exerciseId: { name: 'Squats' }, sets: 3, reps: 15 },
    { exerciseId: { name: 'Dumbbell Rows' }, sets: 3, reps: 10 },
    { exerciseId: { name: 'Plank' }, duration: 60, sets: 3 }
  ],
  averageRating: 4.7,
  tags: ['strength', 'full-body', 'intermediate']
};

const WorkoutSuggestion = ({ fitnessLevel = 'beginner' }) => {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const fetchSuggestedWorkout = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Get recommendations based on user's fitness level
        const response = await api.get('/api/workouts/recommended');
        
        if (response.data.data && response.data.data.length > 0) {
          // Just pick the first recommended workout
          setWorkout(response.data.data[0]);
        } else {
          // No recommendations found, use mock data
          console.log('No workout recommendations found, using mock data');
          setWorkout(MOCK_WORKOUT);
        }
      } catch (err) {
        console.error('Error fetching workout suggestion:', err);
        setError(true);
        // Use mock data as fallback
        setWorkout(MOCK_WORKOUT);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSuggestedWorkout();
  }, [fitnessLevel]);
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Workout Suggestion</h2>
        <div className="mt-4 text-center py-8">
          <div className="animate-pulse flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="ml-4 w-3/4 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!workout) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Workout Suggestion</h2>
        <div className="mt-4 text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No workout suggestions available.</p>
          <button 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Explore Workouts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recommended for You</h2>
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{workout.name}</h3>
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="capitalize">{workout.type}</span>
            <span className="mx-2">•</span>
            <span>{workout.duration} minutes</span>
            <span className="mx-2">•</span>
            <span className="capitalize">{workout.fitnessLevel} level</span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{workout.description}</p>
          
          {/* Exercises preview */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Exercises:</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
              {workout.exercises.slice(0, 3).map((exercise, index) => (
                <li key={index} className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {exercise.exerciseId?.name || 'Exercise'} 
                  {exercise.sets && exercise.reps && ` (${exercise.sets} sets × ${exercise.reps} reps)`}
                  {exercise.sets && exercise.duration && ` (${exercise.sets} sets × ${exercise.duration}s)`}
                </li>
              ))}
              
              {workout.exercises.length > 3 && (
                <li className="text-indigo-600 dark:text-indigo-400 italic">
                  +{workout.exercises.length - 3} more exercises
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 px-6 py-2 border-t border-yellow-100 dark:border-yellow-800">
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            Note: Using example workout data. Connect to server for personalized recommendations.
          </p>
        </div>
      )}
      
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {workout.averageRating && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">
                  {workout.averageRating.toFixed(1)} / 5
                </span>
              </div>
            )}
            
            {workout.tags && workout.tags.length > 0 && (
              <div className="ml-4">
                {workout.tags.slice(0, 2).map((tag, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 mr-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <a 
            href={error ? "/workouts" : `/workouts/${workout._id}`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {error ? "Browse Workouts" : "Start Workout"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSuggestion;