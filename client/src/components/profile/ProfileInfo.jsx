// src/components/profile/ProfileInfo.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import ProfileEditForm from './ProfileEditForm';
import Card from '../ui/Card';

const ProfileInfo = () => {
  const { currentUser, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSaveProfile = async (formData) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.put('/api/users', formData);
      
      // Update local user context
      updateUser(response.data.data);
      
      setSuccess('Profile updated successfully');
      setEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title="Profile Information"
      subtitle="Manage your personal information"
    >
      {success && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {editing ? (
        <ProfileEditForm 
          initialData={currentUser} 
          onSave={handleSaveProfile}
          onCancel={() => setEditing(false)}
          loading={loading}
        />
      ) : (
        <div>
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="relative">
                {currentUser?.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture}
                    alt={`${currentUser.firstName} ${currentUser.lastName}`}
                    className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-4xl font-bold shadow-md">
                    {currentUser?.firstName?.charAt(0)}
                    {currentUser?.lastName?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentUser?.firstName} {currentUser?.lastName}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                {currentUser?.email}
              </p>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {currentUser?.fitnessLevel && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {currentUser.fitnessLevel.charAt(0).toUpperCase() + currentUser.fitnessLevel.slice(1)} Level
                  </span>
                )}
                
                {currentUser?.gender && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {currentUser.gender.charAt(0).toUpperCase() + currentUser.gender.slice(1)}
                  </span>
                )}
                
                {currentUser?.dateOfBirth && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {calculateAge(currentUser.dateOfBirth)} years old
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{currentUser?.firstName || '—'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{currentUser?.lastName || '—'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{currentUser?.email || '—'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {currentUser?.gender ? (
                    currentUser.gender.charAt(0).toUpperCase() + currentUser.gender.slice(1)
                  ) : '—'}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {currentUser?.dateOfBirth ? (
                    new Date(currentUser.dateOfBirth).toLocaleDateString()
                  ) : '—'}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Fitness Level</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {currentUser?.fitnessLevel ? (
                    currentUser.fitnessLevel.charAt(0).toUpperCase() + currentUser.fitnessLevel.slice(1)
                  ) : '—'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProfileInfo;