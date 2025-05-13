import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const MealPlanner = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [mealPlan, setMealPlan] = useState({});
  const [editingDay, setEditingDay] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const weekDays = [...Array(7)].map((_, i) => addDays(currentWeekStart, i));

  // Simulated meal plan data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate loading meal plan data for the selected week
    const demoMealPlan = {
      [format(weekDays[0], 'yyyy-MM-dd')]: {
        breakfast: 'Oatmeal with berries and honey',
        lunch: 'Grilled chicken salad with avocado',
        dinner: 'Baked salmon with roasted vegetables',
        snack: 'Greek yogurt with nuts'
      },
      [format(weekDays[1], 'yyyy-MM-dd')]: {
        breakfast: 'Scrambled eggs with spinach and whole grain toast',
        lunch: 'Quinoa bowl with mixed vegetables and tofu',
        dinner: 'Turkey chili with beans',
        snack: 'Apple with almond butter'
      }
      // Other days would be empty initially
    };
    
    setMealPlan(demoMealPlan);
  }, [currentWeekStart]);

  // Navigate to previous week
//   const goToPreviousWeek = () => {
//     setCurrentWeekStart(prevWeekStart => addDays(prevWeekStart, -7));
//     };
    const goToPreviousWeek = () => setCurrentWeekStart(prev => addDays(prev, -7));

  // Navigate to next week
//   const goToNextWeek = () => {
//     setCurrentWeekStart(prevWeekStart => addDays(prevWeekStart, 7));
//     };
    
    const goToNextWeek = () => setCurrentWeekStart(prev => addDays(prev, 7));

  // Start editing a specific meal
  const handleEditMeal = (day, meal) => {
    setEditingDay(day);
    setEditingMeal(meal);
    setEditText(mealPlan[day]?.[meal] || '');
  };

  // Save the edited meal
  const handleSaveMeal = () => {
    if (!editingDay || !editingMeal) return;
    
    setSaving(true);
    
    // Simulate API call to save the meal plan
    setTimeout(() => {
      try {
        // Update the meal plan
        setMealPlan(prev => ({
          ...prev,
          [editingDay]: {
            ...prev[editingDay],
            [editingMeal]: editText
          }
        }));
        
        setSuccess('Meal saved successfully!');
        setTimeout(() => setSuccess(null), 3000);
        
        // Reset editing state
        setEditingDay(null);
        setEditingMeal(null);
        setEditText('');
      } catch (err) {
        setError('Failed to save meal. Please try again.');
      } finally {
        setSaving(false);
      }
    }, 500);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingDay(null);
    setEditingMeal(null);
    setEditText('');
  };

  // Clear a meal
  const handleClearMeal = (day, meal) => {
    if (window.confirm('Are you sure you want to clear this meal?')) {
      // Update the meal plan
      setMealPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [meal]: ''
        }
      }));
    }
  };

  // Generate a meal plan using AI (simulated)
  const handleGenerateMealPlan = () => {
    setSaving(true);
    setError(null);
    
    // Simulate API call to generate a meal plan
    setTimeout(() => {
      try {
        // Example generated meal plan
        const generatedPlan = {};
        
        weekDays.forEach(day => {
          const dayStr = format(day, 'yyyy-MM-dd');
          generatedPlan[dayStr] = {
            breakfast: getRandomMeal('breakfast'),
            lunch: getRandomMeal('lunch'),
            dinner: getRandomMeal('dinner'),
            snack: getRandomMeal('snack')
          };
        });
        
        setMealPlan(generatedPlan);
        setSuccess('Meal plan generated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Failed to generate meal plan. Please try again.');
      } finally {
        setSaving(false);
      }
    }, 1500);
  };

  // Helper to get random meal suggestions (for demo purposes)
  const getRandomMeal = (mealType) => {
    const meals = {
      breakfast: [
        'Overnight oats with berries',
        'Avocado toast with poached eggs',
        'Greek yogurt parfait with granola',
        'Spinach and mushroom omelette',
        'Whole grain pancakes with fruit'
      ],
      lunch: [
        'Mediterranean quinoa salad',
        'Turkey and avocado wrap',
        'Lentil soup with whole grain bread',
        'Chicken Caesar salad',
        'Sushi bowl with brown rice'
      ],
      dinner: [
        'Baked salmon with roasted vegetables',
        'Chicken stir-fry with brown rice',
        'Vegetable lasagna',
        'Turkey meatballs with zucchini noodles',
        'Black bean and sweet potato tacos'
      ],
      snack: [
        'Apple with almond butter',
        'Greek yogurt with honey',
        'Hummus with vegetable sticks',
        'Trail mix with nuts and dried fruit',
        'Protein smoothie'
      ]
    };
    
    return meals[mealType][Math.floor(Math.random() * meals[mealType].length)];
  };

  return (
    <div className="space-y-6">
      <Card 
        title="Weekly Meal Planner"
        subtitle="Plan your meals for the week ahead"
      >
        {error && (
          <Alert 
            type="error" 
            message={error} 
            className="mb-4"
          />
        )}
        
        {success && (
          <Alert 
            type="success" 
            message={success} 
            className="mb-4"
          />
        )}
        
        {/* Week navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={goToPreviousWeek}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Previous Week
          </Button>
          
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
          </h3>
          
          <Button 
            variant="outline" 
            onClick={goToNextWeek}
          >
            Next Week
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
        
        {/* Generate meal plan button */}
        <div className="flex justify-end mb-6">
          <Button
            variant="primary"
            onClick={handleGenerateMealPlan}
            disabled={saving}
          >
            {saving ? 'Generating...' : 'Generate Meal Plan'}
          </Button>
        </div>
        
        {/* Meal editing form */}
        {editingDay && editingMeal && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
              Edit {editingMeal.charAt(0).toUpperCase() + editingMeal.slice(1)} for {format(new Date(editingDay), 'EEEE, MMM d')}
            </h3>
            
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows="3"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter meal details..."
            ></textarea>
            
            <div className="flex justify-end space-x-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveMeal}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        )}
        
        {/* Weekly meal plan grid */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">
                  Day
                </th>
                {mealTypes.map(type => (
                  <th key={type} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {weekDays.map(day => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const dayMeals = mealPlan[dayStr] || {};
                const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                
                return (
                  <tr key={dayStr} className={isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${isToday ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                          {format(day, 'EEEE')}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(day, 'MMM d')}
                        </span>
                      </div>
                    </td>
                    
                    {mealTypes.map(mealType => (
                      <td key={`${dayStr}-${mealType}`} className="px-6 py-4">
                        <div className="relative group">
                          {dayMeals[mealType] ? (
                            <div className="text-sm text-gray-900 dark:text-gray-200 min-h-[3rem]">
                              {dayMeals[mealType]}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400 dark:text-gray-500 italic min-h-[3rem]">
                              No meal planned
                            </div>
                          )}
                          
                          <div className="absolute inset-0 flex items-center justify-end opacity-0 group-hover:opacity-100 space-x-1">
                            <button
                              onClick={() => handleEditMeal(dayStr, mealType)}
                              className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            
                            {dayMeals[mealType] && (
                              <button
                                onClick={() => handleClearMeal(dayStr, mealType)}
                                className="p-1 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Meal Ideas section */}
      <Card title="Healthy Meal Ideas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h3 className="text-md font-medium text-yellow-800 dark:text-yellow-300 mb-2">Breakfast Ideas</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>Greek yogurt parfait with berries and granola</li>
              <li>Avocado toast with poached eggs</li>
              <li>Protein smoothie with spinach and banana</li>
              <li>Overnight oats with nuts and honey</li>
              <li>Vegetable omelette with whole grain toast</li>
            </ul>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-md font-medium text-green-800 dark:text-green-300 mb-2">Lunch Ideas</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>Quinoa bowl with roasted vegetables</li>
              <li>Turkey and avocado wrap with side salad</li>
              <li>Mediterranean chickpea salad</li>
              <li>Vegetable soup with whole grain bread</li>
              <li>Tuna salad on mixed greens</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-md font-medium text-purple-800 dark:text-purple-300 mb-2">Dinner Ideas</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>Grilled salmon with roasted brussels sprouts</li>
              <li>Cauliflower crust pizza with vegetables</li>
              <li>Turkey chili with black beans</li>
              <li>Baked chicken with sweet potatoes</li>
              <li>Stir-fried tofu with brown rice</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-md font-medium text-blue-800 dark:text-blue-300 mb-2">Snack Ideas</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>Apple slices with almond butter</li>
              <li>Hummus with carrot and celery sticks</li>
              <li>Hard-boiled eggs</li>
              <li>Trail mix with nuts and dried fruit</li>
              <li>Greek yogurt with a drizzle of honey</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MealPlanner;