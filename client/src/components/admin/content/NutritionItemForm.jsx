import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const NutritionItemForm = ({ item, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // React Hook Form setup
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm({
    defaultValues: {
      name: '',
      category: 'protein',
      servingSize: 100,
      servingUnit: 'g',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  });
  
  // Initialize form data when editing an existing item
  useEffect(() => {
    if (item) {
      reset({
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
  }, [item, reset]);
  
  const onFormSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Convert numeric string values to numbers
      const formattedData = {
        ...data,
        servingSize: parseFloat(data.servingSize),
        calories: parseFloat(data.calories),
        protein: parseFloat(data.protein),
        carbs: parseFloat(data.carbs),
        fat: parseFloat(data.fat)
      };
      
      await onSubmit(formattedData);
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
    <form onSubmit={handleSubmit(onFormSubmit)} className="p-6">
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
              id="name"
              className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.name ? 'border-red-300 dark:border-red-700' : ''}`}
              {...register('name', {
                required: 'Food name is required',
                validate: value => value.trim() !== '' || 'Food name cannot be empty'
              })}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
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
                className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                {...register('category', {
                  required: 'Category is required'
                })}
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
                className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                {...register('servingUnit', {
                  required: 'Serving unit is required'
                })}
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
              id="servingSize"
              min="0.1"
              step="0.1"
              className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.servingSize ? 'border-red-300 dark:border-red-700' : ''}`}
              {...register('servingSize', {
                required: 'Serving size is required',
                min: {
                  value: 0.1,
                  message: 'Serving size must be greater than 0'
                },
                valueAsNumber: true
              })}
            />
          </div>
          {errors.servingSize && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.servingSize.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Amount in {unitOptions.find(unit => unit.value === watch('servingUnit'))?.label || 'selected unit'}
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
              id="calories"
              min="0"
              step="1"
              className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.calories ? 'border-red-300 dark:border-red-700' : ''}`}
              {...register('calories', {
                required: 'Calories are required',
                min: {
                  value: 0,
                  message: 'Calories cannot be negative'
                },
                valueAsNumber: true
              })}
            />
          </div>
          {errors.calories && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.calories.message}</p>
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
                id="protein"
                min="0"
                step="0.1"
                className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.protein ? 'border-red-300 dark:border-red-700' : ''}`}
                {...register('protein', {
                  required: 'Protein content is required',
                  min: {
                    value: 0,
                    message: 'Protein cannot be negative'
                  },
                  valueAsNumber: true
                })}
              />
            </div>
            {errors.protein && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.protein.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Carbs (g) <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="carbs"
                min="0"
                step="0.1"
                className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.carbs ? 'border-red-300 dark:border-red-700' : ''}`}
                {...register('carbs', {
                  required: 'Carbs content is required',
                  min: {
                    value: 0,
                    message: 'Carbs cannot be negative'
                  },
                  valueAsNumber: true
                })}
              />
            </div>
            {errors.carbs && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.carbs.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="fat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fat (g) <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="fat"
                min="0"
                step="0.1"
                className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.fat ? 'border-red-300 dark:border-red-700' : ''}`}
                {...register('fat', {
                  required: 'Fat content is required',
                  min: {
                    value: 0,
                    message: 'Fat cannot be negative'
                  },
                  valueAsNumber: true
                })}
              />
            </div>
            {errors.fat && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fat.message}</p>
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