// src/components/auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

// Step components with dark mode support
const AccountStep = ({ formData, onChange, onNext, error }) => {
  const { isDark } = useTheme();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Account Information</h3>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Password must be at least 8 characters long
        </p>
      </div>
      
      <div className="pt-4">
        <button
          type="button"
          onClick={onNext}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const PersonalInfoStep = ({ formData, onChange, onNext, onBack, error }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            First name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date of birth
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
        />
      </div>
      
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer not to say">Prefer not to say</option>
        </select>
      </div>
      
      <div className="pt-4 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const FitnessProfileStep = ({ formData, onChange, onSubmit, onBack, loading, error }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Fitness Profile</h3>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Fitness level
        </label>
        <select
          id="fitnessLevel"
          name="fitnessLevel"
          value={formData.fitnessLevel}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
        >
          <option value="">Select fitness level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      
      <div className="pt-4 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
        >
          Back
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          disabled={loading}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create account'}
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
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.password) {
        setError('Please fill out all required fields');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
    } else if (step === 2) {
      if (!formData.firstName || !formData.lastName) {
        setError('Please fill out all required fields');
        return false;
      }
    }
    
    setError('');
    return true;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
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
        <div className="flex justify-between mb-4">
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
              <div className={`w-1/3 ${step === 1 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                Account
              </div>
              <div className={`w-1/3 ${step === 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                Personal
              </div>
              <div className={`w-1/3 ${step === 3 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                Fitness
              </div>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
    </div>
  );
};

export default Register;