import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { apiWithToast } from '../../utils/api';
import Card from '../ui/Card';
import Button from '../ui/Button';

// Utility function to format dates
const formatDate = (date, format = 'yyyy-MM-dd') => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (format === 'yyyy-MM-dd') {
    return `${year}-${month}-${day}`;
  }

  if (format === 'MMMM d, yyyy') {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${year}`;
  }

  return date.toISOString().split('T')[0];
};

// Animated Water Drops Background Component
const WaterDropsBackground = () => {
  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      {/* Large water drops */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`large-${i}`}
          className='absolute animate-bounce opacity-60'
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            top: '-10px',
          }}
        >
          <div
            className='text-blue-400'
            style={{
              fontSize: `${20 + Math.random() * 20}px`,
              animation: `fall ${4 + Math.random() * 3}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            💧
          </div>
        </div>
      ))}

      {/* Medium water drops */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`medium-${i}`}
          className='absolute opacity-40'
          style={{
            left: `${Math.random() * 100}%`,
            animation: `fall ${3 + Math.random() * 2}s linear infinite`,
            animationDelay: `${Math.random() * 4}s`,
            top: '-10px',
          }}
        >
          <svg
            width='16'
            height='20'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='text-blue-300'
          >
            <path d='M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z' />
          </svg>
        </div>
      ))}

      {/* Small water drops */}
      {[...Array(30)].map((_, i) => (
        <div
          key={`small-${i}`}
          className='absolute opacity-30'
          style={{
            left: `${Math.random() * 100}%`,
            animation: `fall ${2 + Math.random() * 2}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            top: '-10px',
          }}
        >
          <div
            className='w-2 h-3 bg-blue-200 rounded-full'
            style={{
              background: 'linear-gradient(135deg, #bfdbfe 0%, #3b82f6 100%)',
            }}
          />
        </div>
      ))}

      {/* Sparkle effects */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className='absolute animate-pulse'
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${1 + Math.random()}s`,
          }}
        >
          <div className='text-yellow-300 text-xs'>✨</div>
        </div>
      ))}
    </div>
  );
};

// Goal Achievement Modal Component
const GoalAchievementModal = ({ show, onClose, onCelebrate }) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 relative overflow-hidden'>
        {/* Animated Water Drops Background */}
        <WaterDropsBackground />

        {/* Animated border gradient */}
        <div className='absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 animate-pulse opacity-75 rounded-lg'></div>
        <div className='relative bg-white dark:bg-gray-800 m-1 rounded-lg p-8 text-center'>
          {/* Water Wave Animation at Top */}
          <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-500 overflow-hidden'>
            <div
              className='h-full bg-blue-400 opacity-60'
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
                animation: 'wave 3s ease-in-out infinite',
              }}
            />
          </div>

          {/* Floating Water Drop Icon with special animation */}
          <div className='mx-auto w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center mb-6 relative overflow-hidden shadow-lg'>
            {/* Water drop animation inside circle */}
            <div className='absolute inset-0 bg-gradient-to-t from-blue-500 to-transparent opacity-30 animate-pulse'></div>
            <div className='relative z-10 text-4xl animate-bounce'>💧</div>

            {/* Ripple effect */}
            <div className='absolute inset-0 rounded-full border-4 border-blue-300 animate-ping opacity-30'></div>
          </div>

          {/* Title with water theme */}
          <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2'>
            Hydration Goal Achieved! 🎉
          </h2>

          {/* Subtitle */}
          <p className='text-gray-600 dark:text-gray-300 mb-4'>
            Congratulations! You've completed your daily hydration goal:
          </p>

          {/* Goal Details with water theme */}
          <div className='bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800 relative overflow-hidden'>
            {/* Water bubbles decoration */}
            <div className='absolute top-2 right-2 opacity-20'>
              <div className='flex space-x-1'>
                <div
                  className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'
                  style={{ animationDelay: '0s' }}
                ></div>
                <div
                  className='w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce'
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className='w-1 h-1 bg-blue-300 rounded-full animate-bounce'
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>

            <h3 className='text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2'>
              Daily Hydration Champion! 🏆
            </h3>
            <p className='text-blue-600 dark:text-blue-400 text-sm'>
              Completed on {formatDate(new Date(), 'MMMM d, yyyy')}
            </p>
            <div className='mt-3 flex items-center justify-center space-x-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                  2000ml
                </div>
                <div className='text-xs text-blue-500 dark:text-blue-300'>
                  Target
                </div>
              </div>
              <div className='text-blue-400 animate-pulse'>
                <svg
                  className='w-8 h-8'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z' />
                </svg>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                  ✓
                </div>
                <div className='text-xs text-green-500 dark:text-green-300'>
                  Achieved
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='space-y-3'>
            <Button
              onClick={onCelebrate}
              variant='primary'
              fullWidth
              className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-200'
            >
              <span className='flex items-center justify-center'>
                💧 Make it Rain Again! 🌊
              </span>
            </Button>

            <Button
              onClick={onClose}
              variant='outline'
              fullWidth
              className='border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20'
            >
              Continue Hydrating
            </Button>
          </div>

          {/* Motivational Message */}
          <p className='mt-4 text-xs text-gray-500 dark:text-gray-400'>
            🌟 Your body is 60% water - you're keeping it happy! Stay hydrated
            tomorrow too! 💪
          </p>
        </div>
      </div>

      {/* CSS Keyframes for animations */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes wave {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-20px);
          }
        }
      `}</style>
    </div>
  );
};
const ConfettiAnimation = ({ show, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className='fixed inset-0 pointer-events-none z-50'>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className='absolute animate-bounce'
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <div
            className='w-2 h-2 rounded-full'
            style={{
              backgroundColor: [
                '#3B82F6',
                '#10B981',
                '#F59E0B',
                '#EF4444',
                '#8B5CF6',
              ][Math.floor(Math.random() * 5)],
            }}
          />
        </div>
      ))}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='text-4xl font-bold text-blue-600 animate-pulse'>
          🎉 Goal Achieved! 🎉
        </div>
      </div>
    </div>
  );
};

// Confetti Animation Component
const WaterSplashAnimation = ({ show }) => {
  if (!show) return null;

  return (
    <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
      <div className='relative'>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 bg-blue-400 rounded-full animate-ping'
            style={{
              transform: `rotate(${i * 45}deg) translateY(-20px)`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        <div className='text-2xl animate-bounce'>💧</div>
      </div>
    </div>
  );
};

const WaterTracker = ({
  waterIntake = 0,
  onUpdate,
  expanded = false,
  nutritionLogId = null,
  showAsPage = false,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(showAsPage);
  const [customAmount, setCustomAmount] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [hasReachedGoal, setHasReachedGoal] = useState(false);
  const [currentWaterIntake, setCurrentWaterIntake] = useState(waterIntake);
  const [currentNutritionLogId, setCurrentNutritionLogId] =
    useState(nutritionLogId);

  // Get toast functions
  const toast = useToast();
  // Get toast-enabled API
  const api = apiWithToast(toast);

  const dailyGoal = 2000; // 2000ml daily goal

  // Play water sound effect
  const playWaterSound = useCallback(() => {
    try {
      // Create audio context for a simple water drop sound
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Water drop sound parameters
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        200,
        audioContext.currentTime + 0.1
      );

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio not supported or failed to play');
    }
  }, []);

  // Fetch water intake on component mount (only when used as standalone page)
  useEffect(() => {
    if (showAsPage) {
      const fetchWaterIntake = async () => {
        try {
          setIsLoading(true);
          const today = formatDate(new Date());

          // Try to fetch existing log first
          const response = await api.get('api/nutrition/logs', {
            params: {
              startDate: today,
              endDate: today,
              limit: 1,
            },
          });

          if (response.data.success && response.data.count > 0) {
            const nutritionLog = response.data.data[0];
            const intake = nutritionLog.waterIntake || 0;
            setCurrentWaterIntake(intake);
            setCurrentNutritionLogId(nutritionLog._id);
            setHasReachedGoal(intake >= dailyGoal);
          } else {
            // No log exists for today, start with 0 but don't create yet
            setCurrentWaterIntake(0);
            setCurrentNutritionLogId(null);
            setHasReachedGoal(false);
          }
        } catch (error) {
          console.error('Error fetching water intake:', error);
          // Error already handled by apiWithToast, so don't show duplicate toast
          // Set defaults on error
          setCurrentWaterIntake(0);
          setCurrentNutritionLogId(null);
          setHasReachedGoal(false);
        } finally {
          setIsLoading(false);
        }
      };

      fetchWaterIntake();
    }
  }, [showAsPage, api, dailyGoal, toast]);

  // Update water intake values when props change (for embedded mode)
  useEffect(() => {
    if (!showAsPage) {
      setCurrentWaterIntake(waterIntake);
      setHasReachedGoal(waterIntake >= dailyGoal);
    }
  }, [waterIntake, dailyGoal, showAsPage]);

  // Update water intake
  const updateWaterIntake = useCallback(
    async newAmount => {
      const previousAmount = currentWaterIntake;
      const wasGoalReached = previousAmount >= dailyGoal;
      const willReachGoal = newAmount >= dailyGoal;

      setIsUpdating(true);

      try {
        const today = formatDate(new Date());

        // If we don't have a nutrition log ID and this is standalone mode, create one first
        if (showAsPage && !currentNutritionLogId && newAmount > 0) {
          try {
            const createResponse = await api.post('api/nutrition/logs', {
              date: today,
              meals: [],
              waterIntake: newAmount,
            });

            if (createResponse.data.success) {
              setCurrentNutritionLogId(createResponse.data.data._id);
              setCurrentWaterIntake(newAmount);

              // Play sound effect
              playWaterSound();

              // Show splash animation
              setShowSplash(true);
              setTimeout(() => setShowSplash(false), 1000);

              // Check if goal was just reached
              if (!wasGoalReached && willReachGoal && !hasReachedGoal) {
                setShowGoalModal(true);
                setHasReachedGoal(true);
              }

              return;
            }
          } catch (createError) {
            // If creation fails, fall back to update method
            console.log('Log creation failed, trying update method');
          }
        }

        // Update water intake using the PATCH endpoint
        const response = await api.patch('api/nutrition/water', {
          date: today,
          amount: newAmount,
        });

        if (response.data.success) {
          setCurrentWaterIntake(newAmount);

          // Play sound effect
          playWaterSound();

          // Show splash animation
          setShowSplash(true);
          setTimeout(() => setShowSplash(false), 1000);

          // Check if goal was just reached
          if (!wasGoalReached && willReachGoal && !hasReachedGoal) {
            setShowGoalModal(true);
            setHasReachedGoal(true);
          }

          // Call parent callback if provided (for embedded mode)
          if (onUpdate && !showAsPage) {
            onUpdate(newAmount);
          }
        }
      } catch (error) {
        console.error('Error updating water intake:', error);
        // Error already handled by apiWithToast
      } finally {
        setIsUpdating(false);
      }
    },
    [
      currentWaterIntake,
      dailyGoal,
      hasReachedGoal,
      playWaterSound,
      toast,
      api,
      onUpdate,
      showAsPage,
      currentNutritionLogId,
    ]
  );

  // Handle water intake change
  const handleUpdateWater = change => {
    const newAmount = Math.max(0, currentWaterIntake + change);
    updateWaterIntake(newAmount);
  };

  // Add preset amounts
  const addPresetAmount = amount => {
    const newAmount = currentWaterIntake + amount;
    updateWaterIntake(newAmount);
  };

  // Add custom amount
  const handleAddCustomAmount = () => {
    if (!customAmount || isNaN(parseInt(customAmount))) return;

    const amount = parseInt(customAmount);
    const newAmount = currentWaterIntake + amount;
    updateWaterIntake(newAmount);
    setCustomAmount('');
  };

  // Handle goal modal actions
  const handleCelebrate = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Longer duration for water drop effect
    playWaterSound();
    toast.success(
      '🌊 Amazing! You are a hydration champion! 💧 Keep making waves! 🏆'
    );
  };

  const handleCloseModal = () => {
    setShowGoalModal(false);
  };

  // Reset water intake
  const resetWater = () => {
    updateWaterIntake(0);
    setHasReachedGoal(false);
    setShowGoalModal(false);
  };
  const mlToCups = ml => (ml / 240).toFixed(1);

  // Convert ml to cups (1 cup = 240ml)
  const calculatePercentage = ml => Math.min((ml / dailyGoal) * 100, 100);

  // Get motivation message based on percentage
  const getMotivationMessage = () => {
    const percentage = calculatePercentage(currentWaterIntake);

    if (percentage === 0) return 'Start hydrating! 💧';
    if (percentage < 25) return 'Keep drinking! Your body needs more water. 💧';
    if (percentage < 50) return "You're on your way! Keep it up! 💦";
    if (percentage < 75) return 'Great progress! More than halfway there! 💦';
    if (percentage < 100) return 'Almost there! Just a bit more! 🌊';
    return 'Goal achieved! Excellent hydration today! 🎉';
  };

  // Render water droplets
  const renderWaterDroplets = () => {
    const totalDroplets = 8; // 8 cups = 2000ml
    const filledDroplets = Math.min(
      Math.ceil((currentWaterIntake / dailyGoal) * totalDroplets),
      totalDroplets
    );

    return (
      <div className='flex justify-center space-x-2 my-4'>
        {[...Array(totalDroplets)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-10 transition-all duration-500 ${
              i < filledDroplets
                ? 'text-blue-500 animate-pulse'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='transition-all duration-500'
            >
              <path d='M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z' />
            </svg>
          </div>
        ))}
      </div>
    );
  };

  // Loading state for standalone page
  if (isLoading && showAsPage) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-4'>
        <div className='max-w-2xl mx-auto'>
          <Card title='Water Intake Tracker'>
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500'></div>
              <p className='ml-2 text-gray-600 dark:text-gray-400'>
                Loading water intake data...
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Render standalone page
  if (showAsPage) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-4'>
        <div className='max-w-2xl mx-auto space-y-6'>
          {/* Header */}
          <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Water Intake Tracker
            </h1>
            <p className='mt-1 text-gray-500 dark:text-gray-400'>
              Stay hydrated and track your daily water consumption
            </p>
          </div>

          {/* Main Water Tracker Card */}
          <Card
            title='Daily Water Intake'
            subtitle={`${currentWaterIntake} ml (${mlToCups(currentWaterIntake)} cups) - ${formatDate(new Date(), 'MMMM d, yyyy')}`}
            className='relative'
          >
            {/* Confetti Animation */}
            <ConfettiAnimation
              show={showConfetti}
              onComplete={() => setShowConfetti(false)}
            />

            {/* Water Splash Animation */}
            {showSplash && <WaterSplashAnimation show={showSplash} />}

            {/* Water Droplets Visualization */}
            {renderWaterDroplets()}

            {/* Progress Bar */}
            <div className='relative mb-6'>
              <div className='h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-blue-300 to-blue-500 rounded-lg transition-all duration-500 ease-in-out relative'
                  style={{
                    width: `${calculatePercentage(currentWaterIntake)}%`,
                  }}
                >
                  {/* Wave effect */}
                  <div className='absolute inset-0 bg-blue-400 bg-opacity-30'>
                    <div className='h-full w-full opacity-60 wave-animation' />
                  </div>
                </div>
              </div>

              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-lg font-bold text-white drop-shadow-md'>
                  {Math.round(calculatePercentage(currentWaterIntake))}%
                </span>
              </div>
            </div>

            {/* Goal and Motivation */}
            <div className='text-center mb-6'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Daily Goal: {dailyGoal}ml (8 cups)
              </p>
              <p className='text-sm font-medium text-blue-600 dark:text-blue-400 mt-1'>
                {getMotivationMessage()}
              </p>
              {hasReachedGoal && (
                <div className='mt-2 text-lg animate-pulse'>
                  🏆 Goal Achieved! 🏆
                </div>
              )}
            </div>

            {/* Quick Controls */}
            <div className='grid grid-cols-2 gap-3 mb-4'>
              <Button
                variant={currentWaterIntake === 0 ? 'ghost' : 'outline'}
                onClick={() => handleUpdateWater(-240)}
                disabled={currentWaterIntake === 0 || isUpdating}
                fullWidth
              >
                <span className='flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-1'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Remove 1 Cup
                </span>
              </Button>

              <Button
                variant='primary'
                onClick={() => handleUpdateWater(240)}
                disabled={isUpdating}
                fullWidth
              >
                <span className='flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-1'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Add 1 Cup
                </span>
              </Button>
            </div>

            {/* Quick Add Buttons */}
            <div className='grid grid-cols-3 gap-2 mb-6'>
              <Button
                variant='secondary'
                size='sm'
                onClick={() => addPresetAmount(120)}
                disabled={isUpdating}
                fullWidth
              >
                + 120ml
              </Button>

              <Button
                variant='secondary'
                size='sm'
                onClick={() => addPresetAmount(240)}
                disabled={isUpdating}
                fullWidth
              >
                + 240ml
              </Button>

              <Button
                variant='secondary'
                size='sm'
                onClick={() => addPresetAmount(500)}
                disabled={isUpdating}
                fullWidth
              >
                + 500ml
              </Button>
            </div>

            {/* Custom Amount Input */}
            <div className='flex space-x-2 mb-6'>
              <input
                type='number'
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                placeholder='Custom amount (ml)'
                className='block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                disabled={isUpdating}
              />
              <Button
                variant='primary'
                onClick={handleAddCustomAmount}
                disabled={!customAmount || isUpdating}
              >
                {isUpdating ? 'Adding...' : 'Add'}
              </Button>
            </div>

            {/* Predefined Container Sizes */}
            <div className='mb-6'>
              <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                Common Container Sizes:
              </h4>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => addPresetAmount(330)}
                  disabled={isUpdating}
                >
                  Small Bottle (330ml)
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => addPresetAmount(500)}
                  disabled={isUpdating}
                >
                  Water Bottle (500ml)
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => addPresetAmount(750)}
                  disabled={isUpdating}
                >
                  Large Bottle (750ml)
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => addPresetAmount(1000)}
                  disabled={isUpdating}
                >
                  1 Liter Bottle
                </Button>
              </div>
            </div>

            {/* Reset Button */}
            {currentWaterIntake > 0 && (
              <div className='flex justify-center'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={resetWater}
                  disabled={isUpdating}
                  className='text-red-500 hover:text-red-700'
                >
                  Reset Daily Intake
                </Button>
              </div>
            )}
          </Card>

          {/* Benefits Card */}
          <Card
            title='Why Stay Hydrated?'
            className='bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h4 className='text-sm font-medium text-blue-800 dark:text-blue-300 mb-2'>
                  Physical Benefits:
                </h4>
                <ul className='text-xs text-blue-700 dark:text-blue-300 list-disc pl-4 space-y-1'>
                  <li>Regulates body temperature</li>
                  <li>Keeps joints lubricated</li>
                  <li>Prevents infections</li>
                  <li>Delivers nutrients to cells</li>
                  <li>Helps organs function properly</li>
                </ul>
              </div>
              <div>
                <h4 className='text-sm font-medium text-blue-800 dark:text-blue-300 mb-2'>
                  Mental Benefits:
                </h4>
                <ul className='text-xs text-blue-700 dark:text-blue-300 list-disc pl-4 space-y-1'>
                  <li>Improves sleep quality</li>
                  <li>Enhances cognition and focus</li>
                  <li>Boosts mood and energy</li>
                  <li>Reduces headaches</li>
                  <li>Supports brain function</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Daily Statistics */}
          <Card title="Today's Hydration Stats">
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                  {Math.round(calculatePercentage(currentWaterIntake))}%
                </div>
                <div className='text-xs text-blue-700 dark:text-blue-300'>
                  Goal Progress
                </div>
              </div>
              <div className='text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg'>
                <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                  {mlToCups(currentWaterIntake)}
                </div>
                <div className='text-xs text-green-700 dark:text-green-300'>
                  Cups Consumed
                </div>
              </div>
              <div className='text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg'>
                <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                  {Math.max(0, dailyGoal - currentWaterIntake)}
                </div>
                <div className='text-xs text-purple-700 dark:text-purple-300'>
                  ml Remaining
                </div>
              </div>
              <div className='text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg'>
                <div className='text-2xl font-bold text-yellow-600 dark:text-yellow-400'>
                  {currentWaterIntake >= dailyGoal ? '🏆' : '⏰'}
                </div>
                <div className='text-xs text-yellow-700 dark:text-yellow-300'>
                  Status
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* CSS for wave animation */}
        <style jsx>{`
          @keyframes wave {
            0%,
            100% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(-20px);
            }
          }
          .wave-animation {
            background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E");
            animation: wave 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // Render embedded component (original functionality)
  return (
    <Card
      title='Water Intake'
      subtitle={`${currentWaterIntake} ml (${mlToCups(currentWaterIntake)} cups)`}
      className='relative'
    >
      {/* Goal Achievement Modal */}
      <GoalAchievementModal
        show={showGoalModal}
        onClose={handleCloseModal}
        onCelebrate={handleCelebrate}
      />

      {/* Confetti Animation */}
      <ConfettiAnimation
        show={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Water Splash Animation */}
      {showSplash && <WaterSplashAnimation show={showSplash} />}

      {expanded && renderWaterDroplets()}

      {/* Progress visualization */}
      <div className='relative'>
        <div className='h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden'>
          <div
            className='h-full bg-gradient-to-r from-blue-300 to-blue-500 rounded-lg transition-all duration-500 ease-in-out'
            style={{ width: `${calculatePercentage(currentWaterIntake)}%` }}
          >
            <div className='h-full w-full bg-blue-500 bg-opacity-20'></div>
          </div>
        </div>

        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-lg font-bold text-white drop-shadow-md'>
            {Math.round(calculatePercentage(currentWaterIntake))}%
          </span>
        </div>
      </div>

      {/* Daily goal and motivation */}
      <div className='mt-2 text-center'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Daily Goal: {dailyGoal}ml (8 cups)
        </p>
        <p className='text-sm font-medium text-blue-600 dark:text-blue-400 mt-1'>
          {getMotivationMessage()}
        </p>
        {hasReachedGoal && (
          <div className='mt-2 text-lg animate-pulse'>🏆 Goal Achieved! 🏆</div>
        )}
      </div>

      {/* Controls */}
      <div className='mt-6'>
        <div className='grid grid-cols-2 gap-3 mb-4'>
          <Button
            variant={currentWaterIntake === 0 ? 'ghost' : 'outline'}
            onClick={() => handleUpdateWater(-240)}
            disabled={currentWaterIntake === 0 || isUpdating}
            fullWidth
          >
            <span className='flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 mr-1'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              1 Cup
            </span>
          </Button>

          <Button
            variant='outline'
            onClick={() => handleUpdateWater(240)}
            disabled={isUpdating}
            fullWidth
          >
            <span className='flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 mr-1'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                  clipRule='evenodd'
                />
              </svg>
              1 Cup
            </span>
          </Button>
        </div>

        {/* Quick add buttons */}
        <div className='grid grid-cols-3 gap-2 mb-4'>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => addPresetAmount(120)}
            disabled={isUpdating}
            fullWidth
          >
            + 120ml
          </Button>

          <Button
            variant='secondary'
            size='sm'
            onClick={() => addPresetAmount(240)}
            disabled={isUpdating}
            fullWidth
          >
            + 240ml
          </Button>

          <Button
            variant='secondary'
            size='sm'
            onClick={() => addPresetAmount(500)}
            disabled={isUpdating}
            fullWidth
          >
            + 500ml
          </Button>
        </div>

        {/* Custom amount input */}
        {expanded && (
          <div className='flex space-x-2 mb-4'>
            <input
              type='number'
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              placeholder='Custom amount (ml)'
              className='block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              disabled={isUpdating}
            />
            <Button
              variant='primary'
              onClick={handleAddCustomAmount}
              disabled={!customAmount || isUpdating}
            >
              Add
            </Button>
          </div>
        )}

        {/* Predefined bottle sizes */}
        {expanded && (
          <div className='mb-4'>
            <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Common Container Sizes:
            </h4>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => addPresetAmount(330)}
                disabled={isUpdating}
              >
                Small Bottle (330ml)
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => addPresetAmount(500)}
                disabled={isUpdating}
              >
                Water Bottle (500ml)
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => addPresetAmount(750)}
                disabled={isUpdating}
              >
                Large Bottle (750ml)
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => addPresetAmount(1000)}
                disabled={isUpdating}
              >
                1 Liter Bottle
              </Button>
            </div>
          </div>
        )}

        {/* Reset button */}
        {currentWaterIntake > 0 && (
          <div className='flex justify-center'>
            <Button
              variant='ghost'
              size='sm'
              onClick={resetWater}
              disabled={isUpdating}
              className='text-red-500 hover:text-red-700'
            >
              Reset
            </Button>
          </div>
        )}
      </div>

      {/* Water intake benefits - only shown in expanded mode */}
      {expanded && (
        <div className='mt-6 p-4 bg-blue-50 dark:bg-blue-900 bg-opacity-50 dark:bg-opacity-30 rounded-lg'>
          <h4 className='text-sm font-medium text-blue-800 dark:text-blue-300 mb-2'>
            Benefits of Staying Hydrated:
          </h4>
          <ul className='text-xs text-blue-700 dark:text-blue-300 list-disc pl-4 space-y-1'>
            <li>Regulates body temperature</li>
            <li>Keeps joints lubricated</li>
            <li>Prevents infections</li>
            <li>Delivers nutrients to cells</li>
            <li>Improves sleep quality and cognition</li>
            <li>Helps organs function properly</li>
          </ul>
        </div>
      )}
    </Card>
  );
};

export default WaterTracker;
