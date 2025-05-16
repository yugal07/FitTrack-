import { useState } from 'react';
import { format } from 'date-fns';
import { useToast } from '../../contexts/ToastContext';
import { apiWithToast } from '../../utils/api';
import Button from '../ui/Button';

const MealsList = ({ meals = [], nutritionLogId, onMealDeleted, showDetails = false }) => {
  const [deletingMealId, setDeletingMealId] = useState(null);
  const [expandedMealId, setExpandedMealId] = useState(null);
  
  // Get toast functions
  const toast = useToast();
  // Get toast-enabled API
  const api = apiWithToast(toast);

  // Format meal type for display
  const formatMealType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Handle delete meal
  const handleDeleteMeal = async (mealId) => {
    setDeletingMealId(mealId);
    
    try {
      const response = await api.delete(`api/nutrition/logs/${nutritionLogId}/meals/${mealId}`);
      toast.success('Meal deleted successfully');
      
      if (onMealDeleted) {
        onMealDeleted(response.data.nutritionLog);
      }
    } catch (err) {
      // Error is handled by the API interceptor
      console.error('Error deleting meal:', err);
    } finally {
      setDeletingMealId(null);
    }
  };

  // Toggle expanded meal
  const toggleMealExpand = (mealId) => {
    if (expandedMealId === mealId) {
      setExpandedMealId(null);
    } else {
      setExpandedMealId(mealId);
    }
  };

  // Get meal icon based on type
  const getMealIcon = (type) => {
    switch (type) {
      case 'breakfast':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'lunch':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'dinner':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        );
      case 'snack':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
    }
  };

  // Calculate total macros for a meal
  const calculateMealMacros = (foods) => {
    return foods.reduce((total, food) => {
      return {
        calories: total.calories + (food.calories * food.quantity),
        protein: total.protein + (food.protein * food.quantity),
        carbs: total.carbs + (food.carbs * food.quantity),
        fat: total.fat + (food.fat * food.quantity)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  // Get background color for meal card based on type
  const getMealCardBg = (type) => {
    switch (type) {
      case 'breakfast':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'lunch':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'dinner':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      case 'snack':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  // Get text color for meal based on type
  const getMealTextColor = (type) => {
    switch (type) {
      case 'breakfast':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'lunch':
        return 'text-green-800 dark:text-green-200';
      case 'dinner':
        return 'text-purple-800 dark:text-purple-200';
      case 'snack':
        return 'text-blue-800 dark:text-blue-200';
      default:
        return 'text-gray-800 dark:text-gray-200';
    }
  };

  if (meals.length === 0) {
    return (
      <div className="text-center py-6 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="mt-4 text-gray-600 dark:text-gray-400">No meals logged for today.</p>
        <p className="text-gray-500 dark:text-gray-500">Add your first meal to start tracking your nutrition!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meals.map((meal) => {
        const mealMacros = calculateMealMacros(meal.foods);
        const isExpanded = expandedMealId === meal._id || showDetails;
        
        return (
          <div 
            key={meal._id} 
            className={`p-4 border rounded-lg transition-all duration-200 ${getMealCardBg(meal.type)}`}
          >
            {/* Meal Header */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${getMealTextColor(meal.type)} bg-white dark:bg-gray-800`}>
                  {getMealIcon(meal.type)}
                </div>
                <div>
                  <h4 className={`font-medium ${getMealTextColor(meal.type)}`}>
                    {formatMealType(meal.type)}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(meal.time), 'h:mm a')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Expand/collapse button */}
                {!showDetails && (
                  <button
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => toggleMealExpand(meal._id)}
                  >
                    {isExpanded ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )}
                
                {/* Delete button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteMeal(meal._id)}
                  disabled={deletingMealId === meal._id}
                >
                  {deletingMealId === meal._id ? (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Meal summary - always visible */}
            <div className="grid grid-cols-4 gap-2 mt-3 mb-2 py-2 px-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Calories</p>
                <p className="font-bold text-gray-900 dark:text-white">{mealMacros.calories}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Protein</p>
                <p className="font-medium text-blue-600 dark:text-blue-400">{mealMacros.protein}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Carbs</p>
                <p className="font-medium text-yellow-600 dark:text-yellow-400">{mealMacros.carbs}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Fat</p>
                <p className="font-medium text-red-600 dark:text-red-400">{mealMacros.fat}g</p>
              </div>
            </div>
            
            {/* Expanded content */}
            {isExpanded && (
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Food Items:
                </h5>
                
                <div className="space-y-2">
                  {meal.foods.map((food, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {food.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {food.quantity} {food.unit}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {food.calories * food.quantity} cal
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          P: {Math.round(food.protein * food.quantity)}g • 
                          C: {Math.round(food.carbs * food.quantity)}g • 
                          F: {Math.round(food.fat * food.quantity)}g
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Notes */}
                {meal.notes && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes:
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {meal.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MealsList;