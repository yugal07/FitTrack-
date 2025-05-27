import React from 'react';

const NutritionSummary = ({ nutritionData }) => {
  if (!nutritionData) {
    return (
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
          Today's Nutrition
        </h2>
        <div className='mt-4 text-center py-8'>
          <p className='text-gray-500 dark:text-gray-400'>
            No nutrition data logged today.
          </p>
          <button className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors'>
            Log Nutrition
          </button>
        </div>
      </div>
    );
  }

  // Calculate nutrition stats
  const totalCalories = nutritionData.totalCalories || 0;
  const targetCalories = 2000; // This should come from user settings
  const caloriesPercentage = Math.min(
    100,
    Math.round((totalCalories / targetCalories) * 100)
  );

  // Calculate macros
  const protein = nutritionData.totalProtein || 0;
  const carbs = nutritionData.totalCarbs || 0;
  const fat = nutritionData.totalFat || 0;
  const totalMacros = protein + carbs + fat;

  const proteinPercentage =
    totalMacros > 0 ? Math.round((protein / totalMacros) * 100) : 0;
  const carbsPercentage =
    totalMacros > 0 ? Math.round((carbs / totalMacros) * 100) : 0;
  const fatPercentage =
    totalMacros > 0 ? Math.round((fat / totalMacros) * 100) : 0;

  // Water intake
  const waterIntake = nutritionData.waterIntake || 0;
  const targetWater = 2500; // in ml, should come from user settings
  const waterPercentage = Math.min(
    100,
    Math.round((waterIntake / targetWater) * 100)
  );

  return (
    <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
      <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
        Today's Nutrition
      </h2>

      <div className='mt-4 space-y-4'>
        {/* Calories */}
        <div>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Calories
            </h3>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {totalCalories} / {targetCalories} kcal
            </span>
          </div>
          <div className='mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
            <div
              className='bg-green-500 h-2.5 rounded-full'
              style={{ width: `${caloriesPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Macros */}
        <div>
          <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Macronutrients
          </h3>
          <div className='mt-2 flex h-3 rounded-full overflow-hidden'>
            <div
              className='bg-blue-500'
              style={{ width: `${proteinPercentage}%` }}
              title={`Protein: ${protein}g (${proteinPercentage}%)`}
            ></div>
            <div
              className='bg-purple-500'
              style={{ width: `${carbsPercentage}%` }}
              title={`Carbs: ${carbs}g (${carbsPercentage}%)`}
            ></div>
            <div
              className='bg-yellow-500'
              style={{ width: `${fatPercentage}%` }}
              title={`Fat: ${fat}g (${fatPercentage}%)`}
            ></div>
          </div>
          <div className='mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400'>
            <span>Protein: {protein}g</span>
            <span>Carbs: {carbs}g</span>
            <span>Fat: {fat}g</span>
          </div>
        </div>

        {/* Water */}
        <div>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Water Intake
            </h3>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {(waterIntake / 1000).toFixed(1)} /{' '}
              {(targetWater / 1000).toFixed(1)} L
            </span>
          </div>
          <div className='mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
            <div
              className='bg-blue-500 h-2.5 rounded-full'
              style={{ width: `${waterPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className='mt-6 text-center'>
        <a
          href='/nutrition'
          className='text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300'
        >
          View detailed nutrition →
        </a>
      </div>
    </div>
  );
};

export default NutritionSummary;
