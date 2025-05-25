import React from 'react';

const WaterChart = ({ waterIntake = 0, goal = 2000 }) => {
  // Convert ml to cups (1 cup = 240ml)
  const mlToCups = ml => {
    return (ml / 240).toFixed(1);
  };

  // Calculate percentage for progress
  const calculatePercentage = ml => {
    const percentage = (ml / goal) * 100;
    return Math.min(percentage, 100);
  };

  // Calculate pie chart values
  const percentage = calculatePercentage(waterIntake);
  const remainingPercentage = 100 - percentage;

  // SVG pie chart calculations
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
      <h4 className='text-md font-medium text-gray-800 dark:text-gray-200 mb-4'>
        Water Intake
      </h4>

      {/* Pie Chart and Stats Container */}
      <div className='flex items-center justify-between'>
        {/* Left side - Pie Chart */}
        <div className='flex-shrink-0'>
          <div className='relative'>
            <svg width={size} height={size} className='transform -rotate-90'>
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill='none'
                stroke='#e5e7eb'
                strokeWidth={strokeWidth}
                className='dark:stroke-gray-700'
              />

              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill='none'
                stroke='url(#waterGradient)'
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className='transition-all duration-500 ease-in-out'
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient
                  id='waterGradient'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='0%'
                >
                  <stop offset='0%' stopColor='#3b82f6' />
                  <stop offset='50%' stopColor='#60a5fa' />
                  <stop offset='100%' stopColor='#93c5fd' />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <div className='text-lg font-bold text-gray-900 dark:text-white'>
                {Math.round(percentage)}%
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                of goal
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Stats */}
        <div className='flex-1 ml-6'>
          {/* Current vs Goal */}
          <div className='flex items-center justify-between mb-2'>
            <div className='text-right'>
              <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                {waterIntake}ml
              </span>
              <span className='text-gray-500 dark:text-gray-400 ml-1'>
                / {goal}ml
              </span>
            </div>
          </div>

          {/* Cups conversion */}
          <div className='text-sm text-gray-600 dark:text-gray-400 text-right mb-3'>
            {mlToCups(waterIntake)} / {mlToCups(goal)} cups
          </div>

          {/* Progress bar */}
          <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2'>
            <div
              className='h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500 ease-in-out'
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          {/* Remaining amount */}
          <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400'>
            <span>{Math.round(percentage)}% complete</span>
            <span>{Math.max(0, goal - waterIntake)}ml remaining</span>
          </div>
        </div>
      </div>

      {/* Water droplets indicator */}
      <div className='flex justify-center space-x-1 mt-4'>
        {[...Array(8)].map((_, i) => {
          const isActive = i < Math.ceil((waterIntake / goal) * 8);
          return (
            <div
              key={i}
              className={`text-lg transition-all duration-300 ${
                isActive ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'
              }`}
            >
              💧
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WaterChart;
