import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

// Step components with improved UI and dark mode support
const AccountStep = ({ formData, onChange, onNext, error }) => {
  const [validationErrors, setValidationErrors] = useState({});
  
  const validate = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Account Information</h3>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email address<span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
          className={`appearance-none relative block w-full px-3 py-2 border ${
            validationErrors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
          } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
          placeholder="name@example.com"
        />
        {validationErrors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password<span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          required
          className={`appearance-none relative block w-full px-3 py-2 border ${
            validationErrors.password ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
          } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
          placeholder="••••••••"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Password must be at least 8 characters long
        </p>
        {validationErrors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
        )}
      </div>
      
      <div className="pt-4">
        <button
          type="button"
          onClick={handleNext}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const PersonalInfoStep = ({ formData, onChange, onNext, onBack, error }) => {
  const [validationErrors, setValidationErrors] = useState({});
  
  const validate = () => {
    const errors = {};
    
    if (!formData.firstName) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.gender) {
      errors.gender = 'Please select a gender option';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            First name<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            required
            className={`appearance-none relative block w-full px-3 py-2 border ${
              validationErrors.firstName ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
            } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
          />
          {validationErrors.firstName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.firstName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Last name<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            required
            className={`appearance-none relative block w-full px-3 py-2 border ${
              validationErrors.lastName ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
            } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
          />
          {validationErrors.lastName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.lastName}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date of birth
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={onChange}
          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm"
        />
      </div>
      
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Gender<span className="text-red-500 ml-1">*</span>
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={onChange}
          required
          className={`appearance-none relative block w-full px-3 py-2 border ${
            validationErrors.gender ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
          } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm`}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer not to say">Prefer not to say</option>
        </select>
        {validationErrors.gender && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.gender}</p>
        )}
      </div>
      
      <div className="pt-4 flex justify-between space-x-4">
        <button
          type="button"
          onClick={onBack}
          className="py-2 px-4 w-1/2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="py-2 px-4 w-1/2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const FitnessProfileStep = ({ formData, onChange, onSubmit, onBack, loading, error }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Fitness Profile</h3>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Fitness level<span className="text-red-500 ml-1">*</span>
        </label>
        <select
          id="fitnessLevel"
          name="fitnessLevel"
          value={formData.fitnessLevel}
          onChange={onChange}
          required
          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 focus:z-10 sm:text-sm"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your fitness level helps us customize workout recommendations to match your experience.
            </p>
          </div>
        </div>
      </div>
      
      <div className="pt-4 flex justify-between space-x-4">
        <button
          type="button"
          onClick={onBack}
          className="py-2 px-4 w-1/2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          disabled={loading}
          className="py-2 px-4 w-1/2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </div>
          ) : (
            'Create account'
          )}
        </button>
      </div>
    </div>
  );
};

// Main Register component
const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    fitnessLevel: 'beginner'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNext = () => {
    setError('');
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setError('');
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submission
    if (!formData.gender) {
      setError('Gender selection is required to create your account');
      setStep(2); // Go back to personal info step
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.error?.message || 'Failed to create an account. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Left side with illustration/branding (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 dark:bg-indigo-900 flex-col justify-between items-center py-12 px-8 transition-colors">
        <div className="w-full flex justify-end">
          <ThemeToggle className="bg-white/10 text-white" />
        </div>
        
        <div className="flex flex-col items-center max-w-md text-white">
          <h1 className="text-4xl font-bold mb-2">FitTrack Pro</h1>
          <p className="text-xl mb-8 text-center font-light">Start your fitness journey today</p>
          
          {/* Placeholder for illustration/image */}
          <div className="w-64 h-64 bg-white/10 rounded-lg flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-32 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <div className="mt-4 text-center text-white/80">
            <p>Join thousands of users who are already transforming their fitness with our personalized approach.</p>
          </div>
        </div>
        
        <div className="text-white/60 text-sm">
          &copy; {new Date().getFullYear()} FitTrack Pro. All rights reserved.
        </div>
      </div>
      
      {/* Right side with registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="absolute top-4 right-4 lg:hidden">
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Or{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                sign in to your existing account
              </Link>
            </p>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-between mb-8">
            <div className="w-full">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 dark:border-gray-600 dark:text-gray-500'}`}>
                    1
                  </span>
                </div>
                <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step >= 2 ? 'border-indigo-600' : 'border-gray-300 dark:border-gray-600'}`}></div>
                <div>
                  <span className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 dark:border-gray-600 dark:text-gray-500'}`}>
                    2
                  </span>
                </div>
                <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step >= 3 ? 'border-indigo-600' : 'border-gray-300 dark:border-gray-600'}`}></div>
                <div>
                  <span className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 dark:border-gray-600 dark:text-gray-500'}`}>
                    3
                  </span>
                </div>
              </div>
              <div className="flex text-xs text-center">
                <div className={`w-1/3 ${step === 1 ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  Account
                </div>
                <div className={`w-1/3 ${step === 2 ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  Personal
                </div>
                <div className={`w-1/3 ${step === 3 ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  Fitness
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Container with enhanced styling */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <AccountStep 
                  formData={formData}
                  onChange={handleChange}
                  onNext={handleNext}
                  error={error}
                />
              )}
              
              {step === 2 && (
                <PersonalInfoStep 
                  formData={formData}
                  onChange={handleChange}
                  onNext={handleNext}
                  onBack={handleBack}
                  error={error}
                />
              )}
              
              {step === 3 && (
                <FitnessProfileStep 
                  formData={formData}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  onBack={handleBack}
                  loading={loading}
                  error={error}
                />
              )}
            </form>
          </div>
          
          {/* Terms and Privacy */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;