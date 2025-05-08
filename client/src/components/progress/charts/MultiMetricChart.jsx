import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns'; // Import the date-fns adapter

const MultiMetricChart = ({ data, metrics }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // Check if the component is still mounted
    let isMounted = true;
    
    // This function ensures the chart is properly created or updated
    const createOrUpdateChart = () => {
      if (!chartRef.current) return;
      
      const ctx = chartRef.current.getContext('2d');
      
      // Clean up any existing chart before creating a new one
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      
      // Format the data for Chart.js
      const formattedData = {};
      
      // Prepare datasets - make sure each dataset has proper x,y coordinates
      const datasets = metrics.map(metric => {
        // Filter data with valid values for this metric
        const validData = data.filter(
          item => item[metric.id] !== undefined && item[metric.id] !== null
        );
        
        return {
          label: metric.label,
          data: validData.map(item => ({
            x: new Date(item.date).getTime(), // Convert date to timestamp for better compatibility
            y: item[metric.id]
          })),
          borderColor: metric.color,
          backgroundColor: `${metric.color}20`,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: metric.color,
          fill: false
        };
      });
      
      try {
        // Create the chart
        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'month',
                  displayFormats: {
                    month: 'MMM yyyy'
                  }
                },
                title: {
                  display: true,
                  text: 'Date',
                  color: '#1F2937'
                },
                grid: {
                  display: true,
                  color: '#E5E7EB'
                },
                ticks: {
                  color: '#6B7280'
                }
              },
              y: {
                beginAtZero: false,
                title: {
                  display: true,
                  text: 'Value',
                  color: '#1F2937'
                },
                grid: {
                  display: true,
                  color: '#E5E7EB'
                },
                ticks: {
                  color: '#6B7280'
                }
              }
            },
            plugins: {
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  title: function(context) {
                    const date = new Date(context[0].parsed.x);
                    return format(date, 'MMMM d, yyyy');
                  }
                }
              },
              legend: {
                position: 'top',
                labels: {
                  usePointStyle: true,
                  boxWidth: 8,
                  padding: 20,
                  color: '#1F2937'
                }
              }
            },
            interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false
            }
          }
        });
      } catch (error) {
        console.error("Error creating chart:", error);
      }
    };

    // Create or update the chart
    createOrUpdateChart();
    
    // Clean up function - destroy chart when component unmounts
    return () => {
      isMounted = false;
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, metrics]); // Re-create chart when data or metrics change

  return (
    <canvas ref={chartRef} className="w-full h-full"></canvas>
  );
};

export default MultiMetricChart;