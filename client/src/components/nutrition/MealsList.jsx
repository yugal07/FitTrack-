import { useState } from 'react';
import { format } from 'date-fns';
import api from '../../utils/api';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const MealsList = ({ meals = [], nutritionLogId, onMealDeleted }) => {
  const [deletingMealId, setDeletingMealId] = useState(null);
  const [error, setError] = useState(null);

  // Format meal type for display
  const formatMealType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Handle delete meal
  const handleDeleteMeal = async (mealId) => {
    setDeletingMealId(mealId);
    setError(null);
    
    try {
      const response = await api.delete(`api/nutrition/logs/${nutritionLogId}/meals/${mealId}`);
      if (onMealDeleted) {
        onMealDeleted(response.data.nutritionLog);
      }
    } catch (err) {
      console.error('Error deleting meal:', err);
      setError('Failed to delete meal. Please try again.');
    } finally {
      setDeletingMealId(null);
    }
  };

  if (meals.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        No meals logged for today. Add your first meal!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} />}
      
      {meals.map((meal) => (
        <div 
          key={meal._id} 
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          {/* Meal Header */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {formatMealType(meal.type)}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(meal.time), 'h:mm a')}
              </p>
            </div>
            
            {/* Delete button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDeleteMeal(meal._id)}
              disabled={deletingMealId === meal._id}
            >
              {deletingMealId === meal._id ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
          
          {/* Food Items */}
          <div className="space-y-2 mt-3">
            {meal.foods.map((food, index) => (
              <div 
                key={index}
                className="flex justify-between items-center py-1 border-t border-gray-100 dark:border-gray-800"
              >
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-200">
                    {food.name}
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      ({food.quantity} {food.unit})
                    </span>
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {food.calories} cal
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Meal totals */}
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Total:</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {meal.foods.reduce((total, food) => total + (food.calories * food.quantity), 0)} calories
            </span>
          </div>
          
          {/* Notes */}
          {meal.notes && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm italic text-gray-600 dark:text-gray-400">
                {meal.notes}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MealsList;