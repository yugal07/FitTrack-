import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const ScheduledWorkoutForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    workoutId: '',
    scheduledFor: getTodayDate(),
    scheduledTime: '12:00',
    notes: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await api.get('/api/workouts');
        setWorkouts(response.data.data || []);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        toast.error('Failed to load workouts');
      }
    };

    const fetchScheduledWorkout = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/scheduled-workouts/${id}`);
        const workout = response.data.data;

        const date = new Date(workout.scheduledFor);
        const formattedDate = date.toISOString().split('T')[0];
        const formattedTime = date.toTimeString().split(' ')[0].substring(0, 5);

        setFormData({
          workoutId: workout.workoutId._id,
          scheduledFor: formattedDate,
          scheduledTime: formattedTime,
          notes: workout.notes || '',
        });

        setIsEdit(true);
      } catch (err) {
        console.error('Error fetching scheduled workout:', err);
        toast.error('Failed to load workout details');
        setError('Failed to load workout details');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();

    if (id) {
      fetchScheduledWorkout();
    } else {
      const todayString = getTodayDate();
      console.log('Setting today date:', todayString);
      setFormData(prev => ({
        ...prev,
        scheduledFor: todayString,
      }));
      setLoading(false);
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      // Combine date and time
      const dateTime = new Date(
        `${formData.scheduledFor}T${formData.scheduledTime}`
      );

      // Validate that the scheduled time is in the future
      const now = new Date();
      if (dateTime <= now) {
        toast.error('Please schedule the workout for a future date and time');
        return;
      }

      const payload = {
        workoutId: formData.workoutId,
        scheduledFor: dateTime.toISOString(),
        notes: formData.notes,
      };

      if (isEdit) {
        await api.put(`/api/scheduled-workouts/${id}`, payload);
        toast.success('Workout updated successfully');
      } else {
        await api.post('/api/scheduled-workouts', payload);
        toast.success('Workout scheduled successfully');
      }

      navigate('/workouts');
    } catch (err) {
      console.error('Error saving workout:', err);
      toast.error(
        isEdit ? 'Failed to update workout' : 'Failed to schedule workout'
      );
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div className='text-center py-8'>
          <p className='text-red-500'>{error}</p>
          <Button
            variant='primary'
            className='mt-4'
            onClick={() => navigate('/workouts')}
          >
            Back to Workouts
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {isEdit ? 'Edit Scheduled Workout' : 'Schedule a Workout'}
          </h1>
          <div className='mt-4 sm:mt-0'>
            <Button variant='secondary' onClick={() => navigate('/workouts')}>
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Workout Selection */}
          <div>
            <label
              htmlFor='workoutId'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Select Workout
            </label>
            <select
              id='workoutId'
              name='workoutId'
              value={formData.workoutId}
              onChange={handleChange}
              required
              className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            >
              <option value='' disabled>
                Select a workout
              </option>
              {workouts.map(workout => (
                <option key={workout._id} value={workout._id}>
                  {workout.name} ({workout.type} - {workout.duration} mins)
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label
              htmlFor='scheduledFor'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Date
            </label>
            <input
              type='date'
              id='scheduledFor'
              name='scheduledFor'
              value={formData.scheduledFor}
              onChange={handleChange}
              min={getTodayDate()}
              required
              className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            />
          </div>

          {/* Time Selection */}
          <div>
            <label
              htmlFor='scheduledTime'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Time
            </label>
            <input
              type='time'
              id='scheduledTime'
              name='scheduledTime'
              value={formData.scheduledTime}
              onChange={handleChange}
              required
              className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor='notes'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Notes (optional)
            </label>
            <textarea
              id='notes'
              name='notes'
              rows='4'
              value={formData.notes}
              onChange={handleChange}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              placeholder='Add any notes or reminders about this workout'
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end'>
            <Button type='submit' variant='primary'>
              {isEdit ? 'Update Workout' : 'Schedule Workout'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduledWorkoutForm;
