import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../../utils/api';
import Card from '../ui/Card';
import ConfirmModal from '../ui/ConfirmModal';
import MeasurementForm from './MeasurementForm';
import MeasurementChart from './MeasurementChart';

const MeasurementsTracker = () => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [metricToDisplay, setMetricToDisplay] = useState('weight');

  // State for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    measurementId: null,
    measurementDate: '',
    loading: false,
  });

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/profiles/measurements');

      // Sort by date
      const sortedMeasurements = response.data.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setMeasurements(sortedMeasurements);
      setError('');
    } catch (err) {
      setError('Failed to load measurements');
      console.error('Error fetching measurements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeasurement = async measurementData => {
    try {
      setLoading(true);

      if (editingMeasurement) {
        // Update existing measurement
        await api.put(
          `/api/profiles/measurements/${editingMeasurement._id}`,
          measurementData
        );
        setSuccess('Measurement updated successfully');
      } else {
        // Add new measurement
        await api.post('/api/profiles/measurements', measurementData);
        setSuccess('Measurement added successfully');
      }

      // Reset form state and refresh data
      setShowForm(false);
      setEditingMeasurement(null);
      fetchMeasurements();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Failed to save measurement'
      );
      console.error('Error saving measurement:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMeasurement = measurement => {
    setEditingMeasurement(measurement);
    setShowForm(true);
  };

  const handleDeleteClick = measurement => {
    setDeleteConfirm({
      isOpen: true,
      measurementId: measurement._id,
      measurementDate: format(new Date(measurement.date), 'MMM d, yyyy'),
      loading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteConfirm(prev => ({ ...prev, loading: true }));

    try {
      await api.delete(
        `/api/profiles/measurements/${deleteConfirm.measurementId}`
      );

      setSuccess('Measurement deleted successfully');
      fetchMeasurements();

      setDeleteConfirm({
        isOpen: false,
        measurementId: null,
        measurementDate: '',
        loading: false,
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Failed to delete measurement'
      );
      console.error('Error deleting measurement:', err);
      setDeleteConfirm(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteCancel = () => {
    if (!deleteConfirm.loading) {
      setDeleteConfirm({
        isOpen: false,
        measurementId: null,
        measurementDate: '',
        loading: false,
      });
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingMeasurement(null);
  };

  return (
    <Card
      title='Body Measurements'
      subtitle='Track your body measurements over time'
    >
      {success && (
        <div className='mb-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg'>
          {success}
        </div>
      )}

      {error && (
        <div className='mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      <div className='flex justify-end mb-4'>
        <button
          type='button'
          onClick={() => setShowForm(true)}
          className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4 mr-2'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 4v16m8-8H4'
            />
          </svg>
          Add Measurement
        </button>
      </div>

      {showForm && (
        <div className='mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
            {editingMeasurement ? 'Edit Measurement' : 'Add New Measurement'}
          </h3>
          <MeasurementForm
            initialData={editingMeasurement}
            onSubmit={handleAddMeasurement}
            onCancel={cancelForm}
            loading={loading}
          />
        </div>
      )}

      {/* Visualization */}
      {measurements.length > 0 && (
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              Progress Chart
            </h3>
            <div className='flex items-center'>
              <span className='text-sm text-gray-500 dark:text-gray-400 mr-2'>
                Metric:
              </span>
              <select
                value={metricToDisplay}
                onChange={e => setMetricToDisplay(e.target.value)}
                className='block w-auto pl-3 pr-10 py-1 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
              >
                <option value='weight'>Weight</option>
                <option value='bodyFat'>Body Fat %</option>
                <option value='chest'>Chest</option>
                <option value='waist'>Waist</option>
                <option value='hips'>Hips</option>
                <option value='arms'>Arms</option>
                <option value='thighs'>Thighs</option>
              </select>
            </div>
          </div>

          <MeasurementChart
            measurements={measurements}
            metricToDisplay={metricToDisplay}
          />
        </div>
      )}

      {/* Measurements table */}
      <div>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Measurement History
        </h3>

        {loading && measurements.length === 0 ? (
          <div className='text-center py-8'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto'></div>
            <p className='mt-3 text-sm text-gray-600 dark:text-gray-400'>
              Loading measurements...
            </p>
          </div>
        ) : measurements.length === 0 ? (
          <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
            No measurements recorded yet.
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-800'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                  >
                    Date
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                  >
                    Weight
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                  >
                    Body Fat
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                  >
                    Chest
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                  >
                    Waist
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                  >
                    Hips
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                {measurements.map(measurement => (
                  <tr key={measurement._id}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                      {format(new Date(measurement.date), 'MMM d, yyyy')}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                      {measurement.weight ? `${measurement.weight} kg` : '—'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                      {measurement.bodyFat ? `${measurement.bodyFat}%` : '—'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                      {measurement.chest ? `${measurement.chest} cm` : '—'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                      {measurement.waist ? `${measurement.waist} cm` : '—'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                      {measurement.hips ? `${measurement.hips} cm` : '—'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <button
                        onClick={() => handleEditMeasurement(measurement)}
                        className='text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(measurement)}
                        className='text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title='Delete Measurement'
        message={`Are you sure you want to delete the measurement from ${deleteConfirm.measurementDate}? This action cannot be undone and will permanently remove this measurement from your tracking history.`}
        confirmText='Delete Measurement'
        cancelText='Cancel'
        variant='danger'
        loading={deleteConfirm.loading}
      />
    </Card>
  );
};

export default MeasurementsTracker;
