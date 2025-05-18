import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const DailyIntakeForm = ({ nutritionLogId, onMealAdded }) => {
  const initialFormState = {
    type: 'breakfast',
    time: new Date().toISOString().substr(0, 16),
    foods: [
      {
        name: '',
        quantity: 1,
        unit: 'serving',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
    ],
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [presets, setPresets] = useState({});
  const [showPresets, setShowPresets] = useState(false);

  // Common food presets for quick selection
  const foodPresets = {
    breakfast: [
      { name: 'Eggs (Large)', quantity: 2, unit: 'piece', calories: 140, protein: 12, carbs: 0, fat: 10 },
      { name: 'Whole Wheat Bread', quantity: 2, unit: 'slice', calories: 160, protein: 8, carbs: 30, fat: 2 },
      { name: 'Avocado', quantity: 0.5, unit: 'piece', calories: 120, protein: 1.5, carbs: 6, fat: 10 },
      { name: 'Greek Yogurt', quantity: 1, unit: 'cup', calories: 130, protein: 22, carbs: 8, fat: 0 },
      { name: 'Banana', quantity: 1, unit: 'piece', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
      { name: 'Oatmeal', quantity: 1, unit: 'cup', calories: 150, protein: 5, carbs: 27, fat: 3 }
    ],
    lunch: [
      { name: 'Grilled Chicken Breast', quantity: 150, unit: 'g', calories: 240, protein: 45, carbs: 0, fat: 5 },
      { name: 'Brown Rice', quantity: 1, unit: 'cup', calories: 215, protein: 5, carbs: 45, fat: 1.8 },
      { name: 'Quinoa', quantity: 1, unit: 'cup', calories: 220, protein: 8, carbs: 39, fat: 3.5 },
      { name: 'Mixed Salad', quantity: 2, unit: 'cup', calories: 30, protein: 2, carbs: 6, fat: 0 },
      { name: 'Olive Oil', quantity: 1, unit: 'tbsp', calories: 120, protein: 0, carbs: 0, fat: 14 }
    ],
    dinner: [
      { name: 'Salmon Fillet', quantity: 150, unit: 'g', calories: 280, protein: 39, carbs: 0, fat: 13 },
      { name: 'Sweet Potato', quantity: 1, unit: 'medium', calories: 115, protein: 2, carbs: 27, fat: 0 },
      { name: 'Broccoli', quantity: 1, unit: 'cup', calories: 55, protein: 3.7, carbs: 11, fat: 0.5 },
      { name: 'Pasta (Whole Wheat)', quantity: 1, unit: 'cup', calories: 180, protein: 7, carbs: 37, fat: 1 },
      { name: 'Ground Turkey', quantity: 100, unit: 'g', calories: 170, protein: 22, carbs: 0, fat: 9 }
    ],
    snack: [
      { name: 'Almonds', quantity: 30, unit: 'g', calories: 170, protein: 6, carbs: 6, fat: 15 },
      { name: 'Apple', quantity: 1, unit: 'medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
      { name: 'Protein Bar', quantity: 1, unit: 'piece', calories: 200, protein: 20, carbs: 20, fat: 5 },
      { name: 'String Cheese', quantity: 1, unit: 'piece', calories: 80, protein: 8, carbs: 1, fat: 5 },
      { name: 'Hummus', quantity: 2, unit: 'tbsp', calories: 50, protein: 2, carbs: 4, fat: 3 }
    ]
  };

  // Set relevant presets based on meal type
  useEffect(() => {
    setPresets(foodPresets[formData.type] || []);
  }, [formData.type]);

  // Handle meal type change
  const handleTypeChange = (e) => {
    setFormData({
      ...formData,
      type: e.target.value
    });
    setPresets(foodPresets[e.target.value] || []);
  };

  // Handle time change
  const handleTimeChange = (e) => {
    setFormData({
      ...formData,
      time: e.target.value
    });
  };

  // Handle notes change
  const handleNotesChange = (e) => {
    setFormData({
      ...formData,
      notes: e.target.value
    });
  };

  // Handle food item change
  const handleFoodChange = (index, field, value) => {
    const updatedFoods = [...formData.foods];
    updatedFoods[index] = {
      ...updatedFoods[index],
      [field]: field === 'name' ? value : Number(value)
    };
    
    setFormData({
      ...formData,
      foods: updatedFoods
    });
  };

  // Add food item
  const handleAddFood = () => {
    setFormData({
      ...formData,
      foods: [
        ...formData.foods,
        {
          name: '',
          quantity: 1,
          unit: 'serving',
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        }
      ]
    });
  };

  // Remove food item
  const handleRemoveFood = (index) => {
    if (formData.foods.length === 1) return;
    
    const updatedFoods = formData.foods.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      foods: updatedFoods
    });
  };

  // Add preset food
  const handleAddPreset = (preset) => {
    setFormData({
      ...formData,
      foods: [...formData.foods, { ...preset }]
    });
    setShowPresets(false);
  };

  // Calculate total calories and macros
  const calculateTotals = () => {
    return formData.foods.reduce((totals, food) => {
      return {
        calories: totals.calories + (food.calories * food.quantity),
        protein: totals.protein + (food.protein * food.quantity),
        carbs: totals.carbs + (food.carbs * food.quantity),
        fat: totals.fat + (food.fat * food.quantity)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate form data
      if (!formData.type) {
        throw new Error('Meal type is required');
      }
      
      if (formData.foods.some(food => !food.name.trim())) {
        throw new Error('All food items must have a name');
      }
      
      if (formData.foods.some(food => food.calories < 0)) {
        throw new Error('Calories cannot be negative');
      }
      
      // Submit to API
      const response = await api.post(`api/nutrition/logs/${nutritionLogId}/meals`, formData);
      
      setSuccess('Meal added successfully!');
      setFormData(initialFormState);
      
      // Pass updated log back to parent
      setTimeout(() => {
        setSuccess(null);
        if (onMealAdded) onMealAdded(response.data.nutritionLog);
      }, 1500);
    } catch (err) {
      console.error('Error adding meal:', err);
      setError(err.response?.data?.error?.message || err.message || 'Failed to add meal');
    } finally {
      setLoading(false);
    }
  };

  // Get meal type icon
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
        return null;
    }
  };

  // Get background color for meal type
  const getMealTypeStyle = (type) => {
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

  const totals = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meal Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Meal Type
          </label>
          <div className="relative">
            <select
              value={formData.type}
              onChange={handleTypeChange}
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              {getMealIcon(formData.type)}
            </div>
          </div>
        </div>
        
        {/* Meal Time */}
        <Input
          type="datetime-local"
          label="Time"
          value={formData.time}
          onChange={handleTimeChange}
          required
        />
      </div>
      
      {/* Summary Card */}
      <div className={`p-3 rounded-lg border ${getMealTypeStyle(formData.type)}`}>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meal Summary</h4>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">Calories</div>
            <div className="font-medium text-gray-900 dark:text-white">{Math.round(totals.calories)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">Protein</div>
            <div className="font-medium text-blue-600 dark:text-blue-400">{Math.round(totals.protein)}g</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">Carbs</div>
            <div className="font-medium text-yellow-600 dark:text-yellow-400">{Math.round(totals.carbs)}g</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">Fat</div>
            <div className="font-medium text-red-600 dark:text-red-400">{Math.round(totals.fat)}g</div>
          </div>
        </div>
      </div>
      
      {/* Food Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Food Items</h4>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPresets(!showPresets)}
            >
              {showPresets ? 'Hide Presets' : 'Show Presets'}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAddFood}
            >
              Add Food
            </Button>
          </div>
        </div>
        
        {/* Food Presets */}
        {showPresets && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Common {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Foods</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {presets.map((preset, idx) => (
                <div 
                  key={idx} 
                  className="p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleAddPreset(preset)}
                >
                  <div className="font-medium text-gray-900 dark:text-white">{preset.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {preset.calories} cal • {preset.protein}g protein • {preset.carbs}g carbs • {preset.fat}g fat
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {formData.foods.map((food, index) => (
          <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md space-y-3 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Food Item {index + 1}</h5>
              {formData.foods.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFood(index)}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Food Name"
                value={food.name}
                onChange={(e) => handleFoodChange(index, 'name', e.target.value)}
                required
              />
              
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  label="Quantity"
                  value={food.quantity}
                  onChange={(e) => handleFoodChange(index, 'quantity', e.target.value)}
                  min="0.1"
                  step="0.1"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit
                  </label>
                  <select
                    value={food.unit}
                    onChange={(e) => handleFoodChange(index, 'unit', e.target.value)}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="g">g</option>
                    <option value="oz">oz</option>
                    <option value="ml">ml</option>
                    <option value="cup">cup</option>
                    <option value="tbsp">tbsp</option>
                    <option value="tsp">tsp</option>
                    <option value="piece">piece</option>
                    <option value="serving">serving</option>
                    <option value="medium">medium</option>
                    <option value="large">large</option>
                    <option value="small">small</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Input
                type="number"
                label="Calories"
                value={food.calories}
                onChange={(e) => handleFoodChange(index, 'calories', e.target.value)}
                min="0"
                required
              />
              
              <Input
                type="number"
                label="Protein (g)"
                value={food.protein}
                onChange={(e) => handleFoodChange(index, 'protein', e.target.value)}
                min="0"
                step="0.1"
              />
              
              <Input
                type="number"
                label="Carbs (g)"
                value={food.carbs}
                onChange={(e) => handleFoodChange(index, 'carbs', e.target.value)}
                min="0"
                step="0.1"
              />
              
              <Input
                type="number"
                label="Fat (g)"
                value={food.fat}
                onChange={(e) => handleFoodChange(index, 'fat', e.target.value)}
                min="0"
                step="0.1"
              />
            </div>

            {/* Per item total */}
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              Item total: {Math.round(food.calories * food.quantity)} calories
            </div>
          </div>
        ))}
      </div>
      
      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={handleNotesChange}
          rows="2"
          className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Add any notes about this meal..."
        />
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Meal'}
        </Button>
      </div>
    </form>
  );
};

export default DailyIntakeForm;