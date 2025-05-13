import { useState } from 'react';
import { format } from 'date-fns';
import Button from '../ui/Button';

const WorkoutDetail = ({ workout, onClose, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState('exercises');
  
  if (!workout) return null;
  
  // Format date
  const formattedDate = format(new Date(workout.date), 'EEEE, MMMM d, yyyy');
  const formattedTime = format(new Date(workout.date), 'h:mm a');
  
  // Calculate total sets, reps, and weight
  const exerciseStats = workout.completedExercises?.reduce((stats, exercise) => {
    const exerciseSets = exercise.sets?.length || 0;
    const exerciseReps = exercise.sets?.reduce((total, set) => total + (set.reps ? parseInt(set.reps) : 0), 0) || 0;
    const exerciseWeight = exercise.sets?.reduce((total, set) => total + (set.weight ? parseFloat(set.weight) : 0), 0) || 0;
    
    return {
      sets: stats.sets + exerciseSets,
      reps: stats.reps + exerciseReps,
      weight: stats.weight + exerciseWeight
    };
  }, { sets: 0, reps: 0, weight: 0 });
  
  // Format workout type
  const formatWorkoutType = (type) => {
    if (!type) return 'Custom';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 dark:bg-indigo-700 text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{workout.workoutId?.name || 'Custom Workout'}</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-indigo-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-1 text-indigo-100">
          {formattedDate} at {formattedTime}
        </div>
      </div>
      
      {/* Overview */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</div>
            <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{workout.duration} min</div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Workout Type</div>
            <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{formatWorkoutType(workout.workoutId?.type)}</div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories Burned</div>
            <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{workout.caloriesBurned ? `${workout.caloriesBurned} kcal` : '—'}</div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Rating</div>
            <div className="mt-1 flex">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i}
                  className={`h-5 w-5 ${
                    i < (workout.rating || 0)
                      ? 'text-yellow-400' 
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-6 py-3 font-medium text-sm border-b-2 ${
              activeTab === 'exercises'
                ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Exercises
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 font-medium text-sm border-b-2 ${
              activeTab === 'stats'
                ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-6 py-3 font-medium text-sm border-b-2 ${
              activeTab === 'notes'
                ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Notes
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'exercises' && (
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Completed Exercises ({workout.completedExercises?.length || 0})
            </div>
            
            {workout.completedExercises?.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No exercises recorded for this workout.
              </div>
            ) : (
              <div className="space-y-4">
                {workout.completedExercises?.map((exercise, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {exercise.exerciseId?.name || 'Unknown Exercise'}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {exercise.sets?.length || 0} {exercise.sets?.length === 1 ? 'set' : 'sets'}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {exercise.exerciseId?.muscleGroups?.join(', ')}
                      </div>
                    </div>
                    
                    {/* Show sets */}
                    {exercise.sets && exercise.sets.length > 0 && (
                      <div className="mt-3 border-t border-gray-200 dark:border-gray-600 pt-3">
                        <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          <div>Set</div>
                          <div>Weight</div>
                          <div>Reps/Time</div>
                          <div>Status</div>
                        </div>
                        {exercise.sets.map((set, setIndex) => (
                          <div key={setIndex} className="grid grid-cols-4 gap-2 text-sm">
                            <div>{setIndex + 1}</div>
                            <div>{set.weight ? `${set.weight} kg` : '—'}</div>
                            <div>
                              {set.reps ? `${set.reps} reps` : ''}
                              {set.duration ? `${set.duration}s` : ''}
                              {!set.reps && !set.duration ? '—' : ''}
                            </div>
                            <div>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                set.completed
                                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                  : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                              }`}>
                                {set.completed ? 'Completed' : 'Skipped'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Workout Statistics
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{exerciseStats.sets}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Sets</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{exerciseStats.reps}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Reps</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{exerciseStats.weight.toFixed(1)} kg</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Weight</div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="text-base font-medium text-gray-900 dark:text-white mb-2">
                Difficulty Level
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-600">
                  <div 
                    style={{ width: `${(workout.difficulty || 0) * 20}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <div>Easy</div>
                  <div>Moderate</div>
                  <div>Hard</div>
                </div>
              </div>
              <div className="text-sm text-center mt-2 text-gray-500 dark:text-gray-400">
                Reported difficulty: {workout.difficulty ? `${workout.difficulty}/5` : 'Not rated'}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div>
            <div className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Workout Notes
            </div>
            
            {workout.notes ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {workout.notes}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No notes recorded for this workout.
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-between">
        <Button
          variant="danger"
          onClick={onDelete}
        >
          Delete
        </Button>
        
        <Button
          variant="primary"
          onClick={onEdit}
        >
          Edit Workout
        </Button>
      </div>
    </div>
  );
};

export default WorkoutDetail;