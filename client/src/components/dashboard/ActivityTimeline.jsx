import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';

const ActivityTimeline = ({ recentWorkouts = [] }) => {
  if (recentWorkouts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
        <div className="mt-4 text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No recent activities recorded yet.</p>
          <button 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Log Your First Workout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
      <div className="mt-4 space-y-6">
        {recentWorkouts.map((workout, index) => (
          <div key={workout._id || index} className="relative pl-8">
            {/* Timeline connector */}
            {index !== recentWorkouts.length - 1 && (
              <div className="absolute top-5 left-3 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
            )}
            
            {/* Timeline dot */}
            <div className="absolute top-1 left-0 h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>
            
            {/* Content */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium text-gray-900 dark:text-white">
                  {workout.workoutId?.name || 'Workout Session'}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(workout.date), { addSuffix: true })}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {workout.duration} minutes • {workout.caloriesBurned || '—'} calories
              </p>
              {workout.notes && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  {workout.notes}
                </p>
              )}
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  workout.difficulty >= 4 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                    : workout.difficulty >= 3
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {workout.difficulty >= 4 
                    ? 'Challenging' 
                    : workout.difficulty >= 3 
                    ? 'Moderate' 
                    : 'Easy'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <a href="/workout-sessions" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
          View all activity →
        </a>
      </div>
    </div>
  );
};

export default ActivityTimeline;