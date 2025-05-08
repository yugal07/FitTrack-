import React from 'react';
import { format } from 'date-fns';

const RecentMeasurements = ({ measurements = [] }) => {
  if (measurements.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Measurements</h2>
        <div className="mt-4 text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No measurements recorded yet.</p>
          <button 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add Measurement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Measurements</h2>
      <div className="mt-4">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Weight</th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Body Fat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {measurements.map((measurement) => (
              <tr key={measurement._id}>
                <td className="text-sm text-gray-900 dark:text-white py-2">
                  {format(new Date(measurement.date), 'MMM d')}
                </td>
                <td className="text-sm text-gray-900 dark:text-white py-2">
                  {measurement.weight ? `${measurement.weight} kg` : '—'}
                </td>
                <td className="text-sm text-gray-900 dark:text-white py-2">
                  {measurement.bodyFat ? `${measurement.bodyFat}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-center">
        <a href="/profile/measurements" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
          View all measurements →
        </a>
      </div>
    </div>
  );
};

export default RecentMeasurements;