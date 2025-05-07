// src/components/goals/GoalStatistics.jsx
import { useEffect, useState } from 'react';
import Card from '../ui/Card';

const GoalStatistics = ({ goals, loading }) => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    abandoned: 0,
    completionRate: 0,
    averageProgress: 0,
    daysUntilClosest: null,
    closestGoal: null
  });

  useEffect(() => {
    if (!loading && goals.length > 0) {
      calculateStats();
    }
  }, [goals, loading]);

  const calculateStats = () => {
    // Count goals by status
    const active = goals.filter(goal => goal.status === 'active').length;
    const completed = goals.filter(goal => goal.status === 'completed').length;
    const abandoned = goals.filter(goal => goal.status === 'abandoned').length;
    const total = goals.length;

    // Calculate completion rate
    const completionRate = total > 0 
      ? Math.round((completed / total) * 100) 
      : 0;

    // Calculate average progress for active goals
    const activeGoals = goals.filter(goal => goal.status === 'active');
    const totalProgress = activeGoals.reduce((sum, goal) => {
      const progress = (goal.currentValue / goal.targetValue) * 100;
      return sum + progress;
    }, 0);
    const averageProgress = activeGoals.length > 0 
      ? Math.round(totalProgress / activeGoals.length) 
      : 0;

    // Find closest goal (by days remaining)
    let closestGoal = null;
    let daysUntilClosest = null;

    if (activeGoals.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const goalWithDaysLeft = activeGoals.map(goal => {
        const targetDate = new Date(goal.targetDate);
        const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
        return { ...goal, daysLeft };
      });

      // Sort by days left (ascending)
      goalWithDaysLeft.sort((a, b) => a.daysLeft - b.daysLeft);
      closestGoal = goalWithDaysLeft[0];
      daysUntilClosest = closestGoal.daysLeft;
    }

    setStats({
      total,
      active,
      completed,
      abandoned,
      completionRate,
      averageProgress,
      daysUntilClosest,
      closestGoal
    });
  };

  // Render loading state
  if (loading) {
    return (
      <Card title="Goal Statistics" subtitle="Loading your goal statistics...">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </Card>
    );
  }

  // Render empty state
  if (goals.length === 0) {
    return (
      <Card title="Goal Statistics" subtitle="Start creating goals to see your statistics">
        <div className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No goal data available yet</p>
        </div>
      </Card>
    );
  }

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'abandoned':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <Card title="Goal Statistics" subtitle="Overview of your goals and progress">
      <div className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Completion rate */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</h3>
            <div className="mt-2 flex items-center">
              <div className="relative w-16 h-16">
                {/* Progress circle */}
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  {/* Background circle */}
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="16" 
                    fill="none" 
                    className="stroke-current text-gray-200 dark:text-gray-700" 
                    strokeWidth="2" 
                  />
                  {/* Progress circle */}
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="16" 
                    fill="none" 
                    className="stroke-current text-indigo-600" 
                    strokeWidth="2" 
                    strokeDasharray="100" 
                    strokeDashoffset={100 - stats.completionRate}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                  {/* Percentage text */}
                  <text 
                    x="18" 
                    y="19" 
                    className="fill-current text-gray-800 dark:text-white text-xs font-bold" 
                    textAnchor="middle"
                  >
                    {stats.completionRate}%
                  </text>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed} / {stats.total}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Goals Completed</p>
              </div>
            </div>
          </div>

          {/* Status breakdown */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status Breakdown</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 ${getStatusColor('active')} rounded-full mr-2`}></span>
                <span className="text-sm text-gray-600 dark:text-gray-300">Active</span>
                <span className="ml-auto text-gray-900 dark:text-white font-medium">{stats.active}</span>
              </div>
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 ${getStatusColor('completed')} rounded-full mr-2`}></span>
                <span className="text-sm text-gray-600 dark:text-gray-300">Completed</span>
                <span className="ml-auto text-gray-900 dark:text-white font-medium">{stats.completed}</span>
              </div>
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 ${getStatusColor('abandoned')} rounded-full mr-2`}></span>
                <span className="text-sm text-gray-600 dark:text-gray-300">Abandoned</span>
                <span className="ml-auto text-gray-900 dark:text-white font-medium">{stats.abandoned}</span>
              </div>
            </div>
          </div>

          {/* Average Progress */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Progress</h3>
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-300">Active Goals</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.averageProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                  style={{ width: `${stats.averageProgress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Average completion across all active goals
              </p>
            </div>
          </div>

          {/* Upcoming Goal */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Deadline</h3>
            {stats.closestGoal ? (
              <div className="mt-2">
                <div className="flex items-center mb-1">
                  <div className={`w-2 h-2 ${stats.daysUntilClosest <= 7 ? 'bg-red-500' : 'bg-yellow-500'} rounded-full mr-2`}></div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {stats.daysUntilClosest <= 0 
                      ? 'Due today!' 
                      : stats.daysUntilClosest === 1 
                      ? '1 day left' 
                      : `${stats.daysUntilClosest} days left`}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {getGoalTypeLabel(stats.closestGoal.type)}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, Math.round((stats.closestGoal.currentValue / stats.closestGoal.targetValue) * 100))}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {stats.closestGoal.currentValue} / {stats.closestGoal.targetValue} {stats.closestGoal.unit}
                </p>
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No upcoming deadlines
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Helper function to get a human-readable goal type
const getGoalTypeLabel = (type) => {
  switch (type) {
    case 'weight':
      return 'Weight Goal';
    case 'strength':
      return 'Strength Goal';
    case 'endurance':
      return 'Endurance Goal';
    case 'habit':
      return 'Habit Goal';
    case 'nutrition':
      return 'Nutrition Goal';
    case 'custom':
      return 'Custom Goal';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export default GoalStatistics;