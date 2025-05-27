import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { apiWithToast } from '../../utils/api';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const NutritionGoals = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('daily');
  const [isEditing, setIsEditing] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [progressLoading, setProgressLoading] = useState(false);

  // Get toast functions
  const toast = useToast();
  // Get toast-enabled API
  const api = apiWithToast(toast);

  // Goals state - now fetched from API
  const [goals, setGoals] = useState({
    daily: {
      calories: 2000,
      protein: 120,
      carbs: 250,
      fat: 65,
      fiber: 30,
      sugar: 50,
      sodium: 2300,
      water: 2500,
      vitaminC: 75,
      calcium: 1000,
      iron: 18,
    },
    weekly: {
      calories: 14000,
      protein: 840,
      carbs: 1750,
      fat: 455,
      fiber: 210,
      sugar: 350,
      sodium: 16100,
      water: 17500,
      vitaminC: 525,
      calcium: 7000,
      iron: 126,
    },
  });

  // Form data for editing
  const [formData, setFormData] = useState({ ...goals.daily });

  // Current progress - now fetched from API
  const [progress, setProgress] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    water: 0,
    vitaminC: 0,
    calcium: 0,
    iron: 0,
  });

  // Goal types/plans with descriptions
  const goalTypes = [
    {
      id: 'weightLoss',
      name: 'Weight Loss',
      description:
        'Lower calorie intake with higher protein to preserve muscle mass',
      macros: { calories: 1800, protein: 130, carbs: 180, fat: 60 },
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      description:
        'Balanced macros to maintain your current weight and support activity',
      macros: { calories: 2000, protein: 120, carbs: 250, fat: 65 },
    },
    {
      id: 'muscleGain',
      name: 'Muscle Gain',
      description:
        'Higher calories and protein to support muscle growth and recovery',
      macros: { calories: 2500, protein: 180, carbs: 300, fat: 70 },
    },
    {
      id: 'ketogenic',
      name: 'Ketogenic',
      description:
        'Very low carb, moderate protein, and high fat to promote ketosis',
      macros: { calories: 2000, protein: 150, carbs: 50, fat: 150 },
    },
    {
      id: 'lowCarb',
      name: 'Low Carb',
      description: 'Reduced carbs with higher protein and moderate fat',
      macros: { calories: 2000, protein: 150, carbs: 100, fat: 110 },
    },
  ];

  // Fetch nutrition goals from API
  const fetchNutritionGoals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/nutrition/goals');

      if (response.data && response.data.data) {
        const fetchedGoals = response.data.data;

        // Set daily goals
        setGoals({
          daily: {
            calories: fetchedGoals.calories || 2000,
            protein: fetchedGoals.protein || 120,
            carbs: fetchedGoals.carbs || 250,
            fat: fetchedGoals.fat || 65,
            fiber: fetchedGoals.fiber || 30,
            sugar: fetchedGoals.sugar || 50,
            sodium: fetchedGoals.sodium || 2300,
            water: fetchedGoals.water || 2500,
            vitaminC: fetchedGoals.vitaminC || 75,
            calcium: fetchedGoals.calcium || 1000,
            iron: fetchedGoals.iron || 18,
          },
          weekly: calculateWeekly({
            calories: fetchedGoals.calories || 2000,
            protein: fetchedGoals.protein || 120,
            carbs: fetchedGoals.carbs || 250,
            fat: fetchedGoals.fat || 65,
            fiber: fetchedGoals.fiber || 30,
            sugar: fetchedGoals.sugar || 50,
            sodium: fetchedGoals.sodium || 2300,
            water: fetchedGoals.water || 2500,
            vitaminC: fetchedGoals.vitaminC || 75,
            calcium: fetchedGoals.calcium || 1000,
            iron: fetchedGoals.iron || 18,
          }),
        });

        // Update form data with fetched goals
        setFormData({
          calories: fetchedGoals.calories || 2000,
          protein: fetchedGoals.protein || 120,
          carbs: fetchedGoals.carbs || 250,
          fat: fetchedGoals.fat || 65,
          fiber: fetchedGoals.fiber || 30,
          sugar: fetchedGoals.sugar || 50,
          sodium: fetchedGoals.sodium || 2300,
          water: fetchedGoals.water || 2500,
          vitaminC: fetchedGoals.vitaminC || 75,
          calcium: fetchedGoals.calcium || 1000,
          iron: fetchedGoals.iron || 18,
        });
      }
    } catch (err) {
      console.error('Error fetching nutrition goals:', err);
      // Keep default values if fetch fails
      toast.error('Failed to load nutrition goals. Using default values.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch current nutrition progress for today
  const fetchNutritionProgress = async () => {
    try {
      setProgressLoading(true);
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      const response = await api.get('/api/nutrition/logs', {
        params: {
          startDate: today,
          endDate: today,
          limit: 1,
        },
      });

      if (response.data && response.data.count > 0) {
        const todayLog = response.data.data[0];

        // Calculate progress from today's nutrition log
        setProgress({
          calories: todayLog.totalCalories || 0,
          protein: todayLog.totalProtein || 0,
          carbs: todayLog.totalCarbs || 0,
          fat: todayLog.totalFat || 0,
          fiber: todayLog.totalFiber || 0,
          sugar: todayLog.totalSugar || 0,
          sodium: todayLog.totalSodium || 0,
          water: todayLog.waterIntake || 0,
          vitaminC: todayLog.totalVitaminC || 0,
          calcium: todayLog.totalCalcium || 0,
          iron: todayLog.totalIron || 0,
        });
      } else {
        // No data for today, reset progress
        setProgress({
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
          water: 0,
          vitaminC: 0,
          calcium: 0,
          iron: 0,
        });
      }
    } catch (err) {
      console.error('Error fetching nutrition progress:', err);
      // Keep zero progress if fetch fails
    } finally {
      setProgressLoading(false);
    }
  };

  // Fetch weekly nutrition progress
  const fetchWeeklyProgress = async () => {
    try {
      setProgressLoading(true);
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 6); // Last 7 days including today

      const startDate = weekAgo.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];

      const response = await api.get('/api/nutrition/logs', {
        params: {
          startDate,
          endDate,
          limit: 7,
        },
      });

      if (response.data && response.data.count > 0) {
        // Sum up all the logs for the week
        const weeklyTotals = response.data.data.reduce(
          (totals, log) => ({
            calories: totals.calories + (log.totalCalories || 0),
            protein: totals.protein + (log.totalProtein || 0),
            carbs: totals.carbs + (log.totalCarbs || 0),
            fat: totals.fat + (log.totalFat || 0),
            fiber: totals.fiber + (log.totalFiber || 0),
            sugar: totals.sugar + (log.totalSugar || 0),
            sodium: totals.sodium + (log.totalSodium || 0),
            water: totals.water + (log.waterIntake || 0),
            vitaminC: totals.vitaminC + (log.totalVitaminC || 0),
            calcium: totals.calcium + (log.totalCalcium || 0),
            iron: totals.iron + (log.totalIron || 0),
          }),
          {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0,
            sugar: 0,
            sodium: 0,
            water: 0,
            vitaminC: 0,
            calcium: 0,
            iron: 0,
          }
        );

        setProgress(weeklyTotals);
      } else {
        // No data for this week, reset progress
        setProgress({
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
          water: 0,
          vitaminC: 0,
          calcium: 0,
          iron: 0,
        });
      }
    } catch (err) {
      console.error('Error fetching weekly nutrition progress:', err);
      // Keep zero progress if fetch fails
    } finally {
      setProgressLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchNutritionGoals();
  }, []);

  // Fetch progress when tab changes
  useEffect(() => {
    if (!loading) {
      if (activeTab === 'daily') {
        fetchNutritionProgress();
      } else if (activeTab === 'weekly') {
        fetchWeeklyProgress();
      }
    }
  }, [activeTab, loading]);

  // Smart tips based on current progress
  const getTips = () => {
    const tips = [];
    const currentGoals = activeTab === 'daily' ? goals.daily : goals.weekly;

    // Calculate percentages for macros
    const proteinPercent = (progress.protein / currentGoals.protein) * 100;
    const carbsPercent = (progress.carbs / currentGoals.carbs) * 100;
    const fatPercent = (progress.fat / currentGoals.fat) * 100;
    const caloriePercent = (progress.calories / currentGoals.calories) * 100;

    if (activeTab === 'daily') {
      if (proteinPercent < 50 && caloriePercent > 50) {
        tips.push({
          type: 'warning',
          title: 'Protein Intake Low',
          message:
            "You're below 50% of your protein goal but already consumed more than half your calories. Consider protein-rich foods for your next meal like eggs, chicken, or Greek yogurt.",
        });
      }

      if (fatPercent > 90 && caloriePercent < 70) {
        tips.push({
          type: 'warning',
          title: 'Fat Intake High',
          message:
            "You've nearly reached your fat goal but have plenty of calories remaining. Consider lower-fat options for your remaining meals today.",
        });
      }

      if (progress.water < currentGoals.water * 0.4) {
        tips.push({
          type: 'info',
          title: 'Hydration Reminder',
          message:
            "You're behind on your water intake goal. Try to drink a glass of water now and set reminders throughout the day.",
        });
      }

      if (progress.fiber < currentGoals.fiber * 0.3 && caloriePercent > 50) {
        tips.push({
          type: 'info',
          title: 'Fiber Intake Low',
          message:
            'Consider adding more fiber-rich foods like fruits, vegetables, or whole grains to your remaining meals today.',
        });
      }
    }

    if (tips.length === 0) {
      tips.push({
        type: 'success',
        title: 'Great Progress!',
        message: `You're on track with your nutrition goals ${activeTab === 'daily' ? 'today' : 'this week'}. Keep up the good work!`,
      });
    }

    return tips;
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: parseInt(value, 10) || 0,
    });
  };

  // Apply preset goal type
  const applyGoalType = goalType => {
    const selectedGoal = goalTypes.find(g => g.id === goalType);
    if (selectedGoal) {
      setFormData({
        ...formData,
        ...selectedGoal.macros,
      });
    }
  };

  // Calculate weekly goals from daily
  const calculateWeekly = dailyGoals => {
    const weeklyGoals = {};
    Object.keys(dailyGoals).forEach(key => {
      weeklyGoals[key] = dailyGoals[key] * 7;
    });
    return weeklyGoals;
  };

  // Save goals
  const handleSaveGoals = async () => {
    setSaving(true);

    try {
      // Validate form data
      if (formData.calories < 1200) {
        toast.error('Daily calorie goal should be at least 1200');
        setSaving(false);
        return;
      }

      // Save to API
      await api.post('/api/nutrition/goals', formData);

      // Calculate weekly goals based on daily inputs
      const newWeeklyGoals = calculateWeekly(formData);

      // Update goals
      setGoals({
        daily: { ...formData },
        weekly: newWeeklyGoals,
      });

      setIsEditing(false);
      toast.success('Nutrition goals updated successfully!');
    } catch (err) {
      toast.error('Error updating goals. Please try again.');
      console.error('Error saving goals:', err);
    } finally {
      setSaving(false);
    }
  };

  // Calculate percentage for progress bar
  const calculatePercentage = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // Render nutrient progress
  const renderNutrientProgress = (
    current,
    target,
    label,
    color = 'indigo',
    unit = 'g'
  ) => {
    const percentage = calculatePercentage(current, target);

    return (
      <div className='mb-4'>
        <div className='flex justify-between items-baseline mb-1'>
          <div className='flex items-center'>
            <div className={`w-3 h-3 bg-${color}-500 rounded-full mr-2`}></div>
            <h5 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              {label}
            </h5>
          </div>
          <div className='text-right'>
            <span className='font-medium text-gray-900 dark:text-white'>
              {Math.round(current)}
              {unit}
            </span>
            <span className='text-gray-500 dark:text-gray-400 ml-1'>
              / {target}
              {unit}
            </span>
          </div>
        </div>
        <div className='h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
          <div
            className={`h-full bg-${color}-500 rounded-full transition-all duration-300 ease-in-out`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className='text-xs text-gray-500 dark:text-gray-400 mt-1 text-right'>
          {percentage}% of goal
        </div>
      </div>
    );
  };

  // Render the edit form
  const renderEditForm = () => {
    return (
      <div className='space-y-6'>
        <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
          <h3 className='text-md font-medium text-blue-800 dark:text-blue-300 mb-2'>
            Quick Start with Goal Templates
          </h3>
          <p className='text-sm text-blue-700 dark:text-blue-400 mb-3'>
            Select a preset goal type or customize your own values below:
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {goalTypes.map(goalType => (
              <div
                key={goalType.id}
                className='p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors'
                onClick={() => applyGoalType(goalType.id)}
              >
                <h4 className='font-medium text-gray-900 dark:text-white'>
                  {goalType.name}
                </h4>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  {goalType.description}
                </p>
                <div className='mt-2 text-xs font-medium'>
                  <div className='text-indigo-600 dark:text-indigo-400'>
                    {goalType.macros.calories} cal · {goalType.macros.protein}g
                    protein · {goalType.macros.carbs}g carbs ·{' '}
                    {goalType.macros.fat}g fat
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='space-y-4'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
            Main Macronutrients
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='Daily Calories'
              type='number'
              value={formData.calories}
              onChange={e => handleInputChange('calories', e.target.value)}
              min='1200'
              required
            />

            <Input
              label='Protein (g)'
              type='number'
              value={formData.protein}
              onChange={e => handleInputChange('protein', e.target.value)}
              min='0'
              required
            />

            <Input
              label='Carbohydrates (g)'
              type='number'
              value={formData.carbs}
              onChange={e => handleInputChange('carbs', e.target.value)}
              min='0'
              required
            />

            <Input
              label='Fat (g)'
              type='number'
              value={formData.fat}
              onChange={e => handleInputChange('fat', e.target.value)}
              min='0'
              required
            />
          </div>
        </div>

        <div className='space-y-4'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
            Other Nutrients
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Input
              label='Fiber (g)'
              type='number'
              value={formData.fiber}
              onChange={e => handleInputChange('fiber', e.target.value)}
              min='0'
            />

            <Input
              label='Sugar (g)'
              type='number'
              value={formData.sugar}
              onChange={e => handleInputChange('sugar', e.target.value)}
              min='0'
            />

            <Input
              label='Sodium (mg)'
              type='number'
              value={formData.sodium}
              onChange={e => handleInputChange('sodium', e.target.value)}
              min='0'
            />

            <Input
              label='Water (ml)'
              type='number'
              value={formData.water}
              onChange={e => handleInputChange('water', e.target.value)}
              min='0'
            />

            <Input
              label='Vitamin C (mg)'
              type='number'
              value={formData.vitaminC}
              onChange={e => handleInputChange('vitaminC', e.target.value)}
              min='0'
            />

            <Input
              label='Calcium (mg)'
              type='number'
              value={formData.calcium}
              onChange={e => handleInputChange('calcium', e.target.value)}
              min='0'
            />
          </div>
        </div>

        <div className='flex justify-end space-x-3'>
          <Button variant='outline' onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button variant='primary' onClick={handleSaveGoals} disabled={saving}>
            {saving ? 'Saving...' : 'Save Goals'}
          </Button>
        </div>
      </div>
    );
  };

  // Render the current goals overview
  const renderGoalsOverview = () => {
    const currentGoals = activeTab === 'daily' ? goals.daily : goals.weekly;

    return (
      <div className='space-y-6'>
        {/* Progress loading indicator */}
        {progressLoading && (
          <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
            <div className='flex items-center'>
              <div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2'></div>
              <span className='text-blue-700 dark:text-blue-300 text-sm'>
                Loading current progress...
              </span>
            </div>
          </div>
        )}

        {/* Main macros card */}
        <Card title='Macronutrient Goals' className='relative'>
          <div className='absolute top-4 right-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsEditing(true)}
            >
              Edit Goals
            </Button>
          </div>

          <div className='mt-4 grid grid-cols-1 xl:grid-cols-2 gap-6'>
            <div className='space-y-6'>
              {/* Main macros */}
              <div>
                {/* Calories */}
                <div className='mb-5'>
                  <div className='flex justify-between items-baseline mb-1'>
                    <h4 className='text-gray-700 dark:text-gray-300 font-medium'>
                      Calories
                    </h4>
                    <div className='text-right'>
                      <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                        {Math.round(progress.calories)}
                      </span>
                      <span className='text-gray-500 dark:text-gray-400 ml-1'>
                        / {currentGoals.calories}
                      </span>
                    </div>
                  </div>
                  <div className='h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-300 ease-in-out'
                      style={{
                        width: `${calculatePercentage(progress.calories, currentGoals.calories)}%`,
                      }}
                    ></div>
                  </div>
                  <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    <span>0</span>
                    <span>{currentGoals.calories}</span>
                  </div>
                </div>

                {/* Protein */}
                {renderNutrientProgress(
                  progress.protein,
                  currentGoals.protein,
                  'Protein',
                  'blue'
                )}

                {/* Carbs */}
                {renderNutrientProgress(
                  progress.carbs,
                  currentGoals.carbs,
                  'Carbohydrates',
                  'yellow'
                )}

                {/* Fat */}
                {renderNutrientProgress(
                  progress.fat,
                  currentGoals.fat,
                  'Fat',
                  'red'
                )}
              </div>

              {/* Ratio visualization */}
              <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                <h4 className='text-md font-medium text-gray-800 dark:text-gray-200 mb-3'>
                  Macronutrient Ratio
                </h4>

                <div className='flex h-8 w-full rounded-lg overflow-hidden shadow-inner'>
                  <div
                    className='bg-blue-500 transition-all duration-300 ease-in-out relative group'
                    style={{
                      width: `${Math.round(((currentGoals.protein * 4) / currentGoals.calories) * 100)}%`,
                    }}
                  >
                    <div className='absolute inset-0 flex items-center justify-center text-white text-xs font-bold'>
                      {Math.round(
                        ((currentGoals.protein * 4) / currentGoals.calories) *
                          100
                      )}
                      %
                    </div>
                  </div>
                  <div
                    className='bg-yellow-500 transition-all duration-300 ease-in-out relative group'
                    style={{
                      width: `${Math.round(((currentGoals.carbs * 4) / currentGoals.calories) * 100)}%`,
                    }}
                  >
                    <div className='absolute inset-0 flex items-center justify-center text-white text-xs font-bold'>
                      {Math.round(
                        ((currentGoals.carbs * 4) / currentGoals.calories) * 100
                      )}
                      %
                    </div>
                  </div>
                  <div
                    className='bg-red-500 transition-all duration-300 ease-in-out relative group'
                    style={{
                      width: `${Math.round(((currentGoals.fat * 9) / currentGoals.calories) * 100)}%`,
                    }}
                  >
                    <div className='absolute inset-0 flex items-center justify-center text-white text-xs font-bold'>
                      {Math.round(
                        ((currentGoals.fat * 9) / currentGoals.calories) * 100
                      )}
                      %
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className='grid grid-cols-3 gap-2 text-xs mt-3 text-gray-600 dark:text-gray-400'>
                  <div className='flex items-center'>
                    <div className='w-3 h-3 bg-blue-500 rounded-full mr-1'></div>
                    <span>
                      Protein{' '}
                      {Math.round(
                        ((currentGoals.protein * 4) / currentGoals.calories) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-3 h-3 bg-yellow-500 rounded-full mr-1'></div>
                    <span>
                      Carbs{' '}
                      {Math.round(
                        ((currentGoals.carbs * 4) / currentGoals.calories) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-3 h-3 bg-red-500 rounded-full mr-1'></div>
                    <span>
                      Fat{' '}
                      {Math.round(
                        ((currentGoals.fat * 9) / currentGoals.calories) * 100
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h4 className='text-md font-medium text-gray-800 dark:text-gray-200'>
                Other Nutrients
              </h4>

              {/* Fiber */}
              {renderNutrientProgress(
                progress.fiber,
                currentGoals.fiber,
                'Fiber',
                'green'
              )}

              {/* Sugar */}
              {renderNutrientProgress(
                progress.sugar,
                currentGoals.sugar,
                'Sugar',
                'pink'
              )}

              {/* Water */}
              {renderNutrientProgress(
                progress.water,
                currentGoals.water,
                'Water',
                'blue',
                'ml'
              )}

              {/* Vitamins & Minerals */}
              <div className='bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 mt-4'>
                <h5 className='text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-3'>
                  Vitamins & Minerals
                </h5>
                <div className='space-y-3'>
                  {/* Vitamin C */}
                  {renderNutrientProgress(
                    progress.vitaminC,
                    currentGoals.vitaminC,
                    'Vitamin C',
                    'orange',
                    'mg'
                  )}

                  {/* Calcium */}
                  {renderNutrientProgress(
                    progress.calcium,
                    currentGoals.calcium,
                    'Calcium',
                    'purple',
                    'mg'
                  )}

                  {/* Iron */}
                  {renderNutrientProgress(
                    progress.iron,
                    currentGoals.iron,
                    'Iron',
                    'gray',
                    'mg'
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Smart tips */}
        {showTips && (
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                Smart Nutrition Tips
              </h3>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowTips(false)}
              >
                Hide Tips
              </Button>
            </div>

            {getTips().map((tip, index) => (
              <Alert
                key={index}
                type={tip.type}
                title={tip.title}
                message={tip.message}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <Card
        title='Nutrition Goals'
        subtitle='Set and track your personalized nutrition targets'
      >
        {/* Daily/Weekly Toggle */}
        <div className='bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex mb-6'>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'daily'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('daily')}
          >
            Daily Goals
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'weekly'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly Goals
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500'></div>
            <p className='ml-2 text-gray-600 dark:text-gray-400'>
              Loading goals...
            </p>
          </div>
        )}

        {/* Content */}
        {!loading && (isEditing ? renderEditForm() : renderGoalsOverview())}
      </Card>

      {/* Motivation Card */}
      {!loading && !isEditing && (
        <Card className='bg-gradient-to-r from-purple-600 to-indigo-600 text-white'>
          <div className='text-center py-6'>
            <h3 className='text-xl font-bold mb-3'>Your Nutrition Journey</h3>
            <p className='text-indigo-100 mb-5'>
              {activeTab === 'daily'
                ? 'Small daily choices add up to big results. Focus on consistency, not perfection.'
                : "Think of your weekly goals as the big picture. Balance is key - one day doesn't define your week."}
            </p>
            <div className='text-sm italic text-indigo-200'>
              "The food you eat can be either the safest and most powerful form
              of medicine or the slowest form of poison."
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default NutritionGoals;
