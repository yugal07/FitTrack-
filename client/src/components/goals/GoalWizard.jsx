import React ,{ useState } from 'react';
import api from '../../utils/api';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const GoalWizard = ({ onClose, onGoalCreated }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '',
    targetValue: '',
    currentValue: '',
    unit: '',
    targetDate: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Set default units based on goal type
    if (name === 'type') {
      let defaultUnit = '';
      
      switch(value) {
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
      }
      
      setFormData(prev => ({ ...prev, unit: defaultUnit }));
    }
  };
  
  const nextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.type) {
        setError('Please select a goal type');
        return;
      }
    } else if (step === 2) {
      if (!formData.targetValue) {
        setError('Please enter a target value');
        return;
      }
      if (!formData.unit) {
        setError('Please specify a unit of measurement');
        return;
      }
      
      if (isNaN(formData.targetValue) || parseFloat(formData.targetValue) <= 0) {
        setError('Target value must be a positive number');
        return;
      }
      
      if (formData.currentValue && (isNaN(formData.currentValue) || parseFloat(formData.currentValue) < 0)) {
        setError('Current value must be a positive number');
        return;
      }
    }
    
    setError('');
    setStep(prevStep => prevStep + 1);
  };
  
  const prevStep = () => {
    setError('');
    setStep(prevStep => prevStep - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.targetDate) {
      setError('Please select a target date');
      return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (new Date(formData.targetDate) < today) {
      setError('Target date cannot be in the past');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Process data for submission
      const goalData = {
        ...formData,
        targetValue: parseFloat(formData.targetValue),
        currentValue: formData.currentValue ? parseFloat(formData.currentValue) : 0
      };
      
      await api.post('/api/goals', goalData);
      
      // Success
      onGoalCreated();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create goal');
      console.error('Error creating goal:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Render Goal Type Selection (Step 1)
  const renderTypeSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select Goal Type</h3>
      <p className="text-gray-500 dark:text-gray-400">What type of fitness goal would you like to set?</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <GoalTypeCard
          type="weight"
          title="Weight Goal"
          description="Track body weight changes"
          icon="scale"
          selected={formData.type === 'weight'}
          onClick={() => handleChange({ target: { name: 'type', value: 'weight' } })}
        />
        
        <GoalTypeCard
          type="strength"
          title="Strength Goal"
          description="Track lifting progress"
          icon="dumbbell"
          selected={formData.type === 'strength'}
          onClick={() => handleChange({ target: { name: 'type', value: 'strength' } })}
        />
        
        <GoalTypeCard
          type="endurance"
          title="Endurance Goal"
          description="Track cardio performance"
          icon="running"
          selected={formData.type === 'endurance'}
          onClick={() => handleChange({ target: { name: 'type', value: 'endurance' } })}
        />
        
        <GoalTypeCard
          type="habit"
          title="Habit Goal"
          description="Track workout consistency"
          icon="calendar"
          selected={formData.type === 'habit'}
          onClick={() => handleChange({ target: { name: 'type', value: 'habit' } })}
        />
        
        <GoalTypeCard
          type="nutrition"
          title="Nutrition Goal"
          description="Track dietary habits"
          icon="food"
          selected={formData.type === 'nutrition'}
          onClick={() => handleChange({ target: { name: 'type', value: 'nutrition' } })}
        />
        
        <GoalTypeCard
          type="custom"
          title="Custom Goal"
          description="Create your own goal type"
          icon="star"
          selected={formData.type === 'custom'}
          onClick={() => handleChange({ target: { name: 'type', value: 'custom' } })}
        />
      </div>
    </div>
  );
  
  // Render Goal Details (Step 2)
  const renderGoalDetails = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Set Goal Details</h3>
      <p className="text-gray-500 dark:text-gray-400">Define your target and current progress</p>
      
      <div className="space-y-4 mt-4">
        <div>
          <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Target Value*
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              name="targetValue"
              id="targetValue"
              min="0"
              step="0.1"
              className="flex-grow focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Enter target value"
              value={formData.targetValue}
              onChange={handleChange}
              required
            />
            <div className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 sm:text-sm">
              <input
                type="text"
                name="unit"
                id="unit"
                className="border-0 bg-transparent p-0 focus:ring-0"
                placeholder="Unit"
                value={formData.unit}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Example: 150 lbs, 30 minutes, 10 sessions
          </p>
        </div>
        
        <div>
          <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Current Value
          </label>
          <input
            type="number"
            name="currentValue"
            id="currentValue"
            min="0"
            step="0.1"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
            placeholder="Enter current value (optional)"
            value={formData.currentValue}
            onChange={handleChange}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Leave blank to start from zero
          </p>
        </div>
      </div>
    </div>
  );
  
  // Render Target Date (Step 3)
  const renderTargetDate = () => {
    // Calculate minimum date (today)
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    
    // Calculate default date suggestion (1 month from now)
    const defaultDate = new Date();
    defaultDate.setMonth(today.getMonth() + 1);
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Set Target Date</h3>
        <p className="text-gray-500 dark:text-gray-400">When do you want to achieve this goal?</p>
        
        <div className="mt-4">
          <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Target Date*
          </label>
          <input
            type="date"
            name="targetDate"
            id="targetDate"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
            min={minDate}
            value={formData.targetDate}
            onChange={handleChange}
            required
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a realistic timeframe for your goal
          </p>
        </div>
        
        <div className="pt-2">
          <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Setting a specific deadline increases your chances of achieving your goal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render Review and Confirm (Step 4)
  const renderReview = () => {
    // Convert goal type to human-readable format
    const getGoalTitle = () => {
      switch (formData.type) {
        case 'weight':
          return `Reach ${formData.targetValue} ${formData.unit} weight`;
        case 'strength':
          return `Increase strength to ${formData.targetValue} ${formData.unit}`;
        case 'endurance':
          return `Build endurance to ${formData.targetValue} ${formData.unit}`;
        case 'habit':
          return `Complete ${formData.targetValue} ${formData.unit}`;
        case 'nutrition':
          return `Maintain ${formData.targetValue} ${formData.unit} diet`;
        case 'custom':
        default:
          return `Custom goal: ${formData.targetValue} ${formData.unit}`;
      }
    };
    
    // Format date for display
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    // Calculate days until target
    const getDaysUntilTarget = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const target = new Date(formData.targetDate);
      const diffTime = Math.abs(target - today);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Review Your Goal</h3>
        <p className="text-gray-500 dark:text-gray-400">Confirm your goal details before creating</p>
        
        <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="space-y-3">
            <div>
              <h4 className="text-base font-medium text-gray-700 dark:text-gray-300">Goal</h4>
              <p className="text-gray-900 dark:text-white font-medium">{getGoalTitle()}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Value</h4>
                <p className="text-gray-900 dark:text-white">{formData.currentValue || '0'} {formData.unit}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Date</h4>
                <p className="text-gray-900 dark:text-white">{formatDate(formData.targetDate)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">({getDaysUntilTarget()} days from now)</p>
              </div>
            </div>
            
            {/* Progress preview */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Starting Progress</h4>
              <div className="mt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    {formData.currentValue || '0'} / {formData.targetValue} {formData.unit}
                  </span>
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    {Math.round(((formData.currentValue || 0) / formData.targetValue) * 100)}%
                  </span>
                </div>
                <div className="mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, Math.round(((formData.currentValue || 0) / formData.targetValue) * 100))}%` }}
                  ></div>
                </div>
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>
        
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h2 className="text-xl leading-6 font-medium text-gray-900 dark:text-white">
                  Create New Goal
                </h2>
                
                {/* Progress steps */}
                <div className="mt-4 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="w-full flex items-center">
                      {[1, 2, 3, 4].map((stepNumber) => (
                        <React.Fragment key={stepNumber}>
                          {/* Step circle */}
                          <div 
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${
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
                              className={`flex-1 h-1 ${
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
                  <div className="flex justify-between text-xs mt-2">
                    <div className={step >= 1 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}>Type</div>
                    <div className={step >= 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}>Details</div>
                    <div className={step >= 3 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}>Date</div>
                    <div className={step >= 4 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}>Review</div>
                  </div>
                </div>
                
                {/* Error alert */}
                {error && (
                  <Alert 
                    type="error"
                    message={error}
                    onDismiss={() => setError('')}
                    className="mb-4"
                  />
                )}
                
                {/* Step content */}
                <div className="mb-6">
                  {renderStep()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {step < 4 ? (
              <Button 
                variant="primary" 
                onClick={nextStep}
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Goal'}
              </Button>
            )}
            
            {step > 1 ? (
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="mt-3 sm:mt-0 sm:mr-3"
              >
                Back
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={onClose}
                className="mt-3 sm:mt-0 sm:mr-3"
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
const GoalTypeCard = ({ type, title, icon, description, selected, onClick }) => {
  // Icons for different goal types
  const icons = {
    scale: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    dumbbell: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
      </svg>
    ),
    running: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    calendar: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    food: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    star: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    )
  };
  
  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
        selected 
          ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-400' 
          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${
          selected 
            ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }`}>
          {icons[icon]}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${
            selected ? 'text-indigo-800 dark:text-indigo-300' : 'text-gray-900 dark:text-white'
          }`}>
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default GoalWizard;