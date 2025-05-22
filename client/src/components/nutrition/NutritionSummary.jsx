import React from 'react';
import Card from '../ui/Card';

const NutritionSummary = ({ nutritionLog }) => {
  // Macro targets (example values - in a real app these would come from user settings)
  const targets = {
    calories: 2000,
    protein: 120,
    carbs: 250,
    fat: 65,
  };

  // Calculate percentage of target
  const calculatePercentage = (value, target) => {
    return Math.min((value / target) * 100, 100);
  };

  // Calculate macronutrient distribution
  const totalMacros =
    nutritionLog.totalProtein + nutritionLog.totalCarbs + nutritionLog.totalFat;
  const macroPercentages = {
    protein: totalMacros
      ? Math.round((nutritionLog.totalProtein / totalMacros) * 100)
      : 0,
    carbs: totalMacros
      ? Math.round((nutritionLog.totalCarbs / totalMacros) * 100)
      : 0,
    fat: totalMacros
      ? Math.round((nutritionLog.totalFat / totalMacros) * 100)
      : 0,
  };

  // Calculate calories remaining
  const caloriesRemaining = targets.calories - nutritionLog.totalCalories;
  const isCalorieDeficit = caloriesRemaining > 0;

  return (
    <Card title='Nutrition Summary' className='h-full'>
      {/* Calories */}
      <div className='mb-6'>
        <div className='flex justify-between items-baseline mb-1'>
          <h4 className='text-gray-700 dark:text-gray-300 font-medium'>
            Calories
          </h4>
          <div className='text-right'>
            <span className='text-2xl font-bold text-gray-900 dark:text-white'>
              {nutritionLog.totalCalories}
            </span>
            <span className='text-gray-500 dark:text-gray-400 ml-1'>
              / {targets.calories}
            </span>
          </div>
        </div>
        <div className='h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
          <div
            className='h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-300 ease-in-out'
            style={{
              width: `${calculatePercentage(nutritionLog.totalCalories, targets.calories)}%`,
            }}
          ></div>
        </div>
        <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1'>
          <span>0</span>
          <span>{targets.calories}</span>
        </div>
      </div>

      {/* Calories Breakdown */}
      <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6'>
        <div className='flex items-center mb-2'>
          <div
            className={`flex-1 text-${isCalorieDeficit ? 'green' : 'red'}-600 dark:text-${isCalorieDeficit ? 'green' : 'red'}-400`}
          >
            <div className='text-sm font-medium'>Remaining</div>
            <div className='text-xl font-bold'>
              {isCalorieDeficit ? caloriesRemaining : -caloriesRemaining} kcal
            </div>
          </div>
          <div className='w-px h-12 bg-gray-200 dark:bg-gray-700 mx-4'></div>
          <div className='flex-1 text-gray-700 dark:text-gray-300'>
            <div className='text-sm font-medium'>Goal</div>
            <div className='text-xl font-bold'>{targets.calories} kcal</div>
          </div>
          <div className='w-px h-12 bg-gray-200 dark:bg-gray-700 mx-4'></div>
          <div className='flex-1 text-gray-700 dark:text-gray-300'>
            <div className='text-sm font-medium'>Consumed</div>
            <div className='text-xl font-bold'>
              {nutritionLog.totalCalories} kcal
            </div>
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className='mb-6'>
        <h4 className='text-md font-medium text-gray-800 dark:text-gray-200 mb-4'>
          Macronutrients
        </h4>

        {/* Protein */}
        <div className='mb-4'>
          <div className='flex justify-between items-end mb-1'>
            <div className='flex items-center'>
              <div className='w-3 h-3 bg-blue-500 rounded-full mr-2'></div>
              <h5 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Protein
              </h5>
            </div>
            <div className='text-right'>
              <span className='font-medium text-gray-900 dark:text-white'>
                {nutritionLog.totalProtein}g
              </span>
              <span className='text-gray-500 dark:text-gray-400 ml-1'>
                / {targets.protein}g
              </span>
            </div>
          </div>
          <div className='h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
            <div
              className='h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out'
              style={{
                width: `${calculatePercentage(nutritionLog.totalProtein, targets.protein)}%`,
              }}
            ></div>
          </div>
          <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1'>
            <span>
              {Math.round((nutritionLog.totalProtein / targets.protein) * 100)}%
              of goal
            </span>
            <span>
              {targets.protein - nutritionLog.totalProtein}g remaining
            </span>
          </div>
        </div>

        {/* Carbs */}
        <div className='mb-4'>
          <div className='flex justify-between items-end mb-1'>
            <div className='flex items-center'>
              <div className='w-3 h-3 bg-yellow-500 rounded-full mr-2'></div>
              <h5 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Carbs
              </h5>
            </div>
            <div className='text-right'>
              <span className='font-medium text-gray-900 dark:text-white'>
                {nutritionLog.totalCarbs}g
              </span>
              <span className='text-gray-500 dark:text-gray-400 ml-1'>
                / {targets.carbs}g
              </span>
            </div>
          </div>
          <div className='h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
            <div
              className='h-full bg-yellow-500 rounded-full transition-all duration-300 ease-in-out'
              style={{
                width: `${calculatePercentage(nutritionLog.totalCarbs, targets.carbs)}%`,
              }}
            ></div>
          </div>
          <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1'>
            <span>
              {Math.round((nutritionLog.totalCarbs / targets.carbs) * 100)}% of
              goal
            </span>
            <span>{targets.carbs - nutritionLog.totalCarbs}g remaining</span>
          </div>
        </div>

        {/* Fat */}
        <div className='mb-6'>
          <div className='flex justify-between items-end mb-1'>
            <div className='flex items-center'>
              <div className='w-3 h-3 bg-red-500 rounded-full mr-2'></div>
              <h5 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Fat
              </h5>
            </div>
            <div className='text-right'>
              <span className='font-medium text-gray-900 dark:text-white'>
                {nutritionLog.totalFat}g
              </span>
              <span className='text-gray-500 dark:text-gray-400 ml-1'>
                / {targets.fat}g
              </span>
            </div>
          </div>
          <div className='h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
            <div
              className='h-full bg-red-500 rounded-full transition-all duration-300 ease-in-out'
              style={{
                width: `${calculatePercentage(nutritionLog.totalFat, targets.fat)}%`,
              }}
            ></div>
          </div>
          <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1'>
            <span>
              {Math.round((nutritionLog.totalFat / targets.fat) * 100)}% of goal
            </span>
            <span>{targets.fat - nutritionLog.totalFat}g remaining</span>
          </div>
        </div>
      </div>

      {/* Macronutrient Distribution */}
      <div>
        <h4 className='text-md font-medium text-gray-800 dark:text-gray-200 mb-2'>
          Macronutrient Ratio
        </h4>

        <div className='flex h-8 w-full rounded-lg overflow-hidden shadow-inner'>
          <div
            className='bg-blue-500 transition-all duration-300 ease-in-out relative group'
            style={{ width: `${macroPercentages.protein}%` }}
          >
            <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-xs font-bold'>
              {macroPercentages.protein}%
            </div>
          </div>
          <div
            className='bg-yellow-500 transition-all duration-300 ease-in-out relative group'
            style={{ width: `${macroPercentages.carbs}%` }}
          >
            <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-xs font-bold'>
              {macroPercentages.carbs}%
            </div>
          </div>
          <div
            className='bg-red-500 transition-all duration-300 ease-in-out relative group'
            style={{ width: `${macroPercentages.fat}%` }}
          >
            <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-xs font-bold'>
              {macroPercentages.fat}%
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className='grid grid-cols-3 gap-2 text-xs mt-3 text-gray-600 dark:text-gray-400'>
          <div className='flex items-center'>
            <div className='w-3 h-3 bg-blue-500 rounded-full mr-1'></div>
            <span>Protein {macroPercentages.protein}%</span>
          </div>
          <div className='flex items-center'>
            <div className='w-3 h-3 bg-yellow-500 rounded-full mr-1'></div>
            <span>Carbs {macroPercentages.carbs}%</span>
          </div>
          <div className='flex items-center'>
            <div className='w-3 h-3 bg-red-500 rounded-full mr-1'></div>
            <span>Fat {macroPercentages.fat}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NutritionSummary;
