import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { apiWithToast } from '../../utils/api';
import Card from '../ui/Card';
import GoalList from './GoalList';
import GoalWizard from './GoalWizard';
import GoalStatistics from './GoalStatistics';
import GoalAchievement from './GoalAchievement';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievedGoal, setAchievedGoal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { currentUser } = useAuth();

  // Get toast functions
  const toast = useToast();
  // Get toast-enabled API
  const api = apiWithToast(toast);

  // Use a ref to store the previous goals state to compare for completions
  const prevGoalsRef = useRef([]);

  useEffect(() => {
    fetchGoals();
  }, [refreshKey]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/goals');
      const newGoals = response.data.data;

      // Store current goals to state
      setGoals(newGoals);

      // Check for newly completed goals by comparing with previous state
      if (prevGoalsRef.current.length > 0) {
        const previouslyActiveGoals = prevGoalsRef.current.filter(
          goal => goal.status === 'active'
        );

        // Find goals that were active before but are now completed
        const newlyCompletedGoals = newGoals.filter(
          newGoal =>
            newGoal.status === 'completed' &&
            previouslyActiveGoals.some(
              prevGoal =>
                prevGoal._id === newGoal._id && prevGoal.status === 'active'
            )
        );

        // If we found a newly completed goal, show the achievement modal
        if (newlyCompletedGoals.length > 0 && !showAchievement) {
          // Use the first newly completed goal (in case there are multiple)
          setAchievedGoal(newlyCompletedGoals[0]);
          setShowAchievement(true);
        }
      }

      // Update the previous goals ref
      prevGoalsRef.current = newGoals;
    } catch (err) {
      // Error is handled by toast API interceptor
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = () => {
    setShowWizard(true);
  };

  const handleWizardClose = () => {
    setShowWizard(false);
  };

  const handleGoalCreated = () => {
    setShowWizard(false);
    toast.success('Goal created successfully!');
    setRefreshKey(old => old + 1); // Refresh the goals list
  };

  const handleGoalUpdated = () => {
    setRefreshKey(old => old + 1); // Refresh the goals list
  };

  const handleAchievementClose = () => {
    setShowAchievement(false);
    setAchievedGoal(null);
  };

  return (
    <div className='space-y-6'>
      {/* Welcome header */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Goals & Progress
          </h1>
          <button
            onClick={handleCreateGoal}
            className='mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 mr-2'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            Create New Goal
          </button>
        </div>
        <p className='mt-1 text-gray-500 dark:text-gray-400'>
          Set and track your fitness goals to stay motivated on your journey.
        </p>
      </div>

      {/* Goal Statistics */}
      <GoalStatistics goals={goals} loading={loading} />

      {/* Goal List */}
      <Card
        title='Your Goals'
        subtitle='View and track your current fitness goals'
      >
        <GoalList
          goals={goals}
          loading={loading}
          onGoalUpdated={handleGoalUpdated}
        />
      </Card>

      {/* Goal Creation Wizard */}
      {showWizard && (
        <GoalWizard
          onClose={handleWizardClose}
          onGoalCreated={handleGoalCreated}
        />
      )}

      {/* Goal Achievement Celebration */}
      {showAchievement && achievedGoal && (
        <GoalAchievement goal={achievedGoal} onClose={handleAchievementClose} />
      )}
    </div>
  );
};

export default Goals;
