import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { apiWithToast } from '../../utils/api';
import Button from '../ui/Button';

const ExerciseForm = ({ exercise = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    exerciseId: '',
    exerciseName: '',
    sets: [{ weight: '', reps: '', duration: '', completed: true }]
  });
  
  const [availableExercises, setAvailableExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCustomExercise, setIsCustomExercise] = useState(false);
  
  // Get toast functions
  const toast = useToast();
  // Get toast-enabled API
  const api = apiWithToast(toast);
  
  // Load exercises from API
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/exercises');
        setAvailableExercises(response.data.data);
      } catch (err) {
        // Error is handled by the API interceptor
        console.error('Error fetching exercises:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExercises();
  }, []);
  
  // If editing, load exercise data
  useEffect(() => {
    if (exercise) {
      setFormData({
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        sets: exercise.sets && exercise.sets.length > 0 
          ? exercise.sets 
          : [{ weight: '', reps: '', duration: '', completed: true }]
      });
      
      // Check if this is a custom exercise
      setIsCustomExercise(!availableExercises.some(ex => ex._id === exercise.exerciseId));
    }
  }, [exercise, availableExercises]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'exerciseId') {
      // If selecting from dropdown, set the name too
      const selectedExercise = availableExercises.find(ex => ex._id === value);
      
      if (value === 'custom') {
        setIsCustomExercise(true);
        setFormData(prev => ({
          ...prev,
          exerciseId: '',
          exerciseName: ''
        }));
      } else if (selectedExercise) {
        setIsCustomExercise(false);
        setFormData(prev => ({
          ...prev,
          exerciseId: value,
          exerciseName: selectedExercise.name
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSetChange = (index, field, value) => {
    setFormData(prev => {
      const updatedSets = [...prev.sets];
      updatedSets[index] = {
        ...updatedSets[index],
        [field]: value
      };
      
      return {
        ...prev,
        sets: updatedSets
      };
    });
  };
  
  const handleAddSet = () => {
    setFormData(prev => ({
      ...prev,
      sets: [...prev.sets, { weight: '', reps: '', duration: '', completed: true }]
    }));
  };
  
  const handleRemoveSet = (index) => {
    setFormData(prev => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if ((!formData.exerciseId && !isCustomExercise) || (isCustomExercise && !formData.exerciseName)) {
      toast.error('Please select or enter an exercise');
      return;
    }
    
    // For each set, ensure it has at least reps or duration
    const validSets = formData.sets.filter(set => {
      return set.reps || set.duration;
    });
    
    if (validSets.length === 0) {
      toast.error('Please add at least one set with reps or duration');
      return;
    }
    
    // Submit the valid data
    onSubmit({
      ...formData,
      sets: validSets
    });
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Exercise Selection */}
        <div>
          <label htmlFor="exerciseId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Exercise*
          </label>
          {isCustomExercise ? (
            <div className="mt-1">
              <input
                type="text"
                name="exerciseName"
                id="exerciseName"
                value={formData.exerciseName}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter custom exercise name"
                required
              />
              <div className="mt-2 flex items-center text-sm">
                <button
                  type="button"
                  onClick={() => setIsCustomExercise(false)}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  Select from existing exercises
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-1">
              <select
                id="exerciseId"
                name="exerciseId"
                value={formData.exerciseId}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required={!isCustomExercise}
              >
                <option value="">Select an exercise</option>
                {availableExercises.map(exercise => (
                  <option key={exercise._id} value={exercise._id}>
                    {exercise.name} ({exercise.muscleGroups.join(', ')})
                  </option>
                ))}
                <option value="custom">Add a custom exercise</option>
              </select>
            </div>
          )}
        </div>
        
        {/* Sets */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sets</h3>
            <Button 
              type="button"
              variant="secondary"
              onClick={handleAddSet}
              size="sm"
            >
              Add Set
            </Button>
          </div>
          
          <div className="space-y-4">
            {formData.sets.map((set, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Set {index + 1}</h4>
                  {formData.sets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSet(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor={`weight-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      id={`weight-${index}`}
                      value={set.weight}
                      onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Optional"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`reps-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reps
                    </label>
                    <input
                      type="number"
                      id={`reps-${index}`}
                      value={set.reps}
                      onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter reps"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`duration-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      id={`duration-${index}`}
                      value={set.duration}
                      onChange={(e) => handleSetChange(index, 'duration', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="For timed exercises"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={set.completed}
                      onChange={(e) => handleSetChange(index, 'completed', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Completed
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (exercise ? 'Update Exercise' : 'Add Exercise')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExerciseForm;