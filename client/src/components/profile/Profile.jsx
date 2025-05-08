
import { useState } from 'react';
import ProfileInfo from './ProfileInfo';
import MeasurementsTracker from './MeasurementsTracker';
import ProgressPhotos from './ProgressPhotos';
import ChangePassword from '../auth/ChangePassword';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'info'
                  ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab('measurements')}
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'measurements'
                  ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Measurements
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'photos'
                  ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Progress Photos
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'security'
                  ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Security
            </button>
          </nav>
        </div>
      </div>
      
      <div>
        {activeTab === 'info' && <ProfileInfo />}
        {activeTab === 'measurements' && <MeasurementsTracker />}
        {activeTab === 'photos' && <ProgressPhotos />}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Settings</h2>
            <ChangePassword />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;