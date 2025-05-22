import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StatCard from './StatCard';
import ActivityTimeline from './ActivityTimeline';
import UpcomingWorkouts from './UpcomingWorkouts';
import GoalProgress from './GoalProgress';
import NutritionSummary from './NutritionSummary';
import WorkoutSuggestion from './WorkoutSuggestion';
import RecentMeasurements from './RecentMeasurements';
import api from '../../utils/api';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCaloriesBurned: 0,
    completedGoals: 0,
    averageWorkoutDuration: 0,
  });
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [upcomingWorkouts, setUpcomingWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [nutritionData, setNutritionData] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch workout stats
        const workoutStatsRes = await api.get('/api/workout-sessions/stats');

        // Fetch recent workouts
        const recentWorkoutsRes = await api.get(
          '/api/workout-sessions?limit=5'
        );

        // Fetch goals
        const goalsRes = await api.get('/api/goals');

        // Fetch nutrition data for today
        const today = new Date().toISOString().split('T')[0];
        const nutritionRes = await api.get(
          `/api/nutrition/logs?startDate=${today}&endDate=${today}`
        );

        // Fetch recent measurements
        const measurementsRes = await api.get('/api/profiles/measurements');

        // Set the data
        setStats({
          totalWorkouts: workoutStatsRes.data.data.totalWorkouts || 0,
          totalCaloriesBurned: workoutStatsRes.data.data.totalCalories || 0,
          completedGoals:
            goalsRes.data.data.filter(goal => goal.status === 'completed')
              .length || 0,
          averageWorkoutDuration: workoutStatsRes.data.data.avgDuration || 0,
        });

        setRecentWorkouts(recentWorkoutsRes.data.data || []);

        // Mock upcoming workouts for now
        // In a real implementation, this would come from scheduled workouts
        setUpcomingWorkouts([
          {
            id: 1,
            name: 'Strength Training',
            scheduledFor: new Date(Date.now() + 86400000),
          },
          {
            id: 2,
            name: 'HIIT Cardio',
            scheduledFor: new Date(Date.now() + 86400000 * 3),
          },
        ]);

        setGoals(goalsRes.data.data || []);

        setNutritionData(nutritionRes.data.data[0] || null);

        setMeasurements(measurementsRes.data.data.slice(-3) || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto'></div>
          <p className='mt-3 text-sm text-gray-600 dark:text-gray-400'>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Welcome message */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Welcome back, {currentUser?.firstName}!
        </h1>
        <p className='mt-1 text-gray-500 dark:text-gray-400'>
          Here's an overview of your fitness journey.
        </p>
      </div>

      {/* Stats section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          title='Total Workouts'
          value={stats.totalWorkouts}
          icon='Dumbbell'
          trend={stats.totalWorkouts > 10 ? 'up' : null}
        />
        <StatCard
          title='Calories Burned'
          value={`${stats.totalCaloriesBurned.toLocaleString()} kcal`}
          icon='Flame'
          trend='up'
        />
        <StatCard
          title='Completed Goals'
          value={stats.completedGoals}
          icon='Target'
          trend={stats.completedGoals > 0 ? 'up' : null}
        />
        <StatCard
          title='Avg Workout Time'
          value={`${Math.round(stats.averageWorkoutDuration)} min`}
          icon='Clock'
          trend={stats.averageWorkoutDuration > 30 ? 'up' : null}
        />
      </div>

      {/* Main dashboard content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left column */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Activity timeline */}
          <ActivityTimeline recentWorkouts={recentWorkouts} />

          {/* Goal progress */}
          <GoalProgress goals={goals} />
        </div>

        {/* Right column */}
        <div className='space-y-6'>
          {/* Upcoming workouts */}
          <UpcomingWorkouts workouts={upcomingWorkouts} />

          {/* Nutrition summary */}
          <NutritionSummary nutritionData={nutritionData} />

          {/* Recent measurements */}
          <RecentMeasurements measurements={measurements} />
        </div>
      </div>

      {/* Workout suggestion */}
      <WorkoutSuggestion fitnessLevel={currentUser?.fitnessLevel} />
    </div>
  );
};

export default Dashboard;
