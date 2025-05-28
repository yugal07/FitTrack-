import { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

// Move components outside to prevent recreation on each render
const ProgressIndicator = memo(({ step }) => (
  <div className='mb-6'>
    <div className='flex items-center justify-between'>
      {[1, 2, 3, 4].map(stepNumber => (
        <div key={stepNumber} className='flex items-center'>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
              step > stepNumber
                ? 'bg-green-500 text-white'
                : step === stepNumber
                  ? 'bg-indigo-600 text-white shadow-lg scale-110'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            {step > stepNumber ? (
              <CheckCircle className='w-4 h-4' />
            ) : (
              stepNumber
            )}
          </div>
          {stepNumber < 4 && (
            <div
              className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                step > stepNumber
                  ? 'bg-green-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
    <div className='flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400'>
      <span
        className={
          step === 1 ? 'text-indigo-600 dark:text-indigo-400 font-medium' : ''
        }
      >
        Account
      </span>
      <span
        className={
          step === 2 ? 'text-indigo-600 dark:text-indigo-400 font-medium' : ''
        }
      >
        Personal
      </span>
      <span
        className={
          step === 3 ? 'text-indigo-600 dark:text-indigo-400 font-medium' : ''
        }
      >
        Profile
      </span>
      <span
        className={
          step === 4 ? 'text-indigo-600 dark:text-indigo-400 font-medium' : ''
        }
      >
        Goals
      </span>
    </div>
  </div>
));

const AccountStep = memo(
  ({
    formData,
    errors,
    error,
    updateFormData,
    showPassword,
    setShowPassword,
    passwordStrength,
    handleNext,
  }) => (
    <div className='space-y-5'>
      <div className='text-center'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
          Account Information
        </h3>
        <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
          Create your secure login credentials
        </p>
      </div>

      {error && (
        <div
          className='bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative'
          role='alert'
        >
          <span className='block sm:inline'>{error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
        >
          Email address<span className='text-red-500 ml-1'>*</span>
        </label>
        <input
          id='email'
          type='email'
          autoComplete='email'
          className={`appearance-none relative block w-full px-3 py-2 border ${
            errors.email
              ? 'border-red-300 dark:border-red-700'
              : 'border-gray-300 dark:border-gray-700'
          } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
          placeholder='name@example.com'
          value={formData.email}
          onChange={e => updateFormData('email', e.target.value)}
        />
        {errors.email && (
          <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
        >
          Password<span className='text-red-500 ml-1'>*</span>
        </label>
        <div className='relative'>
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            autoComplete='new-password'
            className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
              errors.password
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
            placeholder='••••••••'
            value={formData.password}
            onChange={e => updateFormData('password', e.target.value)}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          >
            {showPassword ? (
              <EyeOff className='w-4 h-4' />
            ) : (
              <Eye className='w-4 h-4' />
            )}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className='mt-2'>
            <div className='flex justify-between text-xs mb-1'>
              <span className='text-gray-600 dark:text-gray-400'>
                Password strength
              </span>
              <span
                className={`font-medium ${
                  passwordStrength >= 75
                    ? 'text-green-600 dark:text-green-400'
                    : passwordStrength >= 50
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                }`}
              >
                {passwordStrength >= 75
                  ? 'Strong'
                  : passwordStrength >= 50
                    ? 'Medium'
                    : 'Weak'}
              </span>
            </div>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5'>
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  passwordStrength >= 75
                    ? 'bg-green-500'
                    : passwordStrength >= 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
          </div>
        )}

        <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
          Password must be at least 8 characters long
        </p>

        {errors.password && (
          <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
            {errors.password}
          </p>
        )}
      </div>

      <div className='pt-4'>
        <button
          type='button'
          onClick={handleNext}
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors'
        >
          Next
        </button>
      </div>
    </div>
  )
);

const PersonalInfoStep = memo(
  ({ formData, errors, updateFormData, handleNext, handleBack }) => (
    <div className='space-y-5'>
      <div className='text-center'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
          Personal Information
        </h3>
        <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
          Help us personalize your experience
        </p>
      </div>

      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
        <div>
          <label
            htmlFor='firstName'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
          >
            First name<span className='text-red-500 ml-1'>*</span>
          </label>
          <input
            id='firstName'
            type='text'
            autoComplete='given-name'
            className={`appearance-none relative block w-full px-3 py-2 border ${
              errors.firstName
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
            placeholder='John'
            value={formData.firstName}
            onChange={e => updateFormData('firstName', e.target.value)}
          />
          {errors.firstName && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='lastName'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
          >
            Last name<span className='text-red-500 ml-1'>*</span>
          </label>
          <input
            id='lastName'
            type='text'
            autoComplete='family-name'
            className={`appearance-none relative block w-full px-3 py-2 border ${
              errors.lastName
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
            placeholder='Doe'
            value={formData.lastName}
            onChange={e => updateFormData('lastName', e.target.value)}
          />
          {errors.lastName && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div className='pt-4 flex justify-between space-x-4'>
        <button
          type='button'
          onClick={handleBack}
          className='py-2 px-4 w-1/2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors'
        >
          Back
        </button>
        <button
          type='button'
          onClick={handleNext}
          className='py-2 px-4 w-1/2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors'
        >
          Next
        </button>
      </div>
    </div>
  )
);

const ProfileStep = memo(
  ({ formData, errors, updateFormData, handleNext, handleBack }) => (
    <div className='space-y-5'>
      <div className='text-center'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
          Profile Details
        </h3>
        <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
          This helps us provide better recommendations
        </p>
      </div>

      <div>
        <label
          htmlFor='dateOfBirth'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
        >
          Date of birth<span className='text-red-500 ml-1'>*</span>
        </label>
        <input
          id='dateOfBirth'
          type='date'
          className={`appearance-none relative block w-full px-3 py-2 border ${
            errors.dateOfBirth
              ? 'border-red-300 dark:border-red-700'
              : 'border-gray-300 dark:border-gray-700'
          } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
          value={formData.dateOfBirth}
          onChange={e => updateFormData('dateOfBirth', e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />
        {errors.dateOfBirth && (
          <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
            {errors.dateOfBirth}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='gender'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
        >
          Gender<span className='text-red-500 ml-1'>*</span>
        </label>
        <select
          id='gender'
          className={`appearance-none relative block w-full px-3 py-2 border ${
            errors.gender
              ? 'border-red-300 dark:border-red-700'
              : 'border-gray-300 dark:border-gray-700'
          } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
          value={formData.gender}
          onChange={e => updateFormData('gender', e.target.value)}
        >
          <option value=''>Select gender</option>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
          <option value='other'>Other</option>
          <option value='prefer not to say'>Prefer not to say</option>
        </select>
        {errors.gender && (
          <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
            {errors.gender}
          </p>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          Fitness level<span className='text-red-500 ml-1'>*</span>
        </label>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
          {[
            { value: 'beginner', label: 'Beginner', desc: 'New to fitness' },
            {
              value: 'intermediate',
              label: 'Intermediate',
              desc: 'Some experience',
            },
            { value: 'advanced', label: 'Advanced', desc: 'Very experienced' },
          ].map(level => (
            <label key={level.value} className='relative cursor-pointer'>
              <input
                type='radio'
                value={level.value}
                checked={formData.fitnessLevel === level.value}
                onChange={e => updateFormData('fitnessLevel', e.target.value)}
                className='sr-only'
              />
              <div
                className={`border-2 rounded-lg p-3 transition-all duration-200 ${
                  formData.fitnessLevel === level.value
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                }`}
              >
                <div className='text-center'>
                  <div className='font-medium text-gray-900 dark:text-white text-sm'>
                    {level.label}
                  </div>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>
                    {level.desc}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className='pt-4 flex justify-between space-x-4'>
        <button
          type='button'
          onClick={handleBack}
          className='py-2 px-4 w-1/2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors'
        >
          Back
        </button>
        <button
          type='button'
          onClick={handleNext}
          className='py-2 px-4 w-1/2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors'
        >
          Next
        </button>
      </div>
    </div>
  )
);

const GoalsStep = memo(
  ({
    formData,
    errors,
    updateFormData,
    toggleGoal,
    onSubmit,
    handleBack,
    loading,
  }) => (
    <div className='space-y-5'>
      <div className='text-center'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
          Your Fitness Goals
        </h3>
        <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
          What would you like to achieve? (Select all that apply)
        </p>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        {[
          { value: 'weight-loss', label: 'Weight Loss', icon: '🔥' },
          { value: 'muscle-gain', label: 'Muscle Gain', icon: '💪' },
          { value: 'endurance', label: 'Endurance', icon: '🏃' },
          { value: 'strength', label: 'Strength', icon: '🏋️' },
          { value: 'flexibility', label: 'Flexibility', icon: '🧘' },
          { value: 'general-health', label: 'General Health', icon: '❤️' },
        ].map(goal => (
          <label key={goal.value} className='relative cursor-pointer'>
            <input
              type='checkbox'
              value={goal.value}
              checked={formData.goals.includes(goal.value)}
              onChange={() => toggleGoal(goal.value)}
              className='sr-only'
            />
            <div
              className={`border-2 rounded-lg p-3 transition-all duration-200 hover:shadow-sm ${
                formData.goals.includes(goal.value)
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500'
              }`}
            >
              <div className='text-center'>
                <div className='text-lg mb-1'>{goal.icon}</div>
                <div className='font-medium text-gray-900 dark:text-white text-sm'>
                  {goal.label}
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className='bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-4'>
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
          <div className='ml-3 flex-1'>
            <p className='text-sm text-blue-700 dark:text-blue-300'>
              Based on your goals, we'll customize your workout plans, nutrition
              advice, and progress tracking.
            </p>
          </div>
        </div>
      </div>

      <div className='flex items-start'>
        <input
          id='acceptTerms'
          type='checkbox'
          checked={formData.acceptTerms}
          onChange={e => updateFormData('acceptTerms', e.target.checked)}
          className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 mt-0.5'
        />
        <label
          htmlFor='acceptTerms'
          className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
        >
          I agree to the{' '}
          <a
            href='#'
            className='text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href='#'
            className='text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
          >
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.acceptTerms && (
        <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
          {errors.acceptTerms}
        </p>
      )}

      <div className='pt-4 flex justify-between space-x-4'>
        <button
          type='button'
          onClick={handleBack}
          className='py-2 px-4 w-1/2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors'
        >
          Back
        </button>
        <button
          type='button'
          onClick={onSubmit}
          disabled={loading}
          className='py-2 px-4 w-1/2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 transition-colors'
        >
          {loading ? (
            <div className='flex items-center justify-center'>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Creating account...
            </div>
          ) : (
            'Create account'
          )}
        </button>
      </div>
    </div>
  )
);

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    fitnessLevel: 'beginner',
    goals: [],
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});

  const { register: registerUser } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Password strength calculation
  const calculatePasswordStrength = useCallback(password => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  }, []);

  // Update form data
  const updateFormData = useCallback(
    (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (field === 'password') {
        setPasswordStrength(calculatePasswordStrength(value));
      }
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
    },
    [errors, calculatePasswordStrength]
  );

  // Toggle goals
  const toggleGoal = useCallback(goalValue => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalValue)
        ? prev.goals.filter(g => g !== goalValue)
        : [...prev.goals, goalValue],
    }));
  }, []);

  // Validation functions
  const validateStep = useCallback(
    stepNumber => {
      const newErrors = {};

      if (stepNumber === 1) {
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = 'Email is invalid';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8)
          newErrors.password = 'Password must be at least 8 characters long';
      } else if (stepNumber === 2) {
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
      } else if (stepNumber === 3) {
        if (!formData.gender)
          newErrors.gender = 'Please select a gender option';

        // Date of birth validation
        if (!formData.dateOfBirth) {
          newErrors.dateOfBirth = 'Date of birth is required';
        } else {
          const birthDate = new Date(formData.dateOfBirth);
          const today = new Date();
          const minAge = 13; // Minimum age requirement

          // Calculate age
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          if (birthDate > today) {
            newErrors.dateOfBirth = 'Date of birth cannot be in the future';
          } else if (age < minAge) {
            newErrors.dateOfBirth = `You must be at least ${minAge} years old to register`;
          }
        }
      } else if (stepNumber === 4) {
        if (!formData.acceptTerms)
          newErrors.acceptTerms = 'You must accept the terms and conditions';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  const handleNext = useCallback(() => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      setError('');
    }
  }, [step, validateStep]);

  const handleBack = useCallback(() => {
    setStep(prev => prev - 1);
    setError('');
  }, []);

  const onSubmit = useCallback(async () => {
    if (!validateStep(4)) return;

    try {
      setLoading(true);
      setError('');

      // Prepare data for API (excluding goals for now to match existing API)
      const registrationData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        fitnessLevel: formData.fitnessLevel,
      };

      await registerUser(registrationData);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.error?.message || 'Failed to create an account. Please try again.'
      );
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  }, [formData, validateStep, registerUser, navigate]);

  return (
    <div className='min-h-screen flex bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors'>
      {/* Left side with illustration/branding (hidden on small screens) */}
      <div className='hidden lg:flex lg:w-1/2 bg-indigo-600 dark:bg-indigo-900 flex-col justify-between items-center py-12 px-8 transition-colors'>
        <div className='w-full flex justify-end'>
          <ThemeToggle className='bg-white/10 text-white' />
        </div>

        <div className='flex flex-col items-center max-w-md text-white'>
          <h1 className='text-4xl font-bold mb-2'>FitTrack Pro</h1>
          <p className='text-xl mb-8 text-center font-light'>
            Start your fitness journey today
          </p>

          {/* Placeholder for illustration/image */}
          <div className='w-64 h-64 bg-white/10 rounded-lg flex items-center justify-center mb-8'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-32 h-32 text-white/80'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='1.5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>
          </div>

          <div className='mt-4 text-center text-white/80'>
            <p>
              Join thousands of users who are already transforming their fitness
              with our personalized approach.
            </p>
          </div>
        </div>

        <div className='text-white/60 text-sm'>
          &copy; {new Date().getFullYear()} FitTrack Pro. All rights reserved.
        </div>
      </div>

      {/* Right side with registration form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative'>
        <div className='absolute top-4 right-4 lg:hidden'>
          <ThemeToggle />
        </div>

        <div className='w-full max-w-md space-y-8'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white'>
              Create your account
            </h2>
            <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
              Or{' '}
              <Link
                to='/login'
                className='font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
              >
                sign in to your existing account
              </Link>
            </p>
          </div>

          {/* Progress indicator */}
          <ProgressIndicator step={step} />

          {/* Form Container */}
          <div className='mt-8 space-y-6'>
            {step === 1 && (
              <AccountStep
                formData={formData}
                errors={errors}
                error={error}
                updateFormData={updateFormData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                passwordStrength={passwordStrength}
                handleNext={handleNext}
              />
            )}
            {step === 2 && (
              <PersonalInfoStep
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                handleNext={handleNext}
                handleBack={handleBack}
              />
            )}
            {step === 3 && (
              <ProfileStep
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                handleNext={handleNext}
                handleBack={handleBack}
              />
            )}
            {step === 4 && (
              <GoalsStep
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                toggleGoal={toggleGoal}
                onSubmit={onSubmit}
                handleBack={handleBack}
                loading={loading}
              />
            )}
          </div>

          {/* Terms and Privacy */}
          <div className='text-center text-xs text-gray-500 dark:text-gray-400 mt-4'>
            By creating an account, you agree to our{' '}
            <a
              href='#'
              className='text-indigo-600 dark:text-indigo-400 hover:underline'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='#'
              className='text-indigo-600 dark:text-indigo-400 hover:underline'
            >
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
