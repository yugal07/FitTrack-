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
  const [scheduledWorkoutsLoading, setScheduledWorkoutsLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const [nutritionData, setNutritionData] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel for better performance
        const [
          workoutStatsRes,
          recentWorkoutsRes,
          goalsRes,
          nutritionRes,
          measurementsRes,
          scheduledWorkoutsRes
        ] = await Promise.all([
          // Fetch workout stats
          api.get('/api/workout-sessions/stats'),
          
          // Fetch recent workouts
          api.get('/api/workout-sessions?limit=5'),
          
          // Fetch goals
          api.get('/api/goals'),
          
          // Fetch nutrition data for today
          api.get(`/api/nutrition/logs?startDate=${new Date().toISOString().split('T')[0]}&endDate=${new Date().toISOString().split('T')[0]}`),
          
          // Fetch recent measurements
          api.get('/api/profiles/measurements'),
          
          // Fetch upcoming scheduled workouts
          api.get('/api/scheduled-workouts?limit=3&completed=false')
        ]);

        // Set workout stats
        setStats({
          totalWorkouts: workoutStatsRes.data.data.totalWorkouts || 0,
          totalCaloriesBurned: workoutStatsRes.data.data.totalCalories || 0,
          completedGoals: goalsRes.data.data.filter(goal => goal.status === 'completed').length || 0,
          averageWorkoutDuration: workoutStatsRes.data.data.avgDuration || 0,
        });

        // Set other data
        setRecentWorkouts(recentWorkoutsRes.data.data || []);
        setGoals(goalsRes.data.data || []);
        setNutritionData(nutritionRes.data.data[0] || null);
        setMeasurements(measurementsRes.data.data.slice(-3) || []);
        setUpcomingWorkouts(scheduledWorkoutsRes.data.data || []);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
        setScheduledWorkoutsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Remove any dependencies to prevent infinite loops

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {currentUser?.firstName}!
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Here's an overview of your fitness journey.
        </p>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Workouts"
          value={stats.totalWorkouts}
          icon="Dumbbell"
          trend={stats.totalWorkouts > 10 ? 'up' : null}
        />
        <StatCard
          title="Calories Burned"
          value={`${stats.totalCaloriesBurned.toLocaleString()} kcal`}
          icon="Flame"
          trend="up"
        />
        <StatCard
          title="Completed Goals"
          value={stats.completedGoals}
          icon="Target"
          trend={stats.completedGoals > 0 ? 'up' : null}
        />
        <StatCard
          title="Avg Workout Time"
          value={`${Math.round(stats.averageWorkoutDuration)} min`}
          icon="Clock"
          trend={stats.averageWorkoutDuration > 30 ? 'up' : null}
        />
      </div>

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity timeline */}
          <ActivityTimeline recentWorkouts={recentWorkouts} />

          {/* Goal progress */}
          <GoalProgress goals={goals} />

          {/* Workout suggestion - moved here for better layout */}
          <WorkoutSuggestion fitnessLevel={currentUser?.fitnessLevel} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Upcoming workouts - single instance with real data */}
          <UpcomingWorkouts
            workouts={upcomingWorkouts}
            isLoading={scheduledWorkoutsLoading}
          />

          {/* Nutrition summary */}
          <NutritionSummary nutritionData={nutritionData} />

          {/* Recent measurements */}
          <RecentMeasurements measurements={measurements} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;