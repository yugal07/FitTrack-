import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useToast } from '../../contexts/ToastContext';
import { apiWithToast } from '../../utils/api';

import Button from '../ui/Button';

const getCurrentLocalDateTimeString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const DailyIntakeForm = ({ nutritionLogId, onMealAdded, onCancel }) => {
  const initialFormState = {
    type: 'breakfast',
    time: getCurrentLocalDateTimeString(),
    foods: [
      {
        name: '',
        quantity: 1,
        unit: 'serving',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    ],
    notes: '',
  };

  // State hooks
  const [loading, setLoading] = useState(false);
  const [presets, setPresets] = useState([]);
  const [showPresets, setShowPresets] = useState(false);

  // Get toast functions
  const toast = useToast();
  // Get toast-enabled API
  const api = apiWithToast(toast);

  // Common food presets for quick selection
  const foodPresets = {
    breakfast: [
      {
        name: 'Eggs (Large)',
        quantity: 2,
        unit: 'piece',
        calories: 140,
        protein: 12,
        carbs: 0,
        fat: 10,
      },
      {
        name: 'Whole Wheat Bread',
        quantity: 2,
        unit: 'slice',
        calories: 160,
        protein: 8,
        carbs: 30,
        fat: 2,
      },
      {
        name: 'Avocado',
        quantity: 0.5,
        unit: 'piece',
        calories: 120,
        protein: 1.5,
        carbs: 6,
        fat: 10,
      },
      {
        name: 'Greek Yogurt',
        quantity: 1,
        unit: 'cup',
        calories: 130,
        protein: 22,
        carbs: 8,
        fat: 0,
      },
      {
        name: 'Banana',
        quantity: 1,
        unit: 'piece',
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
      },
      {
        name: 'Oatmeal',
        quantity: 1,
        unit: 'cup',
        calories: 150,
        protein: 5,
        carbs: 27,
        fat: 3,
      },
    ],
    lunch: [
      {
        name: 'Grilled Chicken Breast',
        quantity: 150,
        unit: 'g',
        calories: 240,
        protein: 45,
        carbs: 0,
        fat: 5,
      },
      {
        name: 'Brown Rice',
        quantity: 1,
        unit: 'cup',
        calories: 215,
        protein: 5,
        carbs: 45,
        fat: 1.8,
      },
      {
        name: 'Quinoa',
        quantity: 1,
        unit: 'cup',
        calories: 220,
        protein: 8,
        carbs: 39,
        fat: 3.5,
      },
      {
        name: 'Mixed Salad',
        quantity: 2,
        unit: 'cup',
        calories: 30,
        protein: 2,
        carbs: 6,
        fat: 0,
      },
      {
        name: 'Olive Oil',
        quantity: 1,
        unit: 'tbsp',
        calories: 120,
        protein: 0,
        carbs: 0,
        fat: 14,
      },
    ],
    dinner: [
      {
        name: 'Salmon Fillet',
        quantity: 150,
        unit: 'g',
        calories: 280,
        protein: 39,
        carbs: 0,
        fat: 13,
      },
      {
        name: 'Sweet Potato',
        quantity: 1,
        unit: 'medium',
        calories: 115,
        protein: 2,
        carbs: 27,
        fat: 0,
      },
      {
        name: 'Broccoli',
        quantity: 1,
        unit: 'cup',
        calories: 55,
        protein: 3.7,
        carbs: 11,
        fat: 0.5,
      },
      {
        name: 'Pasta (Whole Wheat)',
        quantity: 1,
        unit: 'cup',
        calories: 180,
        protein: 7,
        carbs: 37,
        fat: 1,
      },
      {
        name: 'Ground Turkey',
        quantity: 100,
        unit: 'g',
        calories: 170,
        protein: 22,
        carbs: 0,
        fat: 9,
      },
    ],
    snack: [
      {
        name: 'Almonds',
        quantity: 30,
        unit: 'g',
        calories: 170,
        protein: 6,
        carbs: 6,
        fat: 15,
      },
      {
        name: 'Apple',
        quantity: 1,
        unit: 'medium',
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
      },
      {
        name: 'Protein Bar',
        quantity: 1,
        unit: 'piece',
        calories: 200,
        protein: 20,
        carbs: 20,
        fat: 5,
      },
      {
        name: 'String Cheese',
        quantity: 1,
        unit: 'piece',
        calories: 80,
        protein: 8,
        carbs: 1,
        fat: 5,
      },
      {
        name: 'Hummus',
        quantity: 2,
        unit: 'tbsp',
        calories: 50,
        protein: 2,
        carbs: 4,
        fat: 3,
      },
    ],
  };

  // React Hook Form setup
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialFormState,
  });

  // Field array for food items
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'foods',
  });

  // Watch the meal type to update presets
  const mealType = watch('type');

  // Update presets when meal type changes
  useEffect(() => {
    setPresets(foodPresets[mealType] || []);
  }, [mealType]);

  // Add preset food
  const handleAddPreset = preset => {
    append({ ...preset });
    setShowPresets(false);
  };

  // Calculate total calories and macros
  const calculateTotals = () => {
    const foods = watch('foods');
    return foods.reduce(
      (totals, food) => {
        return {
          calories:
            totals.calories +
            parseFloat(food.calories || 0) * parseFloat(food.quantity || 0),
          protein:
            totals.protein +
            parseFloat(food.protein || 0) * parseFloat(food.quantity || 0),
          carbs:
            totals.carbs +
            parseFloat(food.carbs || 0) * parseFloat(food.quantity || 0),
          fat:
            totals.fat +
            parseFloat(food.fat || 0) * parseFloat(food.quantity || 0),
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  // Submit form
  const onSubmit = async data => {
    setLoading(true);

    try {
      // Submit to API
      const response = await api.post(
        `api/nutrition/logs/${nutritionLogId}/meals`,
        data
      );

      toast.success('Meal added successfully!');
      reset(initialFormState);

      // Call the callback function
      if (onMealAdded) onMealAdded(response.data.nutritionLog);
    } catch (err) {
      // Error is handled by the API interceptor
      console.error('Error adding meal:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get meal type icon
  const getMealIcon = type => {
    switch (type) {
      case 'breakfast':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
            />
          </svg>
        );
      case 'lunch':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
      case 'dinner':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
            />
          </svg>
        );
      case 'snack':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Get background color for meal type
  const getMealTypeStyle = type => {
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
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Meal Type */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Meal Type
          </label>
          <div className='relative'>
            <select
              {...register('type', { required: 'Meal type is required' })}
              className={`block w-full rounded-md shadow-sm sm:text-sm ${
                errors.type
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
              } dark:bg-gray-800`}
            >
              <option value='breakfast'>Breakfast</option>
              <option value='lunch'>Lunch</option>
              <option value='dinner'>Dinner</option>
              <option value='snack'>Snack</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300'>
              {getMealIcon(mealType)}
            </div>
          </div>
          {errors.type && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.type.message}
            </p>
          )}
        </div>

        {/* Meal Time */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Time
          </label>
          <input
            type='datetime-local'
            {...register('time', {
              required: 'Time is required',
              validate: value => {
                const mealTime = new Date(value);
                const now = new Date();
                return mealTime <= now || 'Meal time cannot be in the future';
              },
            })}
            className={`block w-full rounded-md shadow-sm sm:text-sm ${
              errors.time
                ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
            } dark:bg-gray-800`}
          />
          {errors.time && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.time.message}
            </p>
          )}
        </div>
      </div>

      {/* Summary Card */}
      <div className={`p-3 rounded-lg border ${getMealTypeStyle(mealType)}`}>
        <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          Meal Summary
        </h4>
        <div className='grid grid-cols-4 gap-2'>
          <div className='text-center'>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              Calories
            </div>
            <div className='font-medium text-gray-900 dark:text-white'>
              {Math.round(totals.calories)}
            </div>
          </div>
          <div className='text-center'>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              Protein
            </div>
            <div className='font-medium text-blue-600 dark:text-blue-400'>
              {Math.round(totals.protein)}g
            </div>
          </div>
          <div className='text-center'>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              Carbs
            </div>
            <div className='font-medium text-yellow-600 dark:text-yellow-400'>
              {Math.round(totals.carbs)}g
            </div>
          </div>
          <div className='text-center'>
            <div className='text-xs text-gray-500 dark:text-gray-400'>Fat</div>
            <div className='font-medium text-red-600 dark:text-red-400'>
              {Math.round(totals.fat)}g
            </div>
          </div>
        </div>
      </div>

      {/* Food Items */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h4 className='text-md font-medium text-gray-800 dark:text-gray-200'>
            Food Items
          </h4>
          <div className='flex space-x-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => setShowPresets(!showPresets)}
            >
              {showPresets ? 'Hide Presets' : 'Show Presets'}
            </Button>
            <Button
              type='button'
              variant='primary'
              size='sm'
              onClick={() =>
                append({
                  name: '',
                  quantity: 1,
                  unit: 'serving',
                  calories: 0,
                  protein: 0,
                  carbs: 0,
                  fat: 0,
                })
              }
            >
              Add Food
            </Button>
          </div>
        </div>

        {/* Food Presets */}
        {showPresets && (
          <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4'>
            <h5 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
              Common {mealType.charAt(0).toUpperCase() + mealType.slice(1)}{' '}
              Foods
            </h5>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'>
              {presets.map((preset, idx) => (
                <div
                  key={idx}
                  className='p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                  onClick={() => handleAddPreset(preset)}
                >
                  <div className='font-medium text-gray-900 dark:text-white'>
                    {preset.name}
                  </div>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>
                    {preset.calories} cal • {preset.protein}g protein •{' '}
                    {preset.carbs}g carbs • {preset.fat}g fat
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className='p-4 border border-gray-200 dark:border-gray-700 rounded-md space-y-3 bg-white dark:bg-gray-800 shadow-sm'
          >
            <div className='flex justify-between'>
              <h5 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Food Item {index + 1}
              </h5>
              {fields.length > 1 && (
                <button
                  type='button'
                  onClick={() => remove(index)}
                  className='text-red-500 hover:text-red-700 text-sm flex items-center'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-1'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Remove
                </button>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Food Name
                </label>
                <input
                  type='text'
                  {...register(`foods.${index}.name`, {
                    required: 'Food name is required',
                    validate: value =>
                      value.trim() !== '' || 'Food name cannot be empty',
                  })}
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.foods?.[index]?.name
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
                  } dark:bg-gray-800`}
                />
                {errors.foods?.[index]?.name && (
                  <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                    {errors.foods[index].name.message}
                  </p>
                )}
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Quantity
                  </label>
                  <input
                    type='number'
                    {...register(`foods.${index}.quantity`, {
                      required: 'Quantity is required',
                      min: { value: 0.1, message: 'Quantity must be positive' },
                      valueAsNumber: true,
                    })}
                    min='0.1'
                    step='0.1'
                    className={`block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.foods?.[index]?.quantity
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
                    } dark:bg-gray-800`}
                  />
                  {errors.foods?.[index]?.quantity && (
                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                      {errors.foods[index].quantity.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Unit
                  </label>
                  <select
                    {...register(`foods.${index}.unit`, {
                      required: 'Unit is required',
                    })}
                    className='block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  >
                    <option value='g'>g</option>
                    <option value='oz'>oz</option>
                    <option value='ml'>ml</option>
                    <option value='cup'>cup</option>
                    <option value='tbsp'>tbsp</option>
                    <option value='tsp'>tsp</option>
                    <option value='piece'>piece</option>
                    <option value='serving'>serving</option>
                    <option value='medium'>medium</option>
                    <option value='large'>large</option>
                    <option value='small'>small</option>
                  </select>
                  {errors.foods?.[index]?.unit && (
                    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                      {errors.foods[index].unit.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Calories
                </label>
                <input
                  type='number'
                  {...register(`foods.${index}.calories`, {
                    required: 'Calories are required',
                    min: { value: 0, message: 'Cannot be negative' },
                    valueAsNumber: true,
                  })}
                  min='0'
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.foods?.[index]?.calories
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
                  } dark:bg-gray-800`}
                />
                {errors.foods?.[index]?.calories && (
                  <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                    {errors.foods[index].calories.message}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Protein (g)
                </label>
                <input
                  type='number'
                  {...register(`foods.${index}.protein`, {
                    min: { value: 0, message: 'Cannot be negative' },
                    valueAsNumber: true,
                  })}
                  min='0'
                  step='0.1'
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.foods?.[index]?.protein
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
                  } dark:bg-gray-800`}
                />
                {errors.foods?.[index]?.protein && (
                  <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                    {errors.foods[index].protein.message}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Carbs (g)
                </label>
                <input
                  type='number'
                  {...register(`foods.${index}.carbs`, {
                    min: { value: 0, message: 'Cannot be negative' },
                    valueAsNumber: true,
                  })}
                  min='0'
                  step='0.1'
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.foods?.[index]?.carbs
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
                  } dark:bg-gray-800`}
                />
                {errors.foods?.[index]?.carbs && (
                  <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                    {errors.foods[index].carbs.message}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Fat (g)
                </label>
                <input
                  type='number'
                  {...register(`foods.${index}.fat`, {
                    min: { value: 0, message: 'Cannot be negative' },
                    valueAsNumber: true,
                  })}
                  min='0'
                  step='0.1'
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.foods?.[index]?.fat
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
                  } dark:bg-gray-800`}
                />
                {errors.foods?.[index]?.fat && (
                  <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                    {errors.foods[index].fat.message}
                  </p>
                )}
              </div>
            </div>

            {/* Per item total */}
            <div className='text-right text-sm text-gray-500 dark:text-gray-400'>
              Item total:{' '}
              {Math.round(
                (watch(`foods.${index}.calories`) || 0) *
                  (watch(`foods.${index}.quantity`) || 0)
              )}{' '}
              calories
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div>
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
          Notes (Optional)
        </label>
        <textarea
          {...register('notes')}
          rows='2'
          className='block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          placeholder='Add any notes about this meal...'
        />
      </div>

      {/* Submit and Cancel Buttons */}
      <div className='flex justify-end gap-2'>
        <Button type='submit' variant='primary' disabled={loading}>
          {loading ? 'Adding...' : 'Add Meal'}
        </Button>
        {onCancel && (
          <Button
            type='button'
            variant='secondary'
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default DailyIntakeForm;
