import { useState } from 'react';
import { useForm } from 'react-hook-form';
import adminService from '../../../services/adminService';

const AnnouncementCreator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // React Hook Form setup
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      title: '',
      message: '',
      targetUsers: 'all' // 'all', 'beginner', 'intermediate', 'advanced'
    }
  });
  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await adminService.sendAnnouncement(data);
      
      setSuccess(true);
      reset(); // Reset form to default values
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Failed to send announcement:', err);
      setError(err.error?.message || 'Failed to send announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Send Announcement</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Create and send notifications to users
        </p>
      </div>
      
      {/* Announcement Form */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-4 rounded-md text-green-700 dark:text-green-300">
            <p>Announcement sent successfully!</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-md text-red-700 dark:text-red-300">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Announcement Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="title"
                  placeholder="New Feature Announcement"
                  className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm ${
                    errors.title ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white rounded-md`}
                  {...register('title', {
                    required: 'Title is required',
                    validate: value => value.trim() !== '' || 'Title cannot be empty'
                  })}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Enter the announcement message here..."
                  className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm ${
                    errors.message ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white rounded-md`}
                  {...register('message', {
                    required: 'Message is required',
                    validate: value => value.trim() !== '' || 'Message cannot be empty'
                  })}
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="targetUsers" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Target Users
              </label>
              <div className="mt-1">
                <select
                  id="targetUsers"
                  className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  {...register('targetUsers', {
                    required: 'Please select target users'
                  })}
                >
                  <option value="all">All Users</option>
                  <option value="beginner">Beginner Users Only</option>
                  <option value="intermediate">Intermediate Users Only</option>
                  <option value="advanced">Advanced Users Only</option>
                </select>
                {errors.targetUsers && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.targetUsers.message}</p>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Choose which users will receive this announcement
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : 'Send Announcement'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Announcement Tips */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tips for Effective Announcements</h2>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Be Clear and Concise</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Keep your announcement clear and to the point. Users are more likely to read and understand shorter messages.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Use Descriptive Titles</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create informative titles that give users a clear idea of what the announcement is about.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Target Relevant Users</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Send announcements only to users who would find the information relevant to prevent notification fatigue.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Include Call to Action</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                When appropriate, include a clear call to action to help users understand what steps they should take next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCreator;