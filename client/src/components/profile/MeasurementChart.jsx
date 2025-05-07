// src/components/profile/MeasurementChart.jsx
import { useEffect, useRef } from 'react';
import { format } from 'date-fns';

const MeasurementChart = ({ measurements, metricToDisplay }) => {
  const chartRef = useRef(null);
  
  // Sort measurements by date (oldest first for the chart)
  const sortedMeasurements = [...measurements]
    .filter(m => m[metricToDisplay] !== null && m[metricToDisplay] !== undefined)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  useEffect(() => {
    if (sortedMeasurements.length === 0 || !chartRef.current) return;
    
    drawChart();
  }, [sortedMeasurements, metricToDisplay]);
  
  const drawChart = () => {
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // If not enough data, show message
    if (sortedMeasurements.length < 2) {
      ctx.font = '14px Arial';
      ctx.fillStyle = '#6B7280';
      ctx.textAlign = 'center';
      ctx.fillText('Not enough data for chart', canvas.width / 2, canvas.height / 2);
      return;
    }
    
    // Get measurements data for the selected metric
    const data = sortedMeasurements.map(m => ({
      date: new Date(m.date),
      value: m[metricToDisplay]
    })).filter(item => item.value !== null && item.value !== undefined);
    
    // Margins
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;
    
    // Find min and max values
    const values = data.map(d => d.value);
    let minValue = Math.min(...values);
    let maxValue = Math.max(...values);
    
    // Add some padding
    const valueRange = maxValue - minValue;
    minValue = Math.max(0, minValue - valueRange * 0.1);
    maxValue = maxValue + valueRange * 0.1;
    
    // X scale (time)
    const timeMin = data[0].date;
    const timeMax = data[data.length - 1].date;
    
    // Scale functions
    const xScale = (date) => {
      const timeRange = timeMax - timeMin;
      return margin.left + ((date - timeMin) / timeRange) * width;
    };
    
    const yScale = (value) => {
      const valueRange = maxValue - minValue;
      return margin.top + height - ((value - minValue) / valueRange) * height;
    };
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#D1D5DB';
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + height);
    ctx.lineTo(margin.left + width, margin.top + height);
    ctx.stroke();
    
    // Draw y-axis labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Arial';
    
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const value = minValue + (maxValue - minValue) * (i / yTicks);
      const y = yScale(value);
      
      ctx.beginPath();
      ctx.moveTo(margin.left - 5, y);
      ctx.lineTo(margin.left, y);
      ctx.stroke();
      
      ctx.fillText(value.toFixed(1), margin.left - 10, y);
    }
    
    // Draw x-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const xTicks = Math.min(data.length, 6);
    for (let i = 0; i < xTicks; i++) {
      const index = Math.floor(i * (data.length - 1) / (xTicks - 1));
      const date = data[index].date;
      const x = xScale(date);
      
      ctx.beginPath();
      ctx.moveTo(x, margin.top + height);
      ctx.lineTo(x, margin.top + height + 5);
      ctx.stroke();
      
      ctx.fillText(format(date, 'MMM d'), x, margin.top + height + 10);
    }
    
    // Draw title
    ctx.textAlign = 'center';
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#374151';
    
    let metricLabel = metricToDisplay;
    if (metricToDisplay === 'weight') metricLabel = 'Weight (kg)';
    else if (metricToDisplay === 'bodyFat') metricLabel = 'Body Fat (%)';
    else if (metricToDisplay === 'chest') metricLabel = 'Chest (cm)';
    else if (metricToDisplay === 'waist') metricLabel = 'Waist (cm)';
    else if (metricToDisplay === 'hips') metricLabel = 'Hips (cm)';
    else if (metricToDisplay === 'arms') metricLabel = 'Arms (cm)';
    else if (metricToDisplay === 'thighs') metricLabel = 'Thighs (cm)';
    
    ctx.fillText(metricLabel, canvas.width / 2, margin.top / 2);
    
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 2;
    
    data.forEach((d, i) => {
      const x = xScale(d.date);
      const y = yScale(d.value);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw points
    data.forEach(d => {
      const x = xScale(d.date);
      const y = yScale(d.value);
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#4F46E5';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };
  
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
      {sortedMeasurements.length === 0 ? (
        <div className="h-60 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available for {metricToDisplay}
        </div>
      ) : (
        <canvas 
          ref={chartRef} 
          className="w-full" 
          width="800" 
          height="300"
        ></canvas>
      )}
    </div>
  );
};

export default MeasurementChart;