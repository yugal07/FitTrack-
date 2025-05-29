import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useToast } from '../../contexts/ToastContext';
import { apiWithToast } from '../../utils/api';
import Button from '../ui/Button';

const ExerciseForm = ({ exercise = null, onSubmit, onCancel }) => {
  const [availableExercises, setAvailableExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get toast functions
  const toast = useToast();
  // Get toast-enabled API
  const api = apiWithToast(toast);

  // React Hook Form setup
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      exerciseId: '',
      exerciseName: '',
      sets: [{ weight: '', reps: '', duration: '', completed: true }],
    },
  });

  // Setup field array for dynamic sets
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sets',
  });

  // Watch values for validation
  const watchExerciseId = watch('exerciseId');
  const watchSets = watch('sets');

  // Load exercises from API
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/exercises');
        setAvailableExercises(response.data.data);
      } catch (err) {
        // Error is handled by the API interceptor
        console.error('Error fetching exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // If editing, load exercise data
  useEffect(() => {
    if (exercise) {
      setValue('exerciseId', exercise.exerciseId);

      // Set exercise name from the available exercises
      const selectedExercise = availableExercises.find(
        ex => ex._id === exercise.exerciseId
      );
      if (selectedExercise) {
        setValue('exerciseName', selectedExercise.name);
      }

      if (exercise.sets && exercise.sets.length > 0) {
        // Remove default set and add all exercise sets
        remove(0);
        exercise.sets.forEach(set => {
          append({
            weight: set.weight,
            reps: set.reps,
            duration: set.duration,
            completed: set.completed !== undefined ? set.completed : true,
          });
        });
      }
    }
  }, [exercise, availableExercises, setValue, append, remove]);

  const handleExerciseChange = e => {
    const value = e.target.value;
    const selectedExercise = availableExercises.find(ex => ex._id === value);
    if (selectedExercise) {
      setValue('exerciseId', value);
      setValue('exerciseName', selectedExercise.name);
    }
  };

  const handleAddSet = () => {
    append({ weight: '', reps: '', duration: '', completed: true });
  };

  // Prevent negative values in numeric inputs
  const handleNumericInput = e => {
    // Don't allow minus sign
    if (e.key === '-' || e.key === 'e') {
      e.preventDefault();
    }
  };

  const onFormSubmit = data => {
    // Validate that at least one set has reps or duration
    const validSets = data.sets.filter(set => {
      return set.reps || set.duration;
    });

    if (validSets.length === 0) {
      toast.error('Please add at least one set with reps or duration');
      return;
    }

    // Make sure all numeric values are non-negative
    const hasNegativeValues = data.sets.some(
      set =>
        (set.weight && parseFloat(set.weight) < 0) ||
        (set.reps && parseFloat(set.reps) < 0) ||
        (set.duration && parseFloat(set.duration) < 0)
    );

    if (hasNegativeValues) {
      toast.error('Weight, reps, and duration cannot be negative');
      return;
    }

    // Submit the valid data
    onSubmit({
      ...data,
      sets: validSets,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-6'>
        {/* Exercise Selection */}
        <div>
          <label
            htmlFor='exerciseId'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Exercise*
          </label>
          <div className='mt-1'>
            <select
              id='exerciseId'
              className={`block w-full rounded-md ${
                errors.exerciseId
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-700'
              } dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
              {...register('exerciseId', {
                required: 'Please select an exercise',
              })}
              onChange={handleExerciseChange}
            >
              <option value=''>Select an exercise</option>
              {availableExercises.map(exercise => (
                <option key={exercise._id} value={exercise._id}>
                  {exercise.name} ({exercise.muscleGroups.join(', ')})
                </option>
              ))}
            </select>
            {errors.exerciseId && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.exerciseId.message}
              </p>
            )}
          </div>
        </div>

        {/* Sets */}
        <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              Sets
            </h3>
            <Button
              type='button'
              variant='secondary'
              onClick={handleAddSet}
              size='sm'
            >
              Add Set
            </Button>
          </div>

          <div className='space-y-4'>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'
              >
                <div className='flex justify-between items-center mb-3'>
                  <h4 className='font-medium text-gray-900 dark:text-white'>
                    Set {index + 1}
                  </h4>
                  {fields.length > 1 && (
                    <button
                      type='button'
                      onClick={() => remove(index)}
                      className='text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm'
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <label
                      htmlFor={`sets.${index}.weight`}
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                    >
                      Weight (kg)
                    </label>
                    <input
                      type='number'
                      id={`sets.${index}.weight`}
                      className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                      placeholder='Optional'
                      min='0'
                      step='0.5'
                      onKeyDown={handleNumericInput}
                      {...register(`sets.${index}.weight`, {
                        min: { value: 0, message: 'Weight cannot be negative' },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.sets?.[index]?.weight && (
                      <p className='mt-1 text-xs text-red-600 dark:text-red-400'>
                        {errors.sets[index].weight.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`sets.${index}.reps`}
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                    >
                      Reps
                    </label>
                    <input
                      type='number'
                      id={`sets.${index}.reps`}
                      className={`mt-1 block w-full rounded-md ${
                        !watchSets[index]?.reps && !watchSets[index]?.duration
                          ? 'border-amber-300 dark:border-amber-700'
                          : 'border-gray-300 dark:border-gray-700'
                      } dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      placeholder='Enter reps'
                      min='0'
                      onKeyDown={handleNumericInput}
                      {...register(`sets.${index}.reps`, {
                        min: { value: 0, message: 'Reps cannot be negative' },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.sets?.[index]?.reps && (
                      <p className='mt-1 text-xs text-red-600 dark:text-red-400'>
                        {errors.sets[index].reps.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`sets.${index}.duration`}
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                    >
                      Duration (seconds)
                    </label>
                    <input
                      type='number'
                      id={`sets.${index}.duration`}
                      className={`mt-1 block w-full rounded-md ${
                        !watchSets[index]?.reps && !watchSets[index]?.duration
                          ? 'border-amber-300 dark:border-amber-700'
                          : 'border-gray-300 dark:border-gray-700'
                      } dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      placeholder='Enter duration'
                      min='0'
                      onKeyDown={handleNumericInput}
                      {...register(`sets.${index}.duration`, {
                        min: {
                          value: 0,
                          message: 'Duration cannot be negative',
                        },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.sets?.[index]?.duration && (
                      <p className='mt-1 text-xs text-red-600 dark:text-red-400'>
                        {errors.sets[index].duration.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Completed checkbox */}
                <div className='mt-4'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      className='rounded border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800'
                      {...register(`sets.${index}.completed`)}
                    />
                    <span className='ml-2 text-sm text-gray-700 dark:text-gray-300'>
                      Completed
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Validation message for sets */}
          {watchSets.every(set => !set.reps && !set.duration) && (
            <p className='mt-2 text-sm text-amber-600 dark:text-amber-400'>
              Please add reps or duration for at least one set
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className='flex justify-end space-x-3'>
          <Button type='button' variant='secondary' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' variant='primary'>
            {exercise ? 'Update Exercise' : 'Add Exercise'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExerciseForm;
