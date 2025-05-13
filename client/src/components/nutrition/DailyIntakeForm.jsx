import { useState } from 'react';
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

  // Handle meal type change
  const handleTypeChange = (e) => {
    setFormData({
      ...formData,
      type: e.target.value
    });
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
      
      {/* Food Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Food Items</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddFood}
          >
            Add Food
          </Button>
        </div>
        
        {formData.foods.map((food, index) => (
          <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-md space-y-3">
            <div className="flex justify-between">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Item {index + 1}</h5>
              {formData.foods.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFood(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
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