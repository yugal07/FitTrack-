import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '../../contexts/ToastContext';
import { apiWithToast } from '../../utils/api';
import Button from '../ui/Button';

const GoalWizard = ({ onClose, onGoalCreated }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get toast functions
  const toast = useToast();
  // Get toast-enabled API
  const api = apiWithToast(toast);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: '',
      targetValue: '',
      currentValue: '',
      unit: '',
      targetDate: '',
      status: 'active',
    },
    mode: 'onChange',
  });

  // Watch form values for conditional logic
  const watchType = watch('type');
  const watchTargetValue = watch('targetValue');
  const watchCurrentValue = watch('currentValue');
  const watchTargetDate = watch('targetDate');

  // Set default units based on goal type
  useEffect(() => {
    if (watchType) {
      let defaultUnit = '';

      switch (watchType) {
        case 'weight':
          defaultUnit = 'kg';
          break;
        case 'strength':
          defaultUnit = 'lbs';
          break;
        case 'endurance':
          defaultUnit = 'min';
          break;
        case 'habit':
          defaultUnit = 'sessions';
          break;
        case 'nutrition':
          defaultUnit = 'calories';
          break;
        case 'custom':
          defaultUnit = '';
          break;
        default:
          defaultUnit = '';
      }

      setValue('unit', defaultUnit);
    }
  }, [watchType, setValue]);

  const nextStep = async () => {
    // Validate current step
    let isValid = false;

    if (step === 1) {
      isValid = await trigger('type');
      if (!isValid) {
        toast.error('Please select a goal type');
        return;
      }
    } else if (step === 2) {
      isValid = await trigger(['targetValue', 'unit', 'currentValue']);
      if (!isValid) {
        // Error messages will be displayed by the form
        return;
      }
    }

    setStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const onFormSubmit = async data => {
    try {
      setLoading(true);

      // Process data for submission
      const goalData = {
        ...data,
        targetValue: parseFloat(data.targetValue),
        currentValue: data.currentValue ? parseFloat(data.currentValue) : 0,
      };

      await api.post('/api/goals', goalData);

      // Success
      onGoalCreated();
    } catch (err) {
      // Error is handled by API interceptor
      console.error('Error creating goal:', err);
    } finally {
      setLoading(false);
    }
  };

  // Select goal type component (Step 1)
  const renderTypeSelection = () => (
    <div className='space-y-6'>
      <div className='text-center'>
        <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
          Select Goal Type
        </h3>
        <p className='mt-2 text-gray-600 dark:text-gray-400'>
          What type of fitness goal would you like to set?
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <GoalTypeCard
          type='weight'
          title='Weight Goal'
          description='Track body weight changes'
          icon='scale'
          selected={watchType === 'weight'}
          onClick={() => setValue('type', 'weight')}
        />

        <GoalTypeCard
          type='strength'
          title='Strength Goal'
          description='Track lifting progress'
          icon='dumbbell'
          selected={watchType === 'strength'}
          onClick={() => setValue('type', 'strength')}
        />

        <GoalTypeCard
          type='endurance'
          title='Endurance Goal'
          description='Track cardio performance'
          icon='running'
          selected={watchType === 'endurance'}
          onClick={() => setValue('type', 'endurance')}
        />

        <GoalTypeCard
          type='habit'
          title='Habit Goal'
          description='Track workout consistency'
          icon='calendar'
          selected={watchType === 'habit'}
          onClick={() => setValue('type', 'habit')}
        />

        <GoalTypeCard
          type='nutrition'
          title='Nutrition Goal'
          description='Track dietary habits'
          icon='food'
          selected={watchType === 'nutrition'}
          onClick={() => setValue('type', 'nutrition')}
        />

        <GoalTypeCard
          type='custom'
          title='Custom Goal'
          description='Create your own goal type'
          icon='star'
          selected={watchType === 'custom'}
          onClick={() => setValue('type', 'custom')}
        />
      </div>

      {errors.type && (
        <p className='text-center text-sm text-red-600 dark:text-red-400'>
          {errors.type.message}
        </p>
      )}

      {/* Hidden input for React Hook Form validation */}
      <input
        type='hidden'
        {...register('type', {
          required: 'Please select a goal type',
        })}
      />
    </div>
  );

  // Goal details component (Step 2) - IMPROVED VERSION
  const renderGoalDetails = () => (
    <div className='space-y-6'>
      <div className='text-center'>
        <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
          Set Goal Details
        </h3>
        <p className='mt-2 text-gray-600 dark:text-gray-400'>
          Define your target and current progress
        </p>
      </div>

      <div className='space-y-6'>
        {/* Target Value Section */}
        <div className='space-y-3'>
          <label
            htmlFor='targetValue'
            className='block text-sm font-semibold text-gray-700 dark:text-gray-300'
          >
            Target Value*
          </label>

          {/* Target Value and Unit Input - Combined Row */}
          <div className='flex rounded-lg shadow-sm'>
            <input
              type='number'
              id='targetValue'
              min='0'
              step='0.1'
              className={`flex-grow px-3 py-2.5 text-base border-2 border-r-0 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.targetValue
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              } dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
              placeholder='Enter target value'
              {...register('targetValue', {
                required: 'Target value is required',
                min: {
                  value: 0.1,
                  message: 'Target value must be greater than 0',
                },
                pattern: {
                  value: /^[0-9]*\.?[0-9]+$/,
                  message: 'Please enter a valid number',
                },
              })}
            />
            <input
              type='text'
              id='unit'
              className={`w-28 px-3 py-2.5 text-base border-2 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.unit
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
              } dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
              placeholder='Unit'
              {...register('unit', {
                required: 'Unit is required',
              })}
            />
          </div>

          {/* Error Messages */}
          {errors.targetValue && (
            <p className='text-sm text-red-600 dark:text-red-400 font-medium'>
              {errors.targetValue.message}
            </p>
          )}
          {errors.unit && (
            <p className='text-sm text-red-600 dark:text-red-400 font-medium'>
              {errors.unit.message}
            </p>
          )}

          {/* Helper Text */}
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Example: 150 lbs, 30 minutes, 10 sessions
          </p>
        </div>

        {/* Current Value Section */}
        <div className='space-y-3'>
          <label
            htmlFor='currentValue'
            className='block text-sm font-semibold text-gray-700 dark:text-gray-300'
          >
            Current Value (Optional)
          </label>

          <input
            type='number'
            id='currentValue'
            min='0'
            step='0.1'
            className={`w-full px-3 py-2.5 text-base border-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.currentValue
                ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
            placeholder='Enter your current value (leave blank to start from zero)'
            {...register('currentValue', {
              min: {
                value: 0,
                message: 'Current value cannot be negative',
              },
              pattern: {
                value: /^[0-9]*\.?[0-9]*$/,
                message: 'Please enter a valid number',
              },
              validate: value => {
                if (value && watchTargetValue) {
                  return (
                    parseFloat(value) <= parseFloat(watchTargetValue) ||
                    'Current value cannot exceed target value'
                  );
                }
                return true;
              },
            })}
          />

          {errors.currentValue && (
            <p className='text-sm text-red-600 dark:text-red-400 font-medium'>
              {errors.currentValue.message}
            </p>
          )}

          <p className='text-sm text-gray-500 dark:text-gray-400'>
            This helps track your starting point and progress
          </p>
        </div>
      </div>
    </div>
  );

  // Target date component (Step 3) - IMPROVED VERSION
  const renderTargetDate = () => {
    // Calculate minimum date (today)
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];

    return (
      <div className='space-y-6'>
        <div className='text-center'>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Set Target Date
          </h3>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>
            When do you want to achieve this goal?
          </p>
        </div>

        <div className='space-y-3'>
          <label
            htmlFor='targetDate'
            className='block text-sm font-semibold text-gray-700 dark:text-gray-300'
          >
            Target Date*
          </label>

          <input
            type='date'
            id='targetDate'
            className={`w-full px-3 py-2.5 text-base border-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.targetDate
                ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } dark:text-white`}
            min={minDate}
            {...register('targetDate', {
              required: 'Target date is required',
              validate: value => {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return (
                  selectedDate >= today || 'Target date cannot be in the past'
                );
              },
            })}
          />

          {errors.targetDate && (
            <p className='text-sm text-red-600 dark:text-red-400 font-medium'>
              {errors.targetDate.message}
            </p>
          )}

          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Select a realistic timeframe for your goal
          </p>
        </div>

        {/* Info Box */}
        <div className='bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-r-lg'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-blue-400'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm text-blue-700 dark:text-blue-300 font-medium'>
                Setting a specific deadline increases your chances of achieving
                your goal.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Review and confirm (Step 4)
  const renderReview = () => {
    // Convert goal type to human-readable format
    const getGoalTitle = () => {
      switch (watchType) {
        case 'weight':
          return `Reach ${watchTargetValue} ${watch('unit')} weight`;
        case 'strength':
          return `Increase strength to ${watchTargetValue} ${watch('unit')}`;
        case 'endurance':
          return `Build endurance to ${watchTargetValue} ${watch('unit')}`;
        case 'habit':
          return `Complete ${watchTargetValue} ${watch('unit')}`;
        case 'nutrition':
          return `Maintain ${watchTargetValue} ${watch('unit')} diet`;
        case 'custom':
        default:
          return `Custom goal: ${watchTargetValue} ${watch('unit')}`;
      }
    };

    // Format date for display
    const formatDate = dateString => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    // Calculate days until target
    const getDaysUntilTarget = () => {
      if (!watchTargetDate) return 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const target = new Date(watchTargetDate);
      const diffTime = Math.abs(target - today);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const currentValueFormatted = watchCurrentValue || '0';
    const progressPercentage = Math.round(
      ((parseFloat(currentValueFormatted) || 0) /
        parseFloat(watchTargetValue || 1)) *
        100
    );

    return (
      <div className='space-y-6'>
        <div className='text-center'>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Review Your Goal
          </h3>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>
            Confirm your goal details before creating
          </p>
        </div>

        <div className='bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700'>
          <div className='space-y-4'>
            <div className='text-center'>
              <h4 className='text-lg font-bold text-indigo-800 dark:text-indigo-300'>
                {getGoalTitle()}
              </h4>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
                <h5 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                  Current Value
                </h5>
                <p className='text-xl font-bold text-gray-900 dark:text-white'>
                  {currentValueFormatted} {watch('unit')}
                </p>
              </div>

              <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
                <h5 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                  Target Date
                </h5>
                <p className='text-lg font-bold text-gray-900 dark:text-white'>
                  {formatDate(watchTargetDate)}
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  ({getDaysUntilTarget()} days from now)
                </p>
              </div>
            </div>

            {/* Progress preview */}
            <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
              <h5 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                Starting Progress
              </h5>
              <div className='flex items-center justify-between text-sm mb-2'>
                <span className='text-gray-600 dark:text-gray-400'>
                  {currentValueFormatted} / {watchTargetValue} {watch('unit')}
                </span>
                <span className='font-bold text-indigo-600 dark:text-indigo-400'>
                  {progressPercentage}%
                </span>
              </div>
              <div className='w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3'>
                <div
                  className='bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-500'
                  style={{ width: `${Math.min(100, progressPercentage)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderTypeSelection();
      case 2:
        return renderGoalDetails();
      case 3:
        return renderTargetDate();
      case 4:
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        {/* Background overlay */}
        <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
          <div className='absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75'></div>
        </div>

        {/* Modal panel - MADE LARGER */}
        <div className='inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full'>
          <div className='px-6 pt-6 pb-4 sm:p-8 sm:pb-4'>
            <div className='w-full'>
              <div className='text-center mb-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  Create New Goal
                </h2>
              </div>

              {/* Progress steps */}
              <div className='mb-8'>
                <div className='flex items-center justify-between'>
                  <div className='w-full flex items-center'>
                    {[1, 2, 3, 4].map(stepNumber => (
                      <React.Fragment key={stepNumber}>
                        {/* Step circle */}
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                            step >= stepNumber
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {stepNumber}
                        </div>

                        {/* Connector line (not for last step) */}
                        {stepNumber < 4 && (
                          <div
                            className={`flex-1 h-2 mx-2 rounded ${
                              step > stepNumber
                                ? 'bg-indigo-600'
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          ></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Step labels */}
                <div className='flex justify-between text-sm mt-3 font-medium'>
                  <div
                    className={
                      step >= 1
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }
                  >
                    Type
                  </div>
                  <div
                    className={
                      step >= 2
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }
                  >
                    Details
                  </div>
                  <div
                    className={
                      step >= 3
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }
                  >
                    Date
                  </div>
                  <div
                    className={
                      step >= 4
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }
                  >
                    Review
                  </div>
                </div>
              </div>

              {/* Step content */}
              <div className='min-h-[400px]'>{renderStep()}</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className='bg-gray-50 dark:bg-gray-700 px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse sm:gap-3'>
            {step < 4 ? (
              <Button
                variant='primary'
                onClick={nextStep}
                className='w-full sm:w-auto px-6 py-2'
              >
                Next
              </Button>
            ) : (
              <Button
                variant='primary'
                onClick={handleSubmit(onFormSubmit)}
                disabled={loading}
                className='w-full sm:w-auto px-6 py-2'
              >
                {loading ? 'Creating...' : 'Create Goal'}
              </Button>
            )}

            {step > 1 ? (
              <Button
                variant='outline'
                onClick={prevStep}
                className='w-full sm:w-auto px-6 py-2 mt-3 sm:mt-0'
              >
                Back
              </Button>
            ) : (
              <Button
                variant='outline'
                onClick={onClose}
                className='w-full sm:w-auto px-6 py-2 mt-3 sm:mt-0'
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Goal Type Card component
const GoalTypeCard = ({
  type,
  title,
  icon,
  description,
  selected,
  onClick,
}) => {
  // Icons for different goal types
  const icons = {
    scale: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-6 w-6'
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
    ),
    dumbbell: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-6 w-6'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M4 8h16M4 16h16'
        />
      </svg>
    ),
    running: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-6 w-6'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M13 10V3L4 14h7v7l9-11h-7z'
        />
      </svg>
    ),
    calendar: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-6 w-6'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
        />
      </svg>
    ),
    food: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-6 w-6'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
        />
      </svg>
    ),
    star: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-6 w-6'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
        />
      </svg>
    ),
  };

  return (
    <div
      className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selected
          ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-400 shadow-md'
          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onClick={onClick}
    >
      <div className='flex items-start space-x-4'>
        <div
          className={`p-3 rounded-lg ${
            selected
              ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}
        >
          {icons[icon]}
        </div>
        <div className='flex-1 min-w-0'>
          <h3
            className={`text-base font-semibold ${
              selected
                ? 'text-indigo-800 dark:text-indigo-300'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {title}
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            {description}
          </p>
        </div>
        {selected && (
          <div className='flex-shrink-0'>
            <svg
              className='h-5 w-5 text-indigo-600 dark:text-indigo-400'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalWizard;
