import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const WaterTracker = ({ waterIntake = 0, onUpdate, expanded = false }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  
  // Convert ml to cups (1 cup = 240ml)
  const mlToCups = (ml) => {
    return (ml / 240).toFixed(1);
  };
  
  // Calculate percentage for progress bar (8 cups / 2000ml daily goal)
  const calculatePercentage = (ml) => {
    const percentage = (ml / 2000) * 100;
    return Math.min(percentage, 100);
  };
  
  // Update water intake
  const handleUpdateWater = (change) => {
    setIsUpdating(true);
    const newAmount = Math.max(0, waterIntake + change);
    
    onUpdate(newAmount)
      .finally(() => {
        setIsUpdating(false);
      });
  };
  
  // Add preset amounts
  const addPresetAmount = (amount) => {
    setIsUpdating(true);
    const newAmount = waterIntake + amount;
    
    onUpdate(newAmount)
      .finally(() => {
        setIsUpdating(false);
      });
  };
  
  // Add custom amount
  const handleAddCustomAmount = () => {
    if (!customAmount || isNaN(parseInt(customAmount))) return;
    
    setIsUpdating(true);
    const amount = parseInt(customAmount);
    const newAmount = waterIntake + amount;
    
    onUpdate(newAmount)
      .finally(() => {
        setIsUpdating(false);
        setCustomAmount('');
      });
  };
  
  // Reset water intake
  const resetWater = () => {
    setIsUpdating(true);
    onUpdate(0)
      .finally(() => {
        setIsUpdating(false);
      });
  };

  // Get motivation message based on percentage
  const getMotivationMessage = () => {
    const percentage = calculatePercentage(waterIntake);
    
    if (percentage === 0) return "Start hydrating! 💧";
    if (percentage < 25) return "Keep drinking! Your body needs more water. 💧";
    if (percentage < 50) return "You're on your way! Keep it up! 💦";
    if (percentage < 75) return "Great progress! More than halfway there! 💦";
    if (percentage < 100) return "Almost there! Just a bit more! 🌊";
    return "Goal achieved! Excellent hydration today! 🎉";
  };

  // Render water droplets
  const renderWaterDroplets = () => {
    const totalDroplets = 8; // 8 cups = 2000ml
    const filledDroplets = Math.min(Math.ceil((waterIntake / 2000) * totalDroplets), totalDroplets);
    
    return (
      <div className="flex justify-center space-x-2 my-4">
        {[...Array(totalDroplets)].map((_, i) => (
          <div 
            key={i} 
            className={`w-8 h-10 ${i < filledDroplets ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card
      title="Water Intake"
      subtitle={`${waterIntake} ml (${mlToCups(waterIntake)} cups)`}
    >
      {expanded && renderWaterDroplets()}
      
      {/* Progress visualization */}
      <div className="relative">
        <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-300 to-blue-500 rounded-lg transition-all duration-500 ease-in-out"
            style={{ width: `${calculatePercentage(waterIntake)}%` }}
          >
            <div className="h-full w-full bg-blue-500 bg-opacity-20 bg-wave-pattern"></div>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white drop-shadow-md">
            {Math.round(calculatePercentage(waterIntake))}%
          </span>
        </div>
      </div>
      
      {/* Daily goal and motivation */}
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Daily Goal: 2000ml (8 cups)
        </p>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
          {getMotivationMessage()}
        </p>
      </div>
      
      {/* Controls */}
      <div className="mt-6">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            variant={waterIntake === 0 ? "ghost" : "outline"}
            onClick={() => handleUpdateWater(-240)}
            disabled={waterIntake === 0 || isUpdating}
            fullWidth
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              1 Cup
            </span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleUpdateWater(240)}
            disabled={isUpdating}
            fullWidth
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              1 Cup
            </span>
          </Button>
        </div>
        
        {/* Quick add buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => addPresetAmount(120)}
            disabled={isUpdating}
            fullWidth
          >
            + 120ml
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => addPresetAmount(240)}
            disabled={isUpdating}
            fullWidth
          >
            + 240ml
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => addPresetAmount(500)}
            disabled={isUpdating}
            fullWidth
          >
            + 500ml
          </Button>
        </div>
        
        {/* Custom amount input */}
        {expanded && (
          <div className="flex space-x-2 mb-4">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Custom amount (ml)"
              className="block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Button
              variant="primary"
              onClick={handleAddCustomAmount}
              disabled={!customAmount || isUpdating}
            >
              Add
            </Button>
          </div>
        )}
        
        {/* Predefined bottle sizes */}
        {expanded && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Common Container Sizes:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addPresetAmount(330)}
                disabled={isUpdating}
              >
                Small Bottle (330ml)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addPresetAmount(500)}
                disabled={isUpdating}
              >
                Water Bottle (500ml)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addPresetAmount(750)}
                disabled={isUpdating}
              >
                Large Bottle (750ml)
              </Button>
              <Button
                variant="outline"
                size="sm"
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
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetWater}
              disabled={isUpdating}
              className="text-red-500 hover:text-red-700"
            >
              Reset
            </Button>
          </div>
        )}
      </div>
      
      {/* Water intake benefits - only shown in expanded mode */}
      {expanded && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 bg-opacity-50 dark:bg-opacity-30 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Benefits of Staying Hydrated:</h4>
          <ul className="text-xs text-blue-700 dark:text-blue-300 list-disc pl-4 space-y-1">
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