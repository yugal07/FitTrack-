// src/components/dashboard/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // This is a placeholder for loading additional dashboard data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg transition-colors">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Welcome to FitTrack Pro!
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Your personal fitness tracking application.
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Information</h3>
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{currentUser?.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Fitness level</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {currentUser?.fitnessLevel ? 
                      currentUser.fitnessLevel.charAt(0).toUpperCase() + currentUser.fitnessLevel.slice(1) : 
                      'Not set'}
                  </dd>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Action cards */}
                <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg transition-colors">
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">Start a Workout</h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                      Choose from our library of workouts or create your own.
                    </p>
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-700"
                    >
                      View Workouts
                    </button>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg transition-colors">
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">Set a Goal</h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                      Define and track your fitness goals.
                    </p>
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-700"
                    >
                      Manage Goals
                    </button>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg transition-colors">
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">Track Nutrition</h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                      Log your meals and track your nutritional intake.
                    </p>
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-700"
                    >
                      Log Nutrition
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;