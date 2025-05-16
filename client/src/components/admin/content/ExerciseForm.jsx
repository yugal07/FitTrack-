// client/src/components/admin/content/ExerciseForm.jsx
import { useState, useEffect } from 'react';

const ExerciseForm = ({ exercise, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    muscleGroups: [],
    difficulty: 'beginner',
    instructions: '',
    videoUrl: '',
    imageUrl: '',
    equipment: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form data when editing an existing exercise
  useEffect(() => {
    if (exercise) {
      setFormData({
        name: exercise.name || '',
        description: exercise.description || '',
        muscleGroups: exercise.muscleGroups || [],
        difficulty: exercise.difficulty || 'beginner',
        instructions: exercise.instructions || '',
        videoUrl: exercise.videoUrl || '',
        imageUrl: exercise.imageUrl || '',
        equipment: exercise.equipment || []
      });
    }
  }, [exercise]);
  
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
  
  const handleMuscleGroupChange = (e) => {
    const { options } = e.target;
    const selectedValues = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      muscleGroups: selectedValues
    }));
    
    // Clear validation error
    if (errors.muscleGroups) {
      setErrors(prev => ({
        ...prev,
        muscleGroups: null
      }));
    }
  };
  
  const handleEquipmentChange = (e) => {
    const { value } = e.target;
    
    // Split by commas and trim each item
    const equipmentList = value
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    setFormData(prev => ({
      ...prev,
      equipment: equipmentList
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required validations
    if (!formData.name.trim()) {
      newErrors.name = 'Exercise name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.muscleGroups.length === 0) {
      newErrors.muscleGroups = 'At least one muscle group is required';
    }
    
    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }
    
    // URL validations (if provided)
    if (formData.videoUrl && !isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid URL';
    }
    
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const muscleGroupOptions = [
    { value: 'chest', label: 'Chest' },
    { value: 'back', label: 'Back' },
    { value: 'shoulders', label: 'Shoulders' },
    { value: 'arms', label: 'Arms' },
    { value: 'legs', label: 'Legs' },
    { value: 'core', label: 'Core' },
    { value: 'full body', label: 'Full Body' },
    { value: 'cardio', label: 'Cardio' },
  ];
  
  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];
  
  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {exercise ? 'Edit Exercise' : 'Add New Exercise'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {exercise ? 'Update exercise information' : 'Create a new exercise in the library'}
          </p>
        </div>
        
        {/* Exercise Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Exercise Name <span className="text-red-500">*</span>
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
            Brief description of the exercise and its benefits.
          </p>
        </div>
        
        {/* Muscle Groups */}
        <div>
          <label htmlFor="muscleGroups" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Muscle Groups <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <select
              id="muscleGroups"
              name="muscleGroups"
              multiple
              value={formData.muscleGroups}
              onChange={handleMuscleGroupChange}
              className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.muscleGroups ? 'border-red-300 dark:border-red-700' : ''}`}
            >
              {muscleGroupOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          {errors.muscleGroups && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.muscleGroups}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Hold Ctrl/Cmd key to select multiple muscle groups.
          </p>
        </div>
        
        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Difficulty Level <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            >
              {difficultyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Instructions */}
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Instructions <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <textarea
              id="instructions"
              name="instructions"
              rows={5}
              value={formData.instructions}
              onChange={handleChange}
              className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.instructions ? 'border-red-300 dark:border-red-700' : ''}`}
            ></textarea>
          </div>
          {errors.instructions && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.instructions}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Step-by-step instructions on how to perform the exercise correctly.
          </p>
        </div>
        
        {/* Video URL */}
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Video URL
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="videoUrl"
              id="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.videoUrl ? 'border-red-300 dark:border-red-700' : ''}`}
            />
          </div>
          {errors.videoUrl && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.videoUrl}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Optional: Link to a demonstration video.
          </p>
        </div>
        
        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image URL
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="imageUrl"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.imageUrl ? 'border-red-300 dark:border-red-700' : ''}`}
            />
          </div>
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.imageUrl}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Optional: URL for an exercise image.
          </p>
        </div>
        
        {/* Equipment */}
        <div>
          <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Equipment Required
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="equipment"
              id="equipment"
              value={formData.equipment.join(', ')}
              onChange={handleEquipmentChange}
              placeholder="e.g. dumbbells, bench, barbell (comma-separated)"
              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter equipment needed, separated by commas. Leave empty if no equipment is required.
          </p>
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
            ) : exercise ? 'Update Exercise' : 'Create Exercise'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ExerciseForm;