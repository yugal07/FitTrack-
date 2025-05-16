// client/src/components/admin/content/WorkoutForm.jsx
import { useState, useEffect } from 'react';
import adminService from '../../../services/adminService';

const WorkoutForm = ({ workout, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'strength',
    fitnessLevel: 'beginner',
    duration: 30,
    exercises: [],
    tags: []
  });
  
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseDetail, setExerciseDetail] = useState({
    sets: 3,
    reps: 10,
    duration: null,
    restTime: 60,
    order: 0
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  
  // Initialize form data when editing an existing workout
  useEffect(() => {
    if (workout) {
      setFormData({
        name: workout.name || '',
        description: workout.description || '',
        type: workout.type || 'strength',
        fitnessLevel: workout.fitnessLevel || 'beginner',
        duration: workout.duration || 30,
        exercises: workout.exercises?.map(ex => ({
          exerciseId: ex.exerciseId?._id || ex.exerciseId,
          exerciseName: ex.exerciseId?.name || '',
          sets: ex.sets || 3,
          reps: ex.reps || 10,
          duration: ex.duration || null,
          restTime: ex.restTime || 60,
          order: ex.order || 0
        })) || [],
        tags: workout.tags || []
      });
    }
  }, [workout]);
  
  // Fetch exercises
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoadingExercises(true);
        const response = await adminService.getExercises({ limit: 100 });
        setExercises(response.data);
      } catch (err) {
        console.error('Failed to fetch exercises:', err);
      } finally {
        setIsLoadingExercises(false);
      }
    };
    
    fetchExercises();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleExerciseDetailChange = (e) => {
    const { name, value } = e.target;
    setExerciseDetail(prev => ({
      ...prev,
      [name]: name === 'sets' || name === 'reps' || name === 'duration' || name === 'restTime' 
        ? parseInt(value, 10) || 0
        : value
    }));
  };
  
  const handleSelectedExerciseChange = (e) => {
    setSelectedExercise(e.target.value);
  };
  
  const handleAddExercise = () => {
    if (!selectedExercise) {
      setErrors(prev => ({
        ...prev,
        exercises: 'Please select an exercise to add'
      }));
      return;
    }
    
    const selectedExData = exercises.find(ex => ex._id === selectedExercise);
    
    if (!selectedExData) {
      return;
    }
    
    const newExercise = {
      exerciseId: selectedExData._id,
      exerciseName: selectedExData.name,
      sets: exerciseDetail.sets,
      reps: exerciseDetail.reps,
      duration: exerciseDetail.duration,
      restTime: exerciseDetail.restTime,
      order: formData.exercises.length + 1
    };
    
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
    
    // Reset selection
    setSelectedExercise('');
    setExerciseDetail({
      sets: 3,
      reps: 10,
      duration: null,
      restTime: 60,
      order: 0
    });
    
    // Clear validation error
    if (errors.exercises) {
      setErrors(prev => ({
        ...prev,
        exercises: null
      }));
    }
  };
  
  const handleRemoveExercise = (index) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
        .map((ex, i) => ({ ...ex, order: i + 1 }))
    }));
  };

  const handleReorderExercise = (index, direction) => {
    const newExercises = [...formData.exercises];
    
    if (direction === 'up' && index > 0) {
      // Swap with previous
      [newExercises[index], newExercises[index - 1]] = [newExercises[index - 1], newExercises[index]];
    } else if (direction === 'down' && index < newExercises.length - 1) {
      // Swap with next
      [newExercises[index], newExercises[index + 1]] = [newExercises[index + 1], newExercises[index]];
    }
    
    // Update the order property
    newExercises.forEach((ex, i) => {
      ex.order = i + 1;
    });
    
    setFormData(prev => ({
      ...prev,
      exercises: newExercises
    }));
  };
  
  const handleTagsChange = (e) => {
    const { value } = e.target;
    
    // Split by commas and trim each item
    const tagsList = value
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    setFormData(prev => ({
      ...prev,
      tags: tagsList
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required validations
    if (!formData.name.trim()) {
      newErrors.name = 'Workout name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.exercises.length === 0) {
      newErrors.exercises = 'At least one exercise is required';
    }
    
    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      // Format exercises for API
      exercises: formData.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration,
        restTime: ex.restTime,
        order: ex.order
      })),
      isCustom: false // Admin-created workouts are preset templates
    };
    
    try {
      const success = await onSubmit(submissionData);
      if (!success) {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };
  
  const typeOptions = [
    { value: 'strength', label: 'Strength' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'hiit', label: 'HIIT' },
    { value: 'custom', label: 'Custom' },
  ];
  
  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];
  
  return (
    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {workout ? 'Edit Workout Template' : 'Add New Workout Template'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {workout ? 'Update workout information' : 'Create a new workout template for users'}
          </p>
        </div>
        
        {/* Workout Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Workout Name <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.name ? 'border-red-300 dark:border-red-700' : ''}`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.description ? 'border-red-300 dark:border-red-700' : ''}`}
            ></textarea>
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Brief description of the workout and its benefits.
          </p>
        </div>
        
        {/* Type and Difficulty */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Workout Type <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Difficulty Level <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <select
                id="fitnessLevel"
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
                className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              >
                {difficultyOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Duration (minutes) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="duration"
              id="duration"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.duration ? 'border-red-300 dark:border-red-700' : ''}`}
            />
          </div>
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.duration}</p>
          )}
        </div>
        
        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="tags"
              id="tags"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              placeholder="e.g. full body, hiit, no equipment (comma-separated)"
              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter tags separated by commas to help users find this workout.
          </p>
        </div>
        
        {/* Exercises Section */}
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-white">
            Exercises <span className="text-red-500">*</span>
          </h3>
          
          {/* Exercise Selector */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="selectedExercise" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Exercise
                </label>
                <div className="mt-1">
                  <select
                    id="selectedExercise"
                    name="selectedExercise"
                    value={selectedExercise}
                    onChange={handleSelectedExerciseChange}
                    disabled={isLoadingExercises}
                    className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  >
                    <option value="">Select an exercise</option>
                    {isLoadingExercises ? (
                      <option value="" disabled>Loading exercises...</option>
                    ) : (
                      exercises.map(exercise => (
                        <option key={exercise._id} value={exercise._id}>
                          {exercise.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="sets" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sets
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="sets"
                      id="sets"
                      min="1"
                      value={exerciseDetail.sets}
                      onChange={handleExerciseDetailChange}
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="reps" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reps
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="reps"
                      id="reps"
                      min="0"
                      value={exerciseDetail.reps}
                      onChange={handleExerciseDetailChange}
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Duration (sec)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="duration"
                      id="duration"
                      min="0"
                      value={exerciseDetail.duration || ''}
                      onChange={handleExerciseDetailChange}
                      placeholder="Optional"
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="restTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rest (sec)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="restTime"
                      id="restTime"
                      min="0"
                      value={exerciseDetail.restTime}
                      onChange={handleExerciseDetailChange}
                      className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAddExercise}
                disabled={!selectedExercise}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
              >
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Exercise
              </button>
            </div>
          </div>
          
          {errors.exercises && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.exercises}</p>
          )}
          
          {/* Selected Exercises List */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Workout Exercises ({formData.exercises.length})
            </h4>
            
            {formData.exercises.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No exercises added yet. Use the form above to add exercises to this workout.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {formData.exercises.map((exercise, index) => (
                  <li key={index} className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6 text-gray-400 dark:text-gray-500">
                        {index + 1}.
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {exercise.exerciseName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {exercise.sets} sets × {exercise.reps} reps
                          {exercise.duration && ` • ${exercise.duration}s duration`}
                          {` • ${exercise.restTime}s rest`}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex">
                      <button
                        type="button"
                        onClick={() => handleReorderExercise(index, 'up')}
                        disabled={index === 0}
                        className="mr-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 disabled:opacity-50"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReorderExercise(index, 'down')}
                        disabled={index === formData.exercises.length - 1}
                        className="mr-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 disabled:opacity-50"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(index)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : workout ? 'Update Workout' : 'Create Workout'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default WorkoutForm;