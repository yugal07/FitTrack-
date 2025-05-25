import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { apiWithToast } from '../../utils/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  LineChart,
  ReferenceLine,
} from 'recharts';

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
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 30);
          break;
        case '3months':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 90);
          break;
        default:
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 7);
      }

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(today);

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

  // Helper function to format date as YYYY-MM-DD
  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to format date for display
  const formatDisplayDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  };

  // Chart colors
  const MACRO_COLORS = ['#3b82f6', '#f59e0b', '#ef4444']; // blue, yellow, red for protein, carbs, fat
  const MEAL_COLORS = ['#f59e0b', '#10b981', '#8b5cf6', '#3b82f6']; // yellow, green, purple, blue for breakfast, lunch, dinner, snack
  const CALORIE_COLOR = '#6366f1'; // indigo

  // Function to prepare macro distribution data for pie chart
  const prepareMacroData = () => {
    if (!stats || !stats.macroDistribution) return [];

    const { protein, carbs, fat } = stats.macroDistribution;

    return [
      { name: 'Protein', value: protein || 0, color: MACRO_COLORS[0] },
      { name: 'Carbs', value: carbs || 0, color: MACRO_COLORS[1] },
      { name: 'Fat', value: fat || 0, color: MACRO_COLORS[2] },
    ];
  };

  // Function to prepare calories trend data for bar chart
  const prepareCaloriesTrendData = () => {
    if (!stats || !stats.caloriesTrend || stats.caloriesTrend.length === 0)
      return [];

    // Sort by date and get the last 7 or fewer entries
    return [...stats.caloriesTrend]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7)
      .map(day => ({
        name: formatDisplayDate(day.date),
        calories: day.calories || 0,
      }));
  };

  // Function to prepare meal type distribution data for charts
  const prepareMealTypeData = () => {
    if (
      !stats ||
      !stats.mealTypeDistribution ||
      stats.mealTypeDistribution.length === 0
    )
      return [];

    const mealOrder = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };

    // Sort by meal type to ensure consistent ordering
    return [...stats.mealTypeDistribution]
      .sort((a, b) => mealOrder[a._id] - mealOrder[b._id])
      .map((meal, index) => ({
        name: meal._id.charAt(0).toUpperCase() + meal._id.slice(1),
        count: meal.count || 0,
        avgCalories: Math.round(meal.avgCalories || 0),
        color: MEAL_COLORS[index % MEAL_COLORS.length],
      }));
  };

  // Custom label for the pie chart - fixed positioning
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    // Only show label if percentage is significant enough (>5%)
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    // Position label closer to the center to keep it within bounds
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor='middle'
        dominantBaseline='central'
        fontSize={12}
        fontWeight='bold'
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Function to render macro distribution pie chart
  const renderMacroChart = () => {
    if (!stats || !stats.macroDistribution) return null;

    const data = prepareMacroData();
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className='mt-4'>
        <h3 className='text-md font-medium text-gray-800 dark:text-gray-200 mb-3'>
          Macronutrient Distribution
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='h-64 flex items-center justify-center'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={data}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={40}
                  dataKey='value'
                  label={renderCustomizedLabel}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={value => [`${value}g`, 'Amount']}
                  labelFormatter={name => `${name}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className='grid grid-cols-3 gap-4 text-center'>
            {data.map((item, index) => (
              <div
                key={index}
                className='p-3 bg-white dark:bg-gray-800 rounded-lg shadow'
              >
                <div className='flex items-center justify-center mb-1'>
                  <div
                    className='w-3 h-3 rounded-full mr-1'
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    {item.name}
                  </span>
                </div>
                <div
                  className='text-lg font-bold'
                  style={{ color: item.color }}
                >
                  {Math.round(item.value)}g
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  {total > 0 ? Math.round((item.value / total) * 100) : 0}% of
                  total
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Function to render calories trend chart
  const renderCaloriesTrend = () => {
    if (!stats || !stats.caloriesTrend || stats.caloriesTrend.length === 0)
      return null;

    const data = prepareCaloriesTrendData();

    return (
      <div className='mt-8'>
        <h3 className='text-md font-medium text-gray-800 dark:text-gray-200 mb-3'>
          Calorie Intake Trend
        </h3>

        <div className='h-64 mt-4'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip formatter={value => [`${value} kcal`, 'Calories']} />
              <Legend />
              <Bar dataKey='calories' fill={CALORIE_COLOR} name='Calories' />
              <ReferenceLine
                y={2000}
                stroke='#22c55e'
                strokeDasharray='5 5'
                label='Target: 2000 kcal'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Function to render meal type distribution charts
  const renderMealTypeDistribution = () => {
    if (
      !stats ||
      !stats.mealTypeDistribution ||
      stats.mealTypeDistribution.length === 0
    )
      return null;

    const data = prepareMealTypeData();

    return (
      <div className='mt-8'>
        <h3 className='text-md font-medium text-gray-800 dark:text-gray-200 mb-3'>
          Meal Type Analysis
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Meal Frequency Chart */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
            <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Meal Frequency
            </h4>
            <div className='h-56'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={data}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    outerRadius={70}
                    dataKey='count'
                    nameKey='name'
                    label={renderCustomizedLabel}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={value => [`${value} meals`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Calories by Meal Chart */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
            <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Average Calories by Meal
            </h4>
            <div className='h-56'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip formatter={value => [`${value} kcal`, 'Calories']} />
                  <Legend />
                  <Bar dataKey='avgCalories' name='Avg Calories'>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
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
