import React from 'react';
import { format } from 'date-fns';

const GoalProgress = ({ goals = [] }) => {
  const activeGoals = goals.filter(goal => goal.status === 'active');

  if (activeGoals.length === 0) {
    return (
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
          Goal Progress
        </h2>
        <div className='mt-4 text-center py-10'>
          <p className='text-gray-500 dark:text-gray-400'>
            No active goals at the moment.
          </p>
          <button className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors'>
            Create a New Goal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
      <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
        Goal Progress
      </h2>
      <div className='mt-4 space-y-6'>
        {activeGoals.slice(0, 3).map(goal => {
          // Calculate progress percentage
          const progress = Math.min(
            100,
            Math.round((goal.currentValue / goal.targetValue) * 100)
          );

          return (
            <div key={goal._id} className='space-y-2'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                    {getGoalTitle(goal)}
                  </h3>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    Target date:{' '}
                    {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                  </p>
                </div>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
                <div
                  className='bg-indigo-600 h-2.5 rounded-full'
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Current vs target */}
              <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
                <span>
                  Current: {goal.currentValue} {goal.unit}
                </span>
                <span>
                  Target: {goal.targetValue} {goal.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {activeGoals.length > 3 && (
        <div className='mt-6 text-center'>
          <a
            href='/goals'
            className='text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300'
          >
            View all goals ({activeGoals.length}) →
          </a>
        </div>
      )}
    </div>
  );
};

// Helper function to generate a human-readable goal title
const getGoalTitle = goal => {
  switch (goal.type) {
    case 'weight':
      return `Reach ${goal.targetValue} ${goal.unit} weight`;
    case 'strength':
      return `Increase strength to ${goal.targetValue} ${goal.unit}`;
    case 'endurance':
      return `Build endurance to ${goal.targetValue} ${goal.unit}`;
    case 'habit':
      return `Complete ${goal.targetValue} workouts`;
    case 'nutrition':
      return `Maintain ${goal.targetValue} ${goal.unit} diet`;
    case 'custom':
    default:
      return goal.type.charAt(0).toUpperCase() + goal.type.slice(1);
  }
};

export default GoalProgress;
