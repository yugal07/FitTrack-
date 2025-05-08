import React from 'react';
import { format } from 'date-fns';

const UpcomingWorkouts = ({ workouts = [] }) => {
  if (workouts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Workouts</h2>
        <div className="mt-4 text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No upcoming workouts scheduled.</p>
          <button 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Schedule Workout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Workouts</h2>
      <div className="mt-4 space-y-4">
        {workouts.map((workout) => (
          <div 
            key={workout.id} 
            className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{workout.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(workout.scheduledFor), 'EEE, MMM d')} • 
                {format(new Date(workout.scheduledFor), 'h:mm a')}
              </p>
            </div>
            <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingWorkouts;