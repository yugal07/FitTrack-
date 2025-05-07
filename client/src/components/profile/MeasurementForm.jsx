// src/components/profile/MeasurementForm.jsx
import { useState } from 'react';

const MeasurementForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    weight: initialData?.weight || '',
    bodyFat: initialData?.bodyFat || '',
    chest: initialData?.chest || '',
    waist: initialData?.waist || '',
    hips: initialData?.hips || '',
    arms: initialData?.arms || '',
    thighs: initialData?.thighs || '',
    notes: initialData?.notes || ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string values to numbers where applicable
    const processedData = {
      ...formData,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
      chest: formData.chest ? parseFloat(formData.chest) : undefined,
      waist: formData.waist ? parseFloat(formData.waist) : undefined,
      hips: formData.hips ? parseFloat(formData.hips) : undefined,
      arms: formData.arms ? parseFloat(formData.arms) : undefined,
      thighs: formData.thighs ? parseFloat(formData.thighs) : undefined
    };
    
    onSubmit(processedData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Weight (kg)
          </label>
          <input
            type="number"
            step="0.1"
            name="weight"
            id="weight"
            value={formData.weight}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Body Fat (%)
          </label>
          <input
            type="number"
            step="0.1"
            name="bodyFat"
            id="bodyFat"
            value={formData.bodyFat}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="chest" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Chest (cm)
          </label>
          <input
            type="number"
            step="0.1"
            name="chest"
            id="chest"
            value={formData.chest}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="waist" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Waist (cm)
          </label>
          <input
            type="number"
            step="0.1"
            name="waist"
            id="waist"
            value={formData.waist}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="hips" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Hips (cm)
          </label>
          <input
            type="number"
            step="0.1"
            name="hips"
            id="hips"
            value={formData.hips}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="arms" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Arms (cm)
          </label>
          <input
            type="number"
            step="0.1"
            name="arms"
            id="arms"
            value={formData.arms}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="thighs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Thighs (cm)
          </label>
          <input
            type="number"
            step="0.1"
            name="thighs"
            id="thighs"
            value={formData.thighs}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
          />
        </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
        </form>
        );
        };
        
        export default MeasurementForm;