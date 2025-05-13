import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const WaterTracker = ({ waterIntake = 0, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
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
  
  // Reset water intake
  const resetWater = () => {
    setIsUpdating(true);
    onUpdate(0)
      .finally(() => {
        setIsUpdating(false);
      });
  };

  return (
    <Card
      title="Water Intake"
      subtitle={`${waterIntake} ml (${mlToCups(waterIntake)} cups)`}
      className="mb-6"
    >
      {/* Progress bar */}
      <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${calculatePercentage(waterIntake)}%` }}
        ></div>
      </div>
      
      {/* Controls */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button
          variant={waterIntake === 0 ? "ghost" : "outline"}
          onClick={() => handleUpdateWater(-240)}
          disabled={waterIntake === 0 || isUpdating}
          fullWidth
        >
          - 1 Cup
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleUpdateWater(240)}
          disabled={isUpdating}
          fullWidth
        >
          + 1 Cup
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
      
      {/* Daily goal info */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
        Daily Goal: 2000ml (8 cups)
      </p>
    </Card>
  );
};

export default WaterTracker;