// src/components/goals/GoalList.jsx
import { useState } from 'react';
import { format } from 'date-fns';
import api from '../../utils/api';
import Alert from '../ui/Alert';
import Button from '../ui/Button';

const GoalList = ({ goals, loading, onGoalUpdated }) => {
  const [expandedGoalId, setExpandedGoalId] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [progressValue, setProgressValue] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleExpand = (goalId) => {
    if (expandedGoalId === goalId) {
      setExpandedGoalId(null);
    } else {
      setExpandedGoalId(goalId);
    }
  };

  const handleProgressChange = (goalId, value) => {
    setProgressValue(prev => ({
      ...prev,
      [goalId]: value
    }));
  };

  const handleProgressUpdate = async (goal) => {
    try {
      setUpdateLoading(true);
      setUpdateError('');
      
      const goalId = goal._id;
      const currentValue = parseFloat(progressValue[goalId]) || 0;
      
      await api.patch(`/api/goals/${goalId}/progress`, { 
        currentValue 
      });
      
      setSuccessMessage('Progress updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      onGoalUpdated();
    } catch (err) {
      setUpdateError('Failed to update progress');
      console.error('Error updating goal progress:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleRequestDelete = (goalId) => {
    setConfirmDelete(goalId);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleConfirmDelete = async (goalId) => {
    try {
      setUpdateLoading(true);
      setUpdateError('');
      
      await api.delete(`/api/goals/${goalId}`);
      
      setSuccessMessage('Goal deleted successfully');
      setConfirmDelete(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      onGoalUpdated();
    } catch (err) {
      setUpdateError('Failed to delete goal');
      console.error('Error deleting goal:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Filter goals into their categories
  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const abandonedGoals = goals.filter(goal => goal.status === 'abandoned');

  // Helper function to get a human-readable goal title
  const getGoalTitle = (goal) => {
    switch (goal.type) {
      case 'weight':
        return `Reach ${goal.targetValue} ${goal.unit} weight`;
      case 'strength':
        return `Increase strength to ${goal.targetValue} ${goal.unit}`;
      case 'endurance':
        return `Build endurance to ${goal.targetValue} ${goal.unit}`;
      case 'habit':
        return `Complete ${goal.targetValue} workouts`;
      case 'nutrition':
        return `Maintain ${goal.targetValue} ${goal.unit} diet`;
      case 'custom':
      default:
        return `${goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} goal`;
    }
  };

  // Render empty state if no goals
  if (!loading && goals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No goals set yet
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Create your first fitness goal to start tracking your progress.
        </p>
      </div>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Loading goals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {updateError && (
        <Alert 
          type="error"
          message={updateError}
          onDismiss={() => setUpdateError('')}
        />
      )}
      
      {successMessage && (
        <Alert 
          type="success"
          message={successMessage}
          onDismiss={() => setSuccessMessage('')}
        />
      )}

      {/* Active Goals */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          Active Goals ({activeGoals.length})
        </h3>
        
        {activeGoals.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">No active goals</p>
        ) : (
          <div className="space-y-4">
            {activeGoals.map(goal => (
              <div 
                key={goal._id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800"
              >
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      {getGoalTitle(goal)}
                    </h4>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Deadline: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                      </span>
                      <button
                        onClick={() => handleExpand(goal._id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          {expandedGoalId === goal._id ? (
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Expanded section */}
                {expandedGoalId === goal._id && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col sm:flex-row sm:space-x-4">
                        <div className="mb-2 sm:mb-0">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>{' '}
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{goal.type}</span>
                        </div>
                        <div className="mb-2 sm:mb-0">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Started:</span>{' '}
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {format(new Date(goal.startDate), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Days left:</span>{' '}
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {Math.max(0, Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)))}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="flex-grow">
                          <label htmlFor={`progress-${goal._id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Update Progress
                          </label>
                          <input
                            id={`progress-${goal._id}`}
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder={goal.currentValue.toString()}
                            value={progressValue[goal._id] || ''}
                            onChange={(e) => handleProgressChange(goal._id, e.target.value)}
                            className="block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="primary"
                            disabled={updateLoading}
                            onClick={() => handleProgressUpdate(goal)}
                          >
                            {updateLoading ? 'Updating...' : 'Update'}
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => handleRequestDelete(goal._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      {/* Delete confirmation */}
                      {confirmDelete === goal._id && (
                        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded">
                          <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                            Are you sure you want to delete this goal? This action cannot be undone.
                          </p>
                          <div className="flex space-x-2 justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelDelete}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              disabled={updateLoading}
                              onClick={() => handleConfirmDelete(goal._id)}
                            >
                              {updateLoading ? 'Deleting...' : 'Delete'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Completed Goals ({completedGoals.length})
          </h3>
          
          <div className="space-y-2">
            {completedGoals.map(goal => (
              <div 
                key={goal._id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      {getGoalTitle(goal)}
                    </h4>
                  </div>
                  <div className="mt-2 sm:mt-0 text-sm text-gray-500 dark:text-gray-400">
                    Completed on {format(new Date(goal.updatedAt), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Abandoned Goals */}
      {abandonedGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
            Abandoned Goals ({abandonedGoals.length})
          </h3>
          
          <div className="space-y-2">
            {abandonedGoals.map(goal => (
              <div 
                key={goal._id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 opacity-75 p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="text-base font-medium text-gray-700 dark:text-gray-300">
                    {getGoalTitle(goal)}
                  </h4>
                  <div className="mt-2 sm:mt-0 text-sm text-gray-500 dark:text-gray-400">
                    Abandoned on {format(new Date(goal.updatedAt), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalList;