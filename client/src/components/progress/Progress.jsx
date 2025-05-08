import { useState } from 'react';
import Card from '../ui/Card';
import MeasurementTrends from './MeasurementTrends';
import PhotoComparison from './PhotoComparison';
import ProgressReport from './ProgressReport';
import WorkoutHistory from './WorkoutHistory';

const Progress = () => {
  const [activeTab, setActiveTab] = useState('trends');
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <h1 className="px-6 py-4 text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
          Progress Tracking
        </h1>
        
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'trends'
                  ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Measurement Trends
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'photos'
                  ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Photo Comparison
            </button>
            <button
              onClick={() => setActiveTab('workouts')}
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'workouts'
                  ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Workout History
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'report'
                  ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Progress Report
            </button>
          </nav>
        </div>
      </div>
      
      <div className="pb-6">
        {activeTab === 'trends' && <MeasurementTrends />}
        {activeTab === 'photos' && <PhotoComparison />}
        {activeTab === 'workouts' && <WorkoutHistory />}
        {activeTab === 'report' && <ProgressReport />}
      </div>
    </div>
  );
};

export default Progress;