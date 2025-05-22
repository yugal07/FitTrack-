import React, { useState, useEffect } from 'react';
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from 'date-fns';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../utils/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ProgressReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportPeriod, setReportPeriod] = useState('last-month');
  const [measurements, setMeasurements] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Define date ranges for report periods
  const getDateRange = () => {
    const now = new Date();

    switch (reportPeriod) {
      case 'last-month':
        const lastMonth = subMonths(now, 1);
        return {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth),
          label: format(lastMonth, 'MMMM yyyy'),
        };
      case 'current-month':
        return {
          start: startOfMonth(now),
          end: now,
          label: format(now, 'MMMM yyyy') + ' (So Far)',
        };
      case 'last-3-months':
        return {
          start: startOfMonth(subMonths(now, 3)),
          end: now,
          label: `Last 3 Months (${format(subMonths(now, 3), 'MMMM')} - ${format(now, 'MMMM yyyy')})`,
        };
      default:
        return {
          start: startOfMonth(subMonths(now, 1)),
          end: endOfMonth(subMonths(now, 1)),
          label: format(subMonths(now, 1), 'MMMM yyyy'),
        };
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportPeriod]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const dateRange = getDateRange();

      // Fetch measurements
      const measurementsRes = await api.get('/api/profiles/measurements');

      // Fetch workouts
      const workoutsRes = await api.get('/api/workout-sessions');

      // Fetch goals
      const goalsRes = await api.get('/api/goals');

      // Fetch nutrition data
      const nutritionRes = await api.get('/api/nutrition/logs');

      // Filter data by date range
      const filteredMeasurements = measurementsRes.data.data.filter(item =>
        isWithinInterval(new Date(item.date), {
          start: dateRange.start,
          end: dateRange.end,
        })
      );

      const filteredWorkouts = workoutsRes.data.data.filter(item =>
        isWithinInterval(new Date(item.date), {
          start: dateRange.start,
          end: dateRange.end,
        })
      );

      // For goals, include active ones and ones completed during the period
      const filteredGoals = goalsRes.data.data.filter(
        item =>
          item.status === 'active' ||
          (item.status === 'completed' &&
            isWithinInterval(new Date(item.targetDate), {
              start: dateRange.start,
              end: dateRange.end,
            }))
      );

      const filteredNutrition = nutritionRes.data.data.filter(item =>
        isWithinInterval(new Date(item.date), {
          start: dateRange.start,
          end: dateRange.end,
        })
      );

      // Sort data by date
      const sortedMeasurements = filteredMeasurements.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      const sortedWorkouts = filteredWorkouts.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      const sortedNutrition = filteredNutrition.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setMeasurements(sortedMeasurements);
      setWorkouts(sortedWorkouts);
      setGoals(filteredGoals);
      setNutrition(sortedNutrition);

      setError('');
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    setGeneratingPdf(true);

    try {
      const dateRange = getDateRange();
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text(`Fitness Progress Report - ${dateRange.label}`, 105, 15, {
        align: 'center',
      });

      // Add date generated
      doc.setFontSize(10);
      doc.text(`Generated on: ${format(new Date(), 'MMMM d, yyyy')}`, 105, 22, {
        align: 'center',
      });

      let yPos = 30;

      // Add summary section
      doc.setFontSize(14);
      doc.text('Summary', 14, yPos);

      yPos += 8;
      doc.setFontSize(10);
      doc.text(`Total Workouts: ${workouts.length}`, 14, yPos);

      yPos += 6;
      const totalDuration = workouts.reduce(
        (total, workout) => total + (workout.duration || 0),
        0
      );
      doc.text(
        `Total Workout Duration: ${Math.round(totalDuration)} minutes`,
        14,
        yPos
      );

      yPos += 6;
      const totalCalories = workouts.reduce(
        (total, workout) => total + (workout.caloriesBurned || 0),
        0
      );
      doc.text(
        `Total Calories Burned: ${Math.round(totalCalories)} kcal`,
        14,
        yPos
      );

      yPos += 6;
      const completedGoals = goals.filter(
        goal => goal.status === 'completed'
      ).length;
      doc.text(`Goals Completed: ${completedGoals}`, 14, yPos);

      // Add measurements section if available
      if (measurements.length > 0) {
        yPos += 12;
        doc.setFontSize(14);
        doc.text('Measurements', 14, yPos);

        yPos += 8;
        doc.setFontSize(10);

        // Find first and last measurements for comparison
        const firstMeasurement = measurements[0];
        const lastMeasurement = measurements[measurements.length - 1];

        if (firstMeasurement && lastMeasurement) {
          const metrics = [
            { id: 'weight', label: 'Weight (kg)' },
            { id: 'bodyFat', label: 'Body Fat (%)' },
            { id: 'chest', label: 'Chest (cm)' },
            { id: 'waist', label: 'Waist (cm)' },
            { id: 'hips', label: 'Hips (cm)' },
          ];

          // Create manual table headers
          doc.setFillColor(79, 70, 229);
          doc.setTextColor(255, 255, 255);
          doc.rect(14, yPos, 180, 8, 'F');
          doc.text('Metric', 16, yPos + 5);
          doc.text('Start', 60, yPos + 5);
          doc.text('End', 100, yPos + 5);
          doc.text('Change', 140, yPos + 5);
          yPos += 8;

          // Reset text color
          doc.setTextColor(0, 0, 0);

          // Create rows
          for (let i = 0; i < metrics.length; i++) {
            const metric = metrics[i];
            if (
              firstMeasurement[metric.id] !== undefined &&
              lastMeasurement[metric.id] !== undefined
            ) {
              const change =
                lastMeasurement[metric.id] - firstMeasurement[metric.id];
              const changeFormatted = change.toFixed(1);
              const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';

              // Add zebra striping
              if (i % 2 === 0) {
                doc.setFillColor(240, 240, 240);
                doc.rect(14, yPos, 180, 8, 'F');
              }

              doc.text(metric.label.split(' ')[0], 16, yPos + 5);
              doc.text(
                firstMeasurement[metric.id]?.toFixed(1) || '-',
                60,
                yPos + 5
              );
              doc.text(
                lastMeasurement[metric.id]?.toFixed(1) || '-',
                100,
                yPos + 5
              );
              doc.text(`${changeFormatted} ${arrow}`, 140, yPos + 5);

              yPos += 8;
            }
          }
        } else {
          doc.text('No measurement data available for comparison', 14, yPos);
          yPos += 6;
        }
      } else {
        yPos += 6;
        doc.text('No measurement data available for this period', 14, yPos);
        yPos += 6;
      }

      // Add workouts section
      yPos += 6;
      doc.setFontSize(14);
      doc.text('Workout Summary', 14, yPos);

      yPos += 8;
      doc.setFontSize(10);

      if (workouts.length > 0) {
        // Group workouts by type
        const workoutsByType = workouts.reduce((acc, workout) => {
          const type = workout.workoutId?.type || 'unknown';
          if (!acc[type]) acc[type] = 0;
          acc[type]++;
          return acc;
        }, {});

        // Create manual table headers for workout types
        doc.setFillColor(79, 70, 229);
        doc.setTextColor(255, 255, 255);
        doc.rect(14, yPos, 180, 8, 'F');
        doc.text('Workout Type', 16, yPos + 5);
        doc.text('Count', 100, yPos + 5);
        doc.text('Percentage', 140, yPos + 5);
        yPos += 8;

        // Reset text color
        doc.setTextColor(0, 0, 0);

        // Create rows for workout types
        let i = 0;
        for (const [type, count] of Object.entries(workoutsByType)) {
          // Add zebra striping
          if (i % 2 === 0) {
            doc.setFillColor(240, 240, 240);
            doc.rect(14, yPos, 180, 8, 'F');
          }

          const percentage = Math.round((count / workouts.length) * 100);
          const displayType = type.charAt(0).toUpperCase() + type.slice(1);

          doc.text(displayType, 16, yPos + 5);
          doc.text(count.toString(), 100, yPos + 5);
          doc.text(`${percentage}%`, 140, yPos + 5);

          yPos += 8;
          i++;
        }

        // Section for recent workouts
        yPos += 8;
        doc.setFontSize(12);
        doc.text('Recent Workouts', 14, yPos);
        yPos += 6;

        // Create manual table headers for recent workouts
        doc.setFontSize(10);
        doc.setFillColor(79, 70, 229);
        doc.setTextColor(255, 255, 255);
        doc.rect(14, yPos, 180, 8, 'F');
        doc.text('Date', 16, yPos + 5);
        doc.text('Workout', 55, yPos + 5);
        doc.text('Duration', 120, yPos + 5);
        doc.text('Calories', 160, yPos + 5);
        yPos += 8;

        // Reset text color
        doc.setTextColor(0, 0, 0);

        // Create rows for recent workouts
        for (let i = 0; i < Math.min(5, workouts.length); i++) {
          const workout = workouts[i];

          // Add zebra striping
          if (i % 2 === 0) {
            doc.setFillColor(240, 240, 240);
            doc.rect(14, yPos, 180, 8, 'F');
          }

          doc.text(format(new Date(workout.date), 'MMM d, yyyy'), 16, yPos + 5);
          doc.text(workout.workoutId?.name || 'Unknown', 55, yPos + 5);
          doc.text(`${workout.duration || 0} mins`, 120, yPos + 5);
          doc.text(`${workout.caloriesBurned || 0} kcal`, 160, yPos + 5);

          yPos += 8;
        }
      } else {
        doc.text('No workout data available for this period', 14, yPos);
        yPos += 6;
      }

      // Add goals section
      yPos += 10;
      doc.setFontSize(14);
      doc.text('Goals Progress', 14, yPos);

      yPos += 8;

      if (goals.length > 0) {
        // Create manual table headers for goals
        doc.setFontSize(10);
        doc.setFillColor(79, 70, 229);
        doc.setTextColor(255, 255, 255);
        doc.rect(14, yPos, 180, 8, 'F');
        doc.text('Goal', 16, yPos + 5);
        doc.text('Status', 95, yPos + 5);
        doc.text('Progress', 130, yPos + 5);
        doc.text('Completion', 165, yPos + 5);
        yPos += 8;

        // Reset text color
        doc.setTextColor(0, 0, 0);

        // Create rows for goals
        for (let i = 0; i < goals.length; i++) {
          const goal = goals[i];

          // Add zebra striping
          if (i % 2 === 0) {
            doc.setFillColor(240, 240, 240);
            doc.rect(14, yPos, 180, 8, 'F');
          }

          const progress = Math.min(
            100,
            Math.round((goal.currentValue / goal.targetValue) * 100)
          );

          // Limit text length to fit in cells
          const goalTitle = getGoalTitle(goal);
          const truncatedTitle =
            goalTitle.length > 35
              ? goalTitle.substring(0, 32) + '...'
              : goalTitle;

          doc.text(truncatedTitle, 16, yPos + 5);
          doc.text(
            goal.status.charAt(0).toUpperCase() + goal.status.slice(1),
            95,
            yPos + 5
          );
          doc.text(
            `${goal.currentValue} / ${goal.targetValue} ${goal.unit || ''}`,
            130,
            yPos + 5
          );
          doc.text(`${progress}%`, 165, yPos + 5);

          yPos += 8;
        }
      } else {
        doc.text('No goals data available for this period', 14, yPos);
        yPos += 6;
      }

      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          'FitTrack Pro - Progress Report',
          14,
          doc.internal.pageSize.height - 10
        );
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 25,
          doc.internal.pageSize.height - 10
        );
      }

      // Save the PDF
      doc.save(
        `FitTrack_Progress_Report_${dateRange.label.replace(/\s/g, '_')}.pdf`
      );
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF report');
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Helper function to generate a human-readable goal title
  const getGoalTitle = goal => {
    switch (goal.type) {
      case 'weight':
        return `Reach ${goal.targetValue} ${goal.unit} weight`;
      case 'strength':
        return `Increase strength to ${goal.targetValue} ${goal.unit}`;
      case 'endurance':
        return `Build endurance to ${goal.targetValue} ${goal.unit}`;
      case 'habit':
        return `Complete ${goal.targetValue} workouts`;
      case 'nutrition':
        return `Maintain ${goal.targetValue} ${goal.unit} diet`;
      case 'custom':
      default:
        return goal.type.charAt(0).toUpperCase() + goal.type.slice(1);
    }
  };

  return (
    <div className='space-y-6'>
      <Card
        title='Progress Report'
        subtitle='Generate comprehensive reports of your fitness journey'
      >
        <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0'>
          {/* Report period selector */}
          <div className='flex items-center space-x-3'>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              Report period:
            </span>
            <select
              value={reportPeriod}
              onChange={e => setReportPeriod(e.target.value)}
              className='block w-auto pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
            >
              <option value='last-month'>Last Month</option>
              <option value='current-month'>Current Month</option>
              <option value='last-3-months'>Last 3 Months</option>
            </select>
          </div>

          <div>
            <Button
              variant='primary'
              onClick={generatePDF}
              disabled={generatingPdf || loading || error}
            >
              {generatingPdf ? 'Generating...' : 'Download PDF Report'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className='text-center py-16'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto'></div>
            <p className='mt-3 text-sm text-gray-600 dark:text-gray-400'>
              Loading report data...
            </p>
          </div>
        ) : error ? (
          <div className='text-center py-16'>
            <div className='mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-8 text-red-600 dark:text-red-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <p className='mt-3 text-sm text-red-600 dark:text-red-400'>
              {error}
            </p>
          </div>
        ) : (
          <div className='space-y-8'>
            <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                Report Summary - {getDateRange().label}
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm'>
                  <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Total Workouts
                  </div>
                  <div className='mt-1 text-3xl font-bold text-gray-900 dark:text-white'>
                    {workouts.length}
                  </div>
                </div>

                <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm'>
                  <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Total Duration
                  </div>
                  <div className='mt-1 text-3xl font-bold text-gray-900 dark:text-white'>
                    {Math.round(
                      workouts.reduce(
                        (total, workout) => total + (workout.duration || 0),
                        0
                      )
                    )}{' '}
                    <span className='text-lg font-normal'>min</span>
                  </div>
                </div>

                <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm'>
                  <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Calories Burned
                  </div>
                  <div className='mt-1 text-3xl font-bold text-gray-900 dark:text-white'>
                    {Math.round(
                      workouts.reduce(
                        (total, workout) =>
                          total + (workout.caloriesBurned || 0),
                        0
                      )
                    )}{' '}
                    <span className='text-lg font-normal'>kcal</span>
                  </div>
                </div>

                <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm'>
                  <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Goals Completed
                  </div>
                  <div className='mt-1 text-3xl font-bold text-gray-900 dark:text-white'>
                    {goals.filter(goal => goal.status === 'completed').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Measurement Changes */}
            {measurements.length > 1 && (
              <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  Measurement Changes
                </h3>

                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                    <thead className='bg-gray-50 dark:bg-gray-800'>
                      <tr>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                        >
                          Metric
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                        >
                          Start
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                        >
                          End
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                        >
                          Change
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                      {[
                        'weight',
                        'bodyFat',
                        'chest',
                        'waist',
                        'hips',
                        'arms',
                        'thighs',
                      ]
                        .map(metric => {
                          const firstMeasurement = measurements[0];
                          const lastMeasurement =
                            measurements[measurements.length - 1];

                          if (
                            firstMeasurement[metric] === undefined ||
                            lastMeasurement[metric] === undefined
                          ) {
                            return null;
                          }

                          const change =
                            lastMeasurement[metric] - firstMeasurement[metric];
                          const changeFormatted = change.toFixed(1);

                          // Determine if change is positive based on metric
                          let changeClass;
                          if (['weight', 'bodyFat', 'waist'].includes(metric)) {
                            // For these metrics, decrease is typically positive
                            changeClass =
                              change < 0
                                ? 'text-green-600 dark:text-green-400'
                                : change > 0
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-gray-500 dark:text-gray-400';
                          } else {
                            // For other metrics, increase is typically positive
                            changeClass =
                              change > 0
                                ? 'text-green-600 dark:text-green-400'
                                : change < 0
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-gray-500 dark:text-gray-400';
                          }

                          // Get metric label
                          const metricLabels = {
                            weight: 'Weight (kg)',
                            bodyFat: 'Body Fat (%)',
                            chest: 'Chest (cm)',
                            waist: 'Waist (cm)',
                            hips: 'Hips (cm)',
                            arms: 'Arms (cm)',
                            thighs: 'Thighs (cm)',
                          };

                          return (
                            <tr key={metric}>
                              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                                {metricLabels[metric]}
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                                {firstMeasurement[metric]?.toFixed(1)}
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                                {lastMeasurement[metric]?.toFixed(1)}
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${changeClass}`}
                              >
                                {change > 0 ? '+' : ''}
                                {changeFormatted}
                              </td>
                            </tr>
                          );
                        })
                        .filter(Boolean)}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Workouts Summary */}
            {workouts.length > 0 && (
              <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  Workout Summary
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <h4 className='text-base font-medium text-gray-800 dark:text-gray-200 mb-3'>
                      Recent Workouts
                    </h4>
                    <div className='overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg'>
                      <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {workouts.slice(0, 5).map(workout => (
                          <li key={workout._id} className='px-4 py-3'>
                            <div className='flex justify-between'>
                              <div>
                                <p className='text-sm font-medium text-gray-900 dark:text-white'>
                                  {workout.workoutId?.name || 'Unknown workout'}
                                </p>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                  {format(
                                    new Date(workout.date),
                                    'MMMM d, yyyy'
                                  )}
                                </p>
                              </div>
                              <div className='text-right'>
                                <p className='text-sm text-gray-900 dark:text-white'>
                                  {workout.duration || 0} mins
                                </p>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                  {workout.caloriesBurned || 0} kcal
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className='text-base font-medium text-gray-800 dark:text-gray-200 mb-3'>
                      Workout Types
                    </h4>

                    {/* Group workouts by type */}
                    {(() => {
                      const workoutsByType = workouts.reduce((acc, workout) => {
                        const type = workout.workoutId?.type || 'unknown';
                        if (!acc[type]) acc[type] = 0;
                        acc[type]++;
                        return acc;
                      }, {});

                      const totalWorkouts = workouts.length;

                      return (
                        <div className='overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3'>
                          <ul className='space-y-3'>
                            {Object.entries(workoutsByType).map(
                              ([type, count]) => {
                                const percentage = Math.round(
                                  (count / totalWorkouts) * 100
                                );

                                return (
                                  <li key={type} className='space-y-1'>
                                    <div className='flex justify-between'>
                                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300 capitalize'>
                                        {type}
                                      </span>
                                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                                        {count} ({percentage}%)
                                      </span>
                                    </div>
                                    <div className='relative pt-1'>
                                      <div className='overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700'>
                                        <div
                                          style={{ width: `${percentage}%` }}
                                          className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600'
                                        ></div>
                                      </div>
                                    </div>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Goals Progress */}
            {goals.length > 0 && (
              <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  Goals Progress
                </h3>

                <div className='space-y-4'>
                  {goals.slice(0, 3).map(goal => {
                    // Calculate progress percentage
                    const progress = Math.min(
                      100,
                      Math.round((goal.currentValue / goal.targetValue) * 100)
                    );

                    return (
                      <div
                        key={goal._id}
                        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4'
                      >
                        <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
                          <div>
                            <h4 className='text-base font-medium text-gray-800 dark:text-gray-200'>
                              {getGoalTitle(goal)}
                            </h4>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              Target date:{' '}
                              {format(
                                new Date(goal.targetDate),
                                'MMMM d, yyyy'
                              )}
                            </p>
                          </div>

                          <div className='flex items-center space-x-2'>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                goal.status === 'completed'
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                  : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                              }`}
                            >
                              {goal.status.charAt(0).toUpperCase() +
                                goal.status.slice(1)}
                            </span>
                            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                              {progress}%
                            </span>
                          </div>
                        </div>

                        <div className='mt-3'>
                          <div className='relative pt-1'>
                            <div className='overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700'>
                              <div
                                style={{ width: `${progress}%` }}
                                className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600'
                              ></div>
                            </div>
                          </div>

                          <div className='flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400'>
                            <span>
                              Current: {goal.currentValue} {goal.unit}
                            </span>
                            <span>
                              Target: {goal.targetValue} {goal.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {goals.length > 3 && (
                    <div className='text-center'>
                      <a
                        href='/goals'
                        className='text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300'
                      >
                        View all goals ({goals.length}) →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes about the report */}
            <div className='text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
              <p>
                <span className='font-semibold'>About this report:</span> This
                summary shows your progress for {getDateRange().label}. Download
                the full PDF report for more details and visualizations.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProgressReport;
