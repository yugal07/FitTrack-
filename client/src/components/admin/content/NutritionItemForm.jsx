import { useState, useEffect } from 'react';

const NutritionItemForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'protein',
    servingSize: 100,
    servingUnit: 'g',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form data when editing an existing item
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || 'protein',
        servingSize: item.servingSize || 100,
        servingUnit: item.servingUnit || 'g',
        calories: item.calories || 0,
        protein: item.protein || 0,
        carbs: item.carbs || 0,
        fat: item.fat || 0
      });
    }
  }, [item]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'servingSize' || name === 'calories' || name === 'protein' || name === 'carbs' || name === 'fat'
        ? parseFloat(value) || 0
        : value
    }));
    
    // Clear validation error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required validations
    if (!formData.name.trim()) {
      newErrors.name = 'Food name is required';
    }
    
    if (formData.servingSize <= 0) {
      newErrors.servingSize = 'Serving size must be greater than 0';
    }
    
    if (formData.calories < 0) {
      newErrors.calories = 'Calories cannot be negative';
    }
    
    if (formData.protein < 0) {
      newErrors.protein = 'Protein cannot be negative';
    }
    
    if (formData.carbs < 0) {
      newErrors.carbs = 'Carbs cannot be negative';
    }
    
    if (formData.fat < 0) {
      newErrors.fat = 'Fat cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const categoryOptions = [
    { value: 'protein', label: 'Protein' },
    { value: 'carbs', label: 'Carbs' },
    { value: 'fat', label: 'Fat' },
    { value: 'fruit', label: 'Fruit' },
    { value: 'vegetable', label: 'Vegetable' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'other', label: 'Other' }
  ];
  
  const unitOptions = [
    { value: 'g', label: 'grams (g)' },
    { value: 'ml', label: 'milliliters (ml)' },
    { value: 'oz', label: 'ounces (oz)' },
    { value: 'cup', label: 'cup' },
    { value: 'tbsp', label: 'tablespoon (tbsp)' },
    { value: 'tsp', label: 'teaspoon (tsp)' },
    { value: 'piece', label: 'piece' }
  ];
  
  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {item ? 'Edit Nutrition Item' : 'Add New Nutrition Item'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {item ? 'Update nutrition item information' : 'Create a new nutrition item in the database'}
          </p>
        </div>
        
        {/* Food Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Food Name <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.name ? 'border-red-300 dark:border-red-700' : ''}`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>
        
        {/* Category and Units */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="servingUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Serving Unit <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <select
                id="servingUnit"
                name="servingUnit"
                value={formData.servingUnit}
                onChange={handleChange}
                className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              >
                {unitOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Serving Size */}
        <div>
          <label htmlFor="servingSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Serving Size <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="servingSize"
              id="servingSize"
              min="0.1"
              step="0.1"
              value={formData.servingSize}
              onChange={handleChange}
              className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.servingSize ? 'border-red-300 dark:border-red-700' : ''}`}
            />
          </div>
          {errors.servingSize && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.servingSize}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Amount in {formData.servingUnit}
          </p>
        </div>
        
        {/* Calories */}
        <div>
          <label htmlFor="calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Calories <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="calories"
              id="calories"
              min="0"
              step="1"
              value={formData.calories}
              onChange={handleChange}
              className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.calories ? 'border-red-300 dark:border-red-700' : ''}`}
            />
          </div>
          {errors.calories && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.calories}</p>
          )}
        </div>
        
        {/* Macronutrients */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="protein" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Protein (g) <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="protein"
                id="protein"
                min="0"
                step="0.1"
                value={formData.protein}
                onChange={handleChange}
                className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.protein ? 'border-red-300 dark:border-red-700' : ''}`}
              />
            </div>
            {errors.protein && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.protein}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Carbs (g) <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="carbs"
                id="carbs"
                min="0"
                step="0.1"
                value={formData.carbs}
                onChange={handleChange}
                className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.carbs ? 'border-red-300 dark:border-red-700' : ''}`}
              />
            </div>
            {errors.carbs && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.carbs}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="fat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fat (g) <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="fat"
                id="fat"
                min="0"
                step="0.1"
                value={formData.fat}
                onChange={handleChange}
                className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.fat ? 'border-red-300 dark:border-red-700' : ''}`}
              />
            </div>
            {errors.fat && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fat}</p>
            )}
          </div>
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : item ? 'Update Nutrition Item' : 'Create Nutrition Item'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default NutritionItemForm;