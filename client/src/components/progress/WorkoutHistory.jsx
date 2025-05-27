import React, { useState, useEffect } from 'react';
import {
  format,
  parseISO,
  subMonths,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import Card from '../ui/Card';
import api from '../../utils/api';
import WorkoutCalendarView from './charts/WorkoutCalendarView';
import WorkoutMetricsChart from './charts/WorkoutMetricsChart';

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('6m'); // Default to 6 months
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'chart'
  const [selectedMetric, setSelectedMetric] = useState('duration');

  useEffect(() => {
    fetchWorkoutHistory();
  }, [dateRange]);

  const fetchWorkoutHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/workout-sessions');

      // Filter workouts based on the selected date range
      const now = new Date();
      let filteredWorkouts = response.data.data;

      if (dateRange === '1m') {
        filteredWorkouts = response.data.data.filter(
          w => new Date(w.date) >= subMonths(now, 1)
        );
      } else if (dateRange === '3m') {
        filteredWorkouts = response.data.data.filter(
          w => new Date(w.date) >= subMonths(now, 3)
        );
      } else if (dateRange === '6m') {
        filteredWorkouts = response.data.data.filter(
          w => new Date(w.date) >= subMonths(now, 6)
        );
      } else if (dateRange === '1y') {
        filteredWorkouts = response.data.data.filter(
          w => new Date(w.date) >= subMonths(now, 12)
        );
      }

      // Sort workouts by date (newest first for display)
      const sortedWorkouts = filteredWorkouts.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setWorkouts(sortedWorkouts);
      setError('');
    } catch (err) {
      console.error('Error fetching workout history:', err);
      setError('Failed to load workout history');
    } finally {
      setLoading(false);
    }
  };

  const getWorkoutStats = () => {
    if (workouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        totalCalories: 0,
        avgDuration: 0,
        avgCalories: 0,
        bestStreak: 0,
        currentStreak: 0,
      };
    }

    // Calculate total duration and calories
    const totalDuration = workouts.reduce(
      (sum, workout) => sum + (workout.duration || 0),
      0
    );
    const totalCalories = workouts.reduce(
      (sum, workout) => sum + (workout.caloriesBurned || 0),
      0
    );

    // Calculate averages
    const avgDuration = totalDuration / workouts.length;
    const avgCalories = totalCalories / workouts.length;

    // Calculate streaks
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    // Group workouts by date (to handle multiple workouts on the same day)
    const workoutDates = [
      ...new Set(workouts.map(w => format(new Date(w.date), 'yyyy-MM-dd'))),
    ].sort();

    if (workoutDates.length > 0) {
      // Calculate best streak
      for (let i = 0; i < workoutDates.length; i++) {
        const currentDate = parseISO(workoutDates[i]);

        if (i === 0) {
          tempStreak = 1;
        } else {
          const prevDate = parseISO(workoutDates[i - 1]);
          const diffDays = Math.round(
            (currentDate - prevDate) / (1000 * 60 * 60 * 24)
          );

          if (diffDays === 1) {
            tempStreak++;
          } else {
            if (tempStreak > bestStreak) {
              bestStreak = tempStreak;
            }
            tempStreak = 1;
          }
        }
      }

      // Update best streak if the last temp streak is higher
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }

      // Calculate current streak (consecutive days including today)
      const today = format(new Date(), 'yyyy-MM-dd');
      const lastWorkoutDate = workoutDates[workoutDates.length - 1];

      if (lastWorkoutDate === today) {
        currentStreak = 1;

        for (let i = workoutDates.length - 2; i >= 0; i--) {
          const currentDate = parseISO(workoutDates[i]);
          const nextDate = parseISO(workoutDates[i + 1]);
          const diffDays = Math.round(
            (nextDate - currentDate) / (1000 * 60 * 60 * 24)
          );

          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    return {
      totalWorkouts: workouts.length,
      totalDuration,
      totalCalories,
      avgDuration,
      avgCalories,
      bestStreak,
      currentStreak,
    };
  };

  // Group workouts by month for calendar view
  const groupWorkoutsByMonth = () => {
    const grouped = {};

    workouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      const monthKey = format(workoutDate, 'yyyy-MM');

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          month: format(workoutDate, 'MMMM yyyy'),
          days: {},
        };
      }

      const dayKey = format(workoutDate, 'd');

      if (!grouped[monthKey].days[dayKey]) {
        grouped[monthKey].days[dayKey] = [];
      }

      grouped[monthKey].days[dayKey].push(workout);
    });

    return Object.values(grouped).sort((a, b) => {
      const monthA = new Date(a.month);
      const monthB = new Date(b.month);
      return monthB - monthA; // Sort newest first
    });
  };

  // Prepare data for metrics chart
  const getChartData = () => {
    // Group workouts by week
    const groupedData = {};

    workouts.forEach(workout => {
      const date = new Date(workout.date);
      // Use ISO week as the key (year + week number)
      const weekKey = format(date, 'yyyy-ww');

      if (!groupedData[weekKey]) {
        groupedData[weekKey] = {
          weekLabel: `Week of ${format(date, 'MMM d')}`,
          duration: 0,
          caloriesBurned: 0,
          count: 0,
        };
      }

      groupedData[weekKey].duration += workout.duration || 0;
      groupedData[weekKey].caloriesBurned += workout.caloriesBurned || 0;
      groupedData[weekKey].count += 1;
    });

    // Convert to array and sort by date
    return Object.values(groupedData).sort((a, b) => {
      const weekA = new Date(a.weekLabel.replace('Week of ', ''));
      const weekB = new Date(b.weekLabel.replace('Week of ', ''));
      return weekA - weekB;
    });
  };

  const stats = getWorkoutStats();
  const monthlyWorkouts = groupWorkoutsByMonth();
  const chartData = getChartData();

  return (
    <div className='space-y-6'>
      <Card
        title='Workout History'
        subtitle='Track your workout consistency and performance'
      >
        <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0'>
          {/* Date range selector */}
          <div className='flex items-center space-x-2'>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              Time period:
            </span>
            <div className='inline-flex rounded-md shadow-sm'>
              <button
                onClick={() => setDateRange('1m')}
                className={`px-3 py-1.5 text-xs font-medium rounded-l-md border ${
                  dateRange === '1m'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                1M
              </button>
              <button
                onClick={() => setDateRange('3m')}
                className={`px-3 py-1.5 text-xs font-medium border-t border-b ${
                  dateRange === '3m'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                3M
              </button>
              <button
                onClick={() => setDateRange('6m')}
                className={`px-3 py-1.5 text-xs font-medium border-t border-b ${
                  dateRange === '6m'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                6M
              </button>
              <button
                onClick={() => setDateRange('1y')}
                className={`px-3 py-1.5 text-xs font-medium rounded-r-md border ${
                  dateRange === '1y'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                1Y
              </button>
            </div>
          </div>

          {/* View selector */}
          <div className='flex items-center space-x-2'>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              View:
            </span>
            <div className='inline-flex rounded-md shadow-sm'>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 text-xs font-medium rounded-l-md border ${
                  viewMode === 'calendar'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`px-3 py-1.5 text-xs font-medium rounded-r-md border ${
                  viewMode === 'chart'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                Chart
              </button>
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm'>
            <div className='text-xs font-medium text-gray-500 dark:text-gray-400'>
              Total Workouts
            </div>
            <div className='mt-1 text-xl font-bold text-gray-900 dark:text-white'>
              {stats.totalWorkouts}
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm'>
            <div className='text-xs font-medium text-gray-500 dark:text-gray-400'>
              Avg Duration
            </div>
            <div className='mt-1 text-xl font-bold text-gray-900 dark:text-white'>
              {Math.round(stats.avgDuration)} min
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm'>
            <div className='text-xs font-medium text-gray-500 dark:text-gray-400'>
              Total Calories
            </div>
            <div className='mt-1 text-xl font-bold text-gray-900 dark:text-white'>
              {Math.round(stats.totalCalories)} kcal
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm'>
            <div className='text-xs font-medium text-gray-500 dark:text-gray-400'>
              Best Streak
            </div>
            <div className='mt-1 text-xl font-bold text-gray-900 dark:text-white'>
              {stats.bestStreak} days
            </div>
          </div>
        </div>

        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
          </div>
        ) : error ? (
          <div className='flex items-center justify-center h-64 text-red-600 dark:text-red-400'>
            {error}
          </div>
        ) : workouts.length === 0 ? (
          <div className='flex items-center justify-center h-64 text-gray-500 dark:text-gray-400'>
            No workout data available for the selected period
          </div>
        ) : viewMode === 'calendar' ? (
          <div className='space-y-8'>
            {monthlyWorkouts.map((monthData, index) => (
              <WorkoutCalendarView key={index} monthData={monthData} />
            ))}
          </div>
        ) : (
          <div className='space-y-6'>
            <div className='flex flex-wrap justify-end gap-3 mb-2'>
              <button
                onClick={() => setSelectedMetric('duration')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  selectedMetric === 'duration'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Duration
              </button>
              <button
                onClick={() => setSelectedMetric('caloriesBurned')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  selectedMetric === 'caloriesBurned'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Calories
              </button>
              <button
                onClick={() => setSelectedMetric('count')}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  selectedMetric === 'count'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Count
              </button>
            </div>

            <div className='h-80 w-full'>
              <WorkoutMetricsChart data={chartData} metric={selectedMetric} />
            </div>

            <div className='mt-8'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                Recent Workouts
              </h3>

              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                  <thead className='bg-gray-50 dark:bg-gray-800'>
                    <tr>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                      >
                        Date
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                      >
                        Workout
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                      >
                        Duration
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                      >
                        Calories
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                      >
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                    {workouts.slice(0, 10).map(workout => (
                      <tr key={workout._id}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                          {format(new Date(workout.date), 'MMM d, yyyy')}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                          {workout.workoutId?.name || 'Unknown workout'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                          {workout.duration} min
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                          {workout.caloriesBurned} kcal
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${
                                  i < workout.rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                              >
                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                              </svg>
                            ))}
                            <span className='ml-1 text-xs text-gray-500 dark:text-gray-400'>
                              {workout.rating || 0}/5
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WorkoutHistory;
