// src/components/dashboard/StatCard.jsx
import React from 'react';
import { 
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/solid';

// Icon components would be imported from a library like heroicons or lucide
const icons = {
  Dumbbell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
    </svg>
  ),
  Flame: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
  Target: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

const StatCard = ({ title, value, icon, trend }) => {
  const Icon = icons[icon] || icons.Dumbbell;
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className="bg-indigo-100 dark:bg-indigo-900 rounded-md p-2 text-indigo-600 dark:text-indigo-400">
          <Icon />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          {trend === 'up' ? (
            <>
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
              <span className="ml-1 text-sm text-green-500">Trending up</span>
            </>
          ) : (
            <>
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
              <span className="ml-1 text-sm text-red-500">Trending down</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;