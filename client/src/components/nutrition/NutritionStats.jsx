import { useState, useEffect } from 'react';
import { format, subDays, startOfWeek, startOfMonth } from 'date-fns';
import { useToast } from '../../contexts/ToastContext';
import { apiWithToast } from '../../utils/api';
import Card from '../ui/Card';
import Button from '../ui/Button';

const NutritionStats = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get toast functions
  const toast = useToast();
  // Get toast-enabled API
  const api = apiWithToast(toast);

  useEffect(() => {
    fetchStats();
  }, [timeframe]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Calculate date range based on selected timeframe
      const today = new Date();
      let startDate;

      switch (timeframe) {
        case 'week':
          startDate = subDays(today, 7);
          break;
        case 'month':
          startDate = subDays(today, 30);
          break;
        case '3months':
          startDate = subDays(today, 90);
          break;
        default:
          startDate = subDays(today, 7);
      }

      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(today, 'yyyy-MM-dd');

      const response = await api.get('/api/nutrition/stats', {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      });

      setStats(response.data.data);
    } catch (err) {
      // Error is handled by the API interceptor
      console.error('Error fetching nutrition stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to render macro distribution chart
  const renderMacroChart = () => {
    if (!stats || !stats.macroDistribution) return null;

    const { protein, carbs, fat } = stats.macroDistribution;
    const total = protein + carbs + fat;

    const proteinPercent = Math.round((protein / total) * 100) || 0;
    const carbsPercent = Math.round((carbs / total) * 100) || 0;
    const fatPercent = Math.round((fat / total) * 100) || 0;

    return (
      <div className='mt-4'>
        <h3 className='text-md font-medium text-gray-800 dark:text-gray-200 mb-3'>
          Macronutrient Distribution
        </h3>

        {/* Visual percentage bars */}
        <div className='flex h-8 w-full rounded-lg overflow-hidden shadow-inner mb-2'>
          <div
            className='bg-blue-500 transition-all duration-300 ease-in-out relative group'
            style={{ width: `${proteinPercent}%` }}
          >
            <div className='absolute inset-0 flex items-center justify-center text-white text-xs font-bold'>
              {proteinPercent}%
            </div>
          </div>
          <div
            className='bg-yellow-500 transition-all duration-300 ease-in-out relative group'
            style={{ width: `${carbsPercent}%` }}
          >
            <div className='absolute inset-0 flex items-center justify-center text-white text-xs font-bold'>
              {carbsPercent}%
            </div>
          </div>
          <div
            className='bg-red-500 transition-all duration-300 ease-in-out relative group'
            style={{ width: `${fatPercent}%` }}
          >
            <div className='absolute inset-0 flex items-center justify-center text-white text-xs font-bold'>
              {fatPercent}%
            </div>
          </div>
        </div>

        {/* Legend and actual grams */}
        <div className='grid grid-cols-3 gap-4 text-center mt-4'>
          <div className='p-3 bg-white dark:bg-gray-800 rounded-lg shadow'>
            <div className='flex items-center justify-center mb-1'>
              <div className='w-3 h-3 bg-blue-500 rounded-full mr-1'></div>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Protein
              </span>
            </div>
            <div className='text-lg font-bold text-blue-600 dark:text-blue-400'>
              {Math.round(protein)}g
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              {proteinPercent}% of total
            </div>
          </div>
          <div className='p-3 bg-white dark:bg-gray-800 rounded-lg shadow'>
            <div className='flex items-center justify-center mb-1'>
              <div className='w-3 h-3 bg-yellow-500 rounded-full mr-1'></div>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Carbs
              </span>
            </div>
            <div className='text-lg font-bold text-yellow-600 dark:text-yellow-400'>
              {Math.round(carbs)}g
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              {carbsPercent}% of total
            </div>
          </div>
          <div className='p-3 bg-white dark:bg-gray-800 rounded-lg shadow'>
            <div className='flex items-center justify-center mb-1'>
              <div className='w-3 h-3 bg-red-500 rounded-full mr-1'></div>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Fat
              </span>
            </div>
            <div className='text-lg font-bold text-red-600 dark:text-red-400'>
              {Math.round(fat)}g
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              {fatPercent}% of total
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Function to render calories trend chart
  const renderCaloriesTrend = () => {
    if (!stats || !stats.caloriesTrend || stats.caloriesTrend.length === 0)
      return null;

    // Sort by date and get the last 7 or fewer entries
    const sortedData = [...stats.caloriesTrend]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7);

    const maxCalories = Math.max(...sortedData.map(d => d.calories || 0), 2000);

    return (
      <div className='mt-8'>
        <h3 className='text-md font-medium text-gray-800 dark:text-gray-200 mb-3'>
          Calorie Intake Trend
        </h3>

        <div className='relative h-64 mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-hidden'>
          {/* Y-axis labels */}
          <div className='absolute inset-y-4 left-0 w-12 flex flex-col justify-between'>
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              {maxCalories}
            </span>
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              {Math.round(maxCalories / 2)}
            </span>
            <span className='text-xs text-gray-500 dark:text-gray-400'>0</span>
          </div>

          {/* Chart area */}
          <div className='absolute inset-y-4 left-12 right-4 flex items-end justify-around'>
            {sortedData.map((day, index) => {
              const height = day.calories
                ? (day.calories / maxCalories) * 100
                : 0;
              const date = new Date(day.date);
              const dayLabel = format(date, 'd');
              const monthLabel =
                index === 0 || dayLabel === '1' ? format(date, 'MMM') : '';

              return (
                <div
                  key={day.date}
                  className='flex flex-col items-center w-full max-w-20'
                >
                  <div className='relative w-full flex justify-center'>
                    <div
                      className='w-12 bg-gradient-to-t from-indigo-500 to-blue-500 rounded-t-md'
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <div className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                    {dayLabel}
                  </div>
                  {monthLabel && (
                    <div className='text-xs font-medium text-gray-700 dark:text-gray-300'>
                      {monthLabel}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Target calorie line */}
          <div
            className='absolute left-12 right-4 border-t-2 border-dashed border-green-500 dark:border-green-400 flex items-center justify-end'
            style={{
              top: `${Math.max(10, 100 - (2000 / maxCalories) * 100)}%`,
            }}
          >
            <span className='text-xs text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 px-1'>
              Target: 2000
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Function to render meal type distribution
  const renderMealTypeDistribution = () => {
    if (
      !stats ||
      !stats.mealTypeDistribution ||
      stats.mealTypeDistribution.length === 0
    )
      return null;

    return (
      <div className='mt-8'>
        <h3 className='text-md font-medium text-gray-800 dark:text-gray-200 mb-3'>
          Meal Type Analysis
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
            <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Meal Frequency
            </h4>
            <div className='space-y-3'>
              {stats.mealTypeDistribution.map(meal => {
                const percentage =
                  (meal.count /
                    stats.mealTypeDistribution.reduce(
                      (sum, m) => sum + m.count,
                      0
                    )) *
                  100;

                return (
                  <div key={meal._id} className='relative'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-sm capitalize text-gray-700 dark:text-gray-300'>
                        {meal._id}
                      </span>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        {meal.count} meals
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                      <div
                        className={`h-full rounded-full ${getMealColor(meal._id)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
            <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Average Calories by Meal
            </h4>
            <div className='space-y-3'>
              {stats.mealTypeDistribution.map(meal => {
                const maxCalories = Math.max(
                  ...stats.mealTypeDistribution.map(m => m.avgCalories || 0)
                );
                const percentage =
                  maxCalories > 0 ? (meal.avgCalories / maxCalories) * 100 : 0;

                return (
                  <div key={meal._id} className='relative'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-sm capitalize text-gray-700 dark:text-gray-300'>
                        {meal._id}
                      </span>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        {Math.round(meal.avgCalories || 0)} calories
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                      <div
                        className={`h-full rounded-full ${getMealColor(meal._id, true)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper to get color for meal type
  const getMealColor = (type, gradient = false) => {
    switch (type) {
      case 'breakfast':
        return gradient
          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
          : 'bg-yellow-500';
      case 'lunch':
        return gradient
          ? 'bg-gradient-to-r from-green-400 to-green-500'
          : 'bg-green-500';
      case 'dinner':
        return gradient
          ? 'bg-gradient-to-r from-purple-400 to-purple-500'
          : 'bg-purple-500';
      case 'snack':
        return gradient
          ? 'bg-gradient-to-r from-blue-400 to-blue-500'
          : 'bg-blue-500';
      default:
        return gradient
          ? 'bg-gradient-to-r from-gray-400 to-gray-500'
          : 'bg-gray-500';
    }
  };

  // Function to render daily averages
  const renderDailyAverages = () => {
    if (!stats || !stats.dailyAverages) return null;

    const { avgCalories, avgProtein, avgCarbs, avgFat, avgWaterIntake } =
      stats.dailyAverages;

    return (
      <div className='mt-2 mb-6'>
        <h3 className='text-md font-medium text-gray-800 dark:text-gray-200 mb-3'>
          Daily Averages
        </h3>

        <div className='grid grid-cols-2 sm:grid-cols-5 gap-4'>
          <div className='bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-lg shadow p-4 text-center'>
            <span className='block text-xs uppercase tracking-wider opacity-80'>
              Calories
            </span>
            <span className='text-xl font-bold'>
              {Math.round(avgCalories || 0)}
            </span>
            <span className='text-xs block opacity-75'>kcal / day</span>
          </div>

          <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-4 text-center'>
            <span className='block text-xs uppercase tracking-wider opacity-80'>
              Protein
            </span>
            <span className='text-xl font-bold'>
              {Math.round(avgProtein || 0)}
            </span>
            <span className='text-xs block opacity-75'>g / day</span>
          </div>

          <div className='bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow p-4 text-center'>
            <span className='block text-xs uppercase tracking-wider opacity-80'>
              Carbs
            </span>
            <span className='text-xl font-bold'>
              {Math.round(avgCarbs || 0)}
            </span>
            <span className='text-xs block opacity-75'>g / day</span>
          </div>

          <div className='bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow p-4 text-center'>
            <span className='block text-xs uppercase tracking-wider opacity-80'>
              Fat
            </span>
            <span className='text-xl font-bold'>{Math.round(avgFat || 0)}</span>
            <span className='text-xs block opacity-75'>g / day</span>
          </div>

          <div className='bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-lg shadow p-4 text-center'>
            <span className='block text-xs uppercase tracking-wider opacity-80'>
              Water
            </span>
            <span className='text-xl font-bold'>
              {Math.round(avgWaterIntake || 0)}
            </span>
            <span className='text-xs block opacity-75'>ml / day</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card
      title='Nutrition Statistics'
      subtitle='Analyze your nutrition patterns over time'
    >
      {/* Timeframe selector */}
      <div className='mb-6 flex space-x-2'>
        <Button
          variant={timeframe === 'week' ? 'primary' : 'outline'}
          onClick={() => setTimeframe('week')}
        >
          Last Week
        </Button>
        <Button
          variant={timeframe === 'month' ? 'primary' : 'outline'}
          onClick={() => setTimeframe('month')}
        >
          Last Month
        </Button>
        <Button
          variant={timeframe === '3months' ? 'primary' : 'outline'}
          onClick={() => setTimeframe('3months')}
        >
          Last 3 Months
        </Button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500'></div>
          <p className='ml-2 text-gray-600 dark:text-gray-400'>
            Loading statistics...
          </p>
        </div>
      )}

      {/* No data state */}
      {!loading &&
        stats &&
        (!stats.dailyAverages ||
          !stats.macroDistribution ||
          stats.caloriesTrend?.length === 0) && (
          <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-12 w-12 mx-auto text-yellow-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <h3 className='mt-2 text-lg font-medium text-yellow-800 dark:text-yellow-200'>
              No Statistics Available
            </h3>
            <p className='mt-1 text-yellow-700 dark:text-yellow-300'>
              There's not enough nutrition data logged for the selected
              timeframe to generate statistics.
            </p>
            <p className='mt-1 text-sm text-yellow-600 dark:text-yellow-400'>
              Try selecting a longer timeframe or log more nutrition data to see
              statistics here.
            </p>
          </div>
        )}

      {/* Content when data is available */}
      {!loading && stats && stats.dailyAverages && (
        <div>
          {/* Daily averages */}
          {renderDailyAverages()}

          {/* Macro distribution */}
          {renderMacroChart()}

          {/* Calories trend */}
          {renderCaloriesTrend()}

          {/* Meal type distribution */}
          {renderMealTypeDistribution()}
        </div>
      )}
    </Card>
  );
};

export default NutritionStats;
