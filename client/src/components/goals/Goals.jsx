import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import Card from '../ui/Card';
import GoalList from './GoalList';
import GoalWizard from './GoalWizard';
import GoalStatistics from './GoalStatistics';
import GoalAchievement from './GoalAchievement';
import Alert from '../ui/Alert';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievedGoal, setAchievedGoal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchGoals();
  }, [refreshKey]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/goals');
      setGoals(response.data.data);
      
      // Check if any goal was just completed to show achievement
      const justCompletedGoal = response.data.data.find(
        goal => goal.status === 'completed' && 
        new Date(goal.updatedAt).getTime() > Date.now() - 60000 // completed in the last minute
      );
      
      if (justCompletedGoal && !showAchievement) {
        setAchievedGoal(justCompletedGoal);
        setShowAchievement(true);
      }
      
      setError('');
    } catch (err) {
      setError('Failed to load goals. Please try again.');
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
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Goals & Progress
          </h1>
          <button
            onClick={handleCreateGoal}
            className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Create New Goal
          </button>
        </div>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Set and track your fitness goals to stay motivated on your journey.
        </p>
      </div>

      {error && (
        <Alert 
          type="error"
          title="Error"
          message={error}
          onDismiss={() => setError('')}
        />
      )}
      
      {/* Goal Statistics */}
      <GoalStatistics goals={goals} loading={loading} />
      
      {/* Goal List */}
      <Card 
        title="Your Goals" 
        subtitle="View and track your current fitness goals"
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
        <GoalAchievement 
          goal={achievedGoal}
          onClose={handleAchievementClose}
        />
      )}
    </div>
  );
};

export default Goals;