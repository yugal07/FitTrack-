import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { format } from 'date-fns';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

// Components
import DailyIntakeForm from './DailyIntakeForm';
import MealsList from './MealsList';
import WaterTracker from './WaterTracker';
import NutritionSummary from './NutritionSummary';

const Nutrition = () => {
  const [date, setDate] = useState(new Date());
  const [nutritionLog, setNutritionLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch nutrition log for the selected date
  useEffect(() => {
    const fetchNutritionLog = async () => {
      setLoading(true);
      try {
        // Format date as YYYY-MM-DD
        const formattedDate = format(date, 'yyyy-MM-dd');
        
          const response = await api.get('api/nutrition/logs', {
              params: {
                  startDate: formattedDate,
                  endDate: formattedDate,
                  limit: 1
              }
          });
         
        if (response.data.count > 0) {
          setNutritionLog(response.data.data[0]);
        } else {
          setNutritionLog(null);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching nutrition log:', err);
        setError('Failed to load nutrition data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionLog();
  }, [date]);

  // Create a new nutrition log
  const handleCreateLog = async () => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await api.post('api/nutrition/logs', {
        date: formattedDate,
        meals: [],
        waterIntake: 0
      });
      
      setNutritionLog(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error creating nutrition log:', err);
      setError('Failed to create nutrition log. Please try again.');
    }
  };

  // Handle date change
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setDate(newDate);
  };

  // Handle meal added
  const handleMealAdded = (updatedLog) => {
    setNutritionLog(updatedLog);
    setShowForm(false);
  };

  // Handle meal deleted
  const handleMealDeleted = (updatedLog) => {
    setNutritionLog(updatedLog);
  };

  // Handle water intake update
  const handleWaterUpdate = async (amount) => {
    if (!nutritionLog) return;
    
    try {
      const response = await api.patch('api/nutrition/water', {
        date: format(date, 'yyyy-MM-dd'),
        amount
      });
      
      setNutritionLog({
        ...nutritionLog,
        waterIntake: amount
      });
    } catch (err) {
      console.error('Error updating water intake:', err);
      setError('Failed to update water intake. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Nutrition Tracker</h1>
      
      {/* Date selector */}
      <div className="mb-6 flex items-center">
        <label htmlFor="date" className="mr-2 text-gray-700 dark:text-gray-300">Date:</label>
        <input 
          type="date" 
          id="date"
          value={format(date, 'yyyy-MM-dd')}
          onChange={handleDateChange}
          className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      {/* Error Message */}
      {error && (
        <Alert 
          type="error" 
          message={error}
          className="mb-4"
        />
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {nutritionLog ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Nutrition Summary */}
              <div>
                <NutritionSummary nutritionLog={nutritionLog} />
                
                <WaterTracker 
                  waterIntake={nutritionLog.waterIntake} 
                  onUpdate={handleWaterUpdate}
                />
              </div>
              
              {/* Right Column - Meals */}
              <div>
                <Card
                  title="Today's Meals"
                  className="mb-6"
                  footer={
                    <Button
                      onClick={() => setShowForm(!showForm)}
                      variant="primary"
                      fullWidth
                    >
                      {showForm ? "Cancel" : "Add Meal"}
                    </Button>
                  }
                >
                  {showForm ? (
                    <DailyIntakeForm 
                      nutritionLogId={nutritionLog._id}
                      onMealAdded={handleMealAdded}
                    />
                  ) : (
                    <MealsList 
                      meals={nutritionLog.meals} 
                      nutritionLogId={nutritionLog._id}
                      onMealDeleted={handleMealDeleted}
                    />
                  )}
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                No nutrition data found for {format(date, 'MMMM d, yyyy')}
              </p>
              <Button onClick={handleCreateLog} variant="primary">
                Create Nutrition Log
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nutrition;