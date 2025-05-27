import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns'; // Import the date-fns adapter

const WorkoutMetricsChart = ({ data, metric }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // Check if the component is still mounted
    let isMounted = true;

    const createOrUpdateChart = () => {
      if (!chartRef.current) return;

      const ctx = chartRef.current.getContext('2d');

      // Clean up any existing chart before creating a new one
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }

      // Determine chart configuration based on the selected metric
      let chartTitle, yAxisTitle, backgroundColor, borderColor;

      switch (metric) {
        case 'duration':
          chartTitle = 'Weekly Workout Duration';
          yAxisTitle = 'Minutes';
          backgroundColor = 'rgba(79, 70, 229, 0.2)';
          borderColor = 'rgba(79, 70, 229, 1)';
          break;
        case 'caloriesBurned':
          chartTitle = 'Weekly Calories Burned';
          yAxisTitle = 'Calories';
          backgroundColor = 'rgba(245, 158, 11, 0.2)';
          borderColor = 'rgba(245, 158, 11, 1)';
          break;
        case 'count':
          chartTitle = 'Number of Workouts per Week';
          yAxisTitle = 'Count';
          backgroundColor = 'rgba(16, 185, 129, 0.2)';
          borderColor = 'rgba(16, 185, 129, 1)';
          break;
        default:
          chartTitle = 'Workout Metrics';
          yAxisTitle = 'Value';
          backgroundColor = 'rgba(79, 70, 229, 0.2)';
          borderColor = 'rgba(79, 70, 229, 1)';
      }

      try {
        // Create the chart
        chartInstanceRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.map(item => item.weekLabel),
            datasets: [
              {
                label: chartTitle,
                data: data.map(item => item[metric]),
                backgroundColor,
                borderColor,
                borderWidth: 1,
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: yAxisTitle,
                  color: '#1F2937',
                },
                grid: {
                  display: true,
                  color: '#E5E7EB',
                },
                ticks: {
                  color: '#6B7280',
                },
              },
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#6B7280',
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  title: function (context) {
                    return context[0].label;
                  },
                  label: function (context) {
                    const value = context.raw;

                    if (metric === 'duration') {
                      return `Duration: ${value} minutes`;
                    } else if (metric === 'caloriesBurned') {
                      return `Calories: ${value} kcal`;
                    } else {
                      return `Workouts: ${value}`;
                    }
                  },
                },
              },
            },
          },
        });
      } catch (error) {
        console.error('Error creating chart:', error);
      }
    };

    // Create or update the chart
    createOrUpdateChart();

    // Clean up function
    return () => {
      isMounted = false;
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, metric]); // Re-create chart when data or metric changes

  return <canvas ref={chartRef} className='w-full h-full'></canvas>;
};

export default WorkoutMetricsChart;
