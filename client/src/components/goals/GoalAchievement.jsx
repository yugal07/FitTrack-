import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { format } from 'date-fns';
import Button from '../ui/Button';

const GoalAchievement = ({ goal, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (showConfetti) {
      fireConfetti();
    }
  }, [showConfetti]);

  const fireConfetti = () => {
    // Configure and fire confetti
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1000,
    };

    // Create an intense burst of confetti
    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    // Fire confetti in multiple bursts with different colors
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#ff0000', '#ffa500'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#00ff00', '#0000ff'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#ffff00', '#ff00ff'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#00ffff', '#ffffff'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#ff0000', '#00ff00', '#0000ff'],
    });
  };

  // Helper function to get a human-readable goal title
  const getGoalTitle = goal => {
    switch (goal.type) {
      case 'weight':
        return `Reach ${goal.targetValue} ${goal.unit} weight`;
      case 'strength':
        return `Increase strength to ${goal.targetValue} ${goal.unit}`;
      case 'endurance':
        return `Build endurance to ${goal.targetValue} ${goal.unit}`;
      case 'habit':
        return `Complete ${goal.targetValue} workouts`;
      case 'nutrition':
        return `Maintain ${goal.targetValue} ${goal.unit} diet`;
      case 'custom':
      default:
        return `${goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} goal`;
    }
  };

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        {/* Background overlay */}
        <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
          <div className='absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75'></div>
        </div>

        {/* Modal panel */}
        <div className='inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full'>
          {/* Colorful celebration banner */}
          <div className='bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-1'>
            <div className='bg-white dark:bg-gray-800 p-4'>
              <div className='text-center py-6'>
                {/* Trophy icon */}
                <div className='mx-auto w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center mb-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-12 w-12 text-yellow-500'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z'
                      clipRule='evenodd'
                    />
                    <path d='M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z' />
                  </svg>
                </div>

                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                  Goal Achieved!
                </h3>

                <p className='text-lg text-gray-600 dark:text-gray-300 mb-4'>
                  Congratulations! You've completed your goal:
                </p>

                <div className='bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 mb-4 inline-block'>
                  <p className='text-lg font-bold text-indigo-800 dark:text-indigo-300'>
                    {getGoalTitle(goal)}
                  </p>
                </div>

                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Completed on{' '}
                  {format(
                    new Date(goal.updatedAt || new Date()),
                    'MMMM d, yyyy'
                  )}
                </p>

                <div className='mt-6 flex flex-col space-y-3'>
                  <Button
                    variant='primary'
                    fullWidth
                    onClick={() => {
                      setShowConfetti(true);
                      fireConfetti();
                    }}
                  >
                    Celebrate Again! 🎉
                  </Button>

                  <Button variant='outline' fullWidth onClick={onClose}>
                    Continue
                  </Button>
                </div>

                <div className='mt-4 text-xs text-gray-500 dark:text-gray-400'>
                  Remember to set a new goal to keep your momentum going!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalAchievement;
