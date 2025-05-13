import Card from '../ui/Card';

const NutritionSummary = ({ nutritionLog }) => {
  // Macro targets (example values)
  const targets = {
    calories: 2000,
    protein: 120,
    carbs: 250,
    fat: 65
  };
  
  // Calculate percentage of target
  const calculatePercentage = (value, target) => {
    return Math.min((value / target) * 100, 100);
  };
  
  // Calculate macronutrient distribution
  const totalMacros = nutritionLog.totalProtein + nutritionLog.totalCarbs + nutritionLog.totalFat;
  const macroPercentages = {
    protein: totalMacros ? Math.round((nutritionLog.totalProtein / totalMacros) * 100) : 0,
    carbs: totalMacros ? Math.round((nutritionLog.totalCarbs / totalMacros) * 100) : 0,
    fat: totalMacros ? Math.round((nutritionLog.totalFat / totalMacros) * 100) : 0
  };

  return (
    <Card title="Nutrition Summary" className="mb-6">
      {/* Calories */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-1">
          <h4 className="text-gray-700 dark:text-gray-300 font-medium">Calories</h4>
          <div className="text-right">
            <span className="text-xl font-bold text-gray-900 dark:text-white">{nutritionLog.totalCalories}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">/ {targets.calories}</span>
          </div>
        </div>
        <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${calculatePercentage(nutritionLog.totalCalories, targets.calories)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Protein */}
      <div className="mb-4">
        <div className="flex justify-between items-end mb-1">
          <h4 className="text-gray-700 dark:text-gray-300 font-medium">Protein</h4>
          <div className="text-right">
            <span className="font-medium text-gray-900 dark:text-white">{nutritionLog.totalProtein}g</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">/ {targets.protein}g</span>
          </div>
        </div>
        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${calculatePercentage(nutritionLog.totalProtein, targets.protein)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Carbs */}
      <div className="mb-4">
        <div className="flex justify-between items-end mb-1">
          <h4 className="text-gray-700 dark:text-gray-300 font-medium">Carbs</h4>
          <div className="text-right">
            <span className="font-medium text-gray-900 dark:text-white">{nutritionLog.totalCarbs}g</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">/ {targets.carbs}g</span>
          </div>
        </div>
        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full">
          <div 
            className="h-full bg-yellow-500 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${calculatePercentage(nutritionLog.totalCarbs, targets.carbs)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Fat */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-1">
          <h4 className="text-gray-700 dark:text-gray-300 font-medium">Fat</h4>
          <div className="text-right">
            <span className="font-medium text-gray-900 dark:text-white">{nutritionLog.totalFat}g</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">/ {targets.fat}g</span>
          </div>
        </div>
        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full">
          <div 
            className="h-full bg-red-500 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${calculatePercentage(nutritionLog.totalFat, targets.fat)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Macronutrient Distribution */}
      <div>
        <h4 className="text-gray-700 dark:text-gray-300 font-medium mb-2">Macronutrient Distribution</h4>
        <div className="flex h-4 w-full rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 transition-all duration-300 ease-in-out" 
            style={{ width: `${macroPercentages.protein}%` }}
            title={`Protein: ${macroPercentages.protein}%`}
          ></div>
          <div 
            className="bg-yellow-500 transition-all duration-300 ease-in-out" 
            style={{ width: `${macroPercentages.carbs}%` }}
            title={`Carbs: ${macroPercentages.carbs}%`}
          ></div>
          <div 
            className="bg-red-500 transition-all duration-300 ease-in-out" 
            style={{ width: `${macroPercentages.fat}%` }}
            title={`Fat: ${macroPercentages.fat}%`}
          ></div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-between text-xs mt-2 text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span>Protein {macroPercentages.protein}%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
            <span>Carbs {macroPercentages.carbs}%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>Fat {macroPercentages.fat}%</span>
          </div>
        </div>
      </div>
      
      {/* Daily Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-gray-700 dark:text-gray-300 font-medium mb-2">Daily Summary</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Meals</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{nutritionLog.meals.length}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <div className="text-sm text-gray-500 dark:text-gray-400">Water Intake</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {nutritionLog.waterIntake} ml
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <div className="text-sm text-gray-500 dark:text-gray-400">Calories Remaining</div>
            <div className={`text-lg font-semibold ${
              targets.calories - nutritionLog.totalCalories > 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {targets.calories - nutritionLog.totalCalories}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <div className="text-sm text-gray-500 dark:text-gray-400">Protein Goal</div>
            <div className={`text-lg font-semibold ${
              nutritionLog.totalProtein >= targets.protein
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-900 dark:text-white'
            }`}>
              {Math.round((nutritionLog.totalProtein / targets.protein) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NutritionSummary;