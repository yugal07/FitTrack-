import { useState, useEffect, useRef } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

// Celebration Modal Component
const CelebrationModal = ({ isOpen, onClose, onCelebrate }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4 text-center relative overflow-hidden'>
        {/* Animated background pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-4 left-4 text-blue-500 animate-bounce'>
            💧
          </div>
          <div className='absolute top-8 right-8 text-blue-400 animate-pulse'>
            💧
          </div>
          <div className='absolute bottom-12 left-8 text-blue-600 animate-bounce delay-100'>
            💧
          </div>
          <div className='absolute bottom-6 right-4 text-blue-300 animate-pulse delay-200'>
            💧
          </div>
        </div>

        <div className='relative z-10'>
          {/* Trophy Icon */}
          <div className='w-20 h-20 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center'>
            <div className='text-4xl'>💧</div>
          </div>

          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            Goal Achieved!
          </h2>

          <p className='text-gray-600 dark:text-gray-400 mb-2'>
            Congratulations! You've completed your goal:
          </p>

          <p className='text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4'>
            Reach 2000ml water intake
          </p>

          <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
            Completed on{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <div className='space-y-3'>
            <Button onClick={onCelebrate} variant='primary' fullWidth size='lg'>
              Celebrate Again! 🎉
            </Button>

            <Button onClick={onClose} variant='outline' fullWidth>
              Continue
            </Button>
          </div>

          <p className='text-xs text-gray-500 dark:text-gray-400 mt-4'>
            Remember to set a new goal to keep your momentum going!
          </p>
        </div>
      </div>
    </div>
  );
};

// Confetti Component
const Confetti = ({ isActive }) => {
  if (!isActive) return null;

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    color: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE', '#1E40AF'][
      Math.floor(Math.random() * 5)
    ],
  }));

  return (
    <div className='fixed inset-0 pointer-events-none z-40 overflow-hidden'>
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className='absolute w-2 h-2 opacity-80'
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animation: `confetti-fall ${piece.duration}s linear ${piece.delay}s infinite`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Water Drops Animation Component
const WaterDropsAnimation = ({ isActive }) => {
  if (!isActive) return null;

  const waterDrops = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    size: 8 + Math.random() * 8,
  }));

  return (
    <div className='fixed inset-0 pointer-events-none z-40 overflow-hidden'>
      {waterDrops.map(drop => (
        <div
          key={drop.id}
          className='absolute text-blue-500 opacity-80'
          style={{
            left: `${drop.left}%`,
            fontSize: `${drop.size}px`,
            animation: `water-drop-fall ${drop.duration}s linear ${drop.delay}s infinite`,
          }}
        >
          💧
        </div>
      ))}

      <style jsx>{`
        @keyframes water-drop-fall {
          0% {
            transform: translateY(-50px);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const WaterTracker = ({ waterIntake = 0, onUpdate, expanded = false }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWaterDrops, setShowWaterDrops] = useState(false);
  const [hasReachedGoal, setHasReachedGoal] = useState(false);

  // Audio context for sound effects
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Initialize audio context
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0.3;
    } catch (error) {
      console.log('Audio context not supported');
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play water drop sound
  const playWaterSound = () => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(gainNodeRef.current);

      // Create water drop sound effect
      oscillator.frequency.setValueAtTime(
        800,
        audioContextRef.current.currentTime
      );
      oscillator.frequency.exponentialRampToValueAtTime(
        200,
        audioContextRef.current.currentTime + 0.2
      );

      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContextRef.current.currentTime + 0.3
      );

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.3);
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  // Play celebration sound
  const playCelebrationSound = () => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    try {
      // Play a series of ascending notes for celebration
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((frequency, index) => {
        setTimeout(() => {
          const oscillator = audioContextRef.current.createOscillator();
          const gainNode = audioContextRef.current.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(gainNodeRef.current);

          oscillator.frequency.value = frequency;
          oscillator.type = 'triangle';

          gainNode.gain.setValueAtTime(
            0.2,
            audioContextRef.current.currentTime
          );
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContextRef.current.currentTime + 0.5
          );

          oscillator.start(audioContextRef.current.currentTime);
          oscillator.stop(audioContextRef.current.currentTime + 0.5);
        }, index * 200);
      });
    } catch (error) {
      console.log('Error playing celebration sound:', error);
    }
  };

  // Check for goal completion
  useEffect(() => {
    const wasGoalReached = hasReachedGoal;
    const isGoalReached = waterIntake >= 2000;

    if (isGoalReached && !wasGoalReached) {
      // Goal just reached!
      setHasReachedGoal(true);
      setShowCelebration(true);
      playCelebrationSound();
      triggerCelebrationEffects();
    } else if (!isGoalReached && wasGoalReached) {
      // Goal no longer reached (reset)
      setHasReachedGoal(false);
    }
  }, [waterIntake, hasReachedGoal]);

  // Trigger celebration effects
  const triggerCelebrationEffects = () => {
    setShowConfetti(true);
    setShowWaterDrops(true);

    // Stop effects after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
      setShowWaterDrops(false);
    }, 5000);
  };

  // Convert ml to cups (1 cup = 240ml)
  const mlToCups = ml => {
    return (ml / 240).toFixed(1);
  };

  // Calculate percentage for progress bar (8 cups / 2000ml daily goal)
  const calculatePercentage = ml => {
    const percentage = (ml / 2000) * 100;
    return Math.min(percentage, 100);
  };

  // Update water intake
  const handleUpdateWater = async change => {
    setIsUpdating(true);
    const newAmount = Math.max(0, waterIntake + change);

    // Play sound when adding water (not when removing)
    if (change > 0) {
      playWaterSound();
    }

    try {
      await onUpdate(newAmount);
    } catch (error) {
      console.error('Failed to update water intake:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Add preset amounts
  const addPresetAmount = async amount => {
    setIsUpdating(true);
    const newAmount = waterIntake + amount;

    playWaterSound();

    try {
      await onUpdate(newAmount);
    } catch (error) {
      console.error('Failed to update water intake:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Add custom amount
  const handleAddCustomAmount = async () => {
    if (!customAmount || isNaN(parseInt(customAmount))) return;

    setIsUpdating(true);
    const amount = parseInt(customAmount);
    const newAmount = waterIntake + amount;

    playWaterSound();

    try {
      await onUpdate(newAmount);
      setCustomAmount('');
    } catch (error) {
      console.error('Failed to update water intake:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Reset water intake
  const resetWater = async () => {
    setIsUpdating(true);

    try {
      await onUpdate(0);
    } catch (error) {
      console.error('Failed to reset water intake:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get motivation message based on percentage
  const getMotivationMessage = () => {
    const percentage = calculatePercentage(waterIntake);

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
      Math.ceil((waterIntake / 2000) * totalDroplets),
      totalDroplets
    );

    return (
      <div className='flex justify-center space-x-2 my-4'>
        {[...Array(totalDroplets)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-10 transition-colors duration-500 ${
              i < filledDroplets
                ? 'text-blue-500'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
            >
              <path d='M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z' />
            </svg>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Card
        title='Water Intake'
        subtitle={`${waterIntake} ml (${mlToCups(waterIntake)} cups)`}
      >
        {expanded && renderWaterDroplets()}

        {/* Progress visualization */}
        <div className='relative'>
          <div className='h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden'>
            <div
              className='h-full bg-gradient-to-r from-blue-300 to-blue-500 rounded-lg transition-all duration-500 ease-in-out'
              style={{ width: `${calculatePercentage(waterIntake)}%` }}
            >
              <div className='h-full w-full bg-blue-500 bg-opacity-20'></div>
            </div>
          </div>

          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='text-lg font-bold text-white drop-shadow-md'>
              {Math.round(calculatePercentage(waterIntake))}%
            </span>
          </div>
        </div>

        {/* Daily goal and motivation */}
        <div className='mt-2 text-center'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Daily Goal: 2000ml (8 cups)
          </p>
          <p className='text-sm font-medium text-blue-600 dark:text-blue-400 mt-1'>
            {getMotivationMessage()}
          </p>
        </div>

        {/* Controls */}
        <div className='mt-6'>
          <div className='grid grid-cols-2 gap-3 mb-4'>
            <Button
              variant={waterIntake === 0 ? 'ghost' : 'outline'}
              onClick={() => handleUpdateWater(-240)}
              disabled={waterIntake === 0 || isUpdating}
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
                className='block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2'
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
          {waterIntake > 0 && (
            <div className='flex justify-center'>
              <Button
                variant='ghost'
                size='sm'
                onClick={resetWater}
                disabled={isUpdating}
                className='text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
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

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        onCelebrate={() => {
          playCelebrationSound();
          triggerCelebrationEffects();
        }}
      />

      {/* Celebration Effects */}
      <Confetti isActive={showConfetti} />
      <WaterDropsAnimation isActive={showWaterDrops} />
    </>
  );
};

export default WaterTracker;
