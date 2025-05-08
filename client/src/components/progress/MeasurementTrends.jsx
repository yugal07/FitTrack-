import React, { useState, useEffect, useRef } from 'react';
import { format, subMonths } from 'date-fns';
import Card from '../ui/Card';
import api from '../../utils/api';
import Button from '../ui/Button';
import MultiMetricChart from './charts/MultiMetricChart';
import MetricSummaryCard from './MetricSummaryCard';

const MeasurementTrends = () => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('6m'); // Default to 6 months
  const [selectedMetrics, setSelectedMetrics] = useState(['weight']);
  const [metricStats, setMetricStats] = useState({});

  // Available metrics to track
  const availableMetrics = [
    { id: 'weight', label: 'Weight (kg)', color: '#4F46E5' },
    { id: 'bodyFat', label: 'Body Fat (%)', color: '#EC4899' },
    { id: 'chest', label: 'Chest (cm)', color: '#10B981' },
    { id: 'waist', label: 'Waist (cm)', color: '#F59E0B' },
    { id: 'hips', label: 'Hips (cm)', color: '#6366F1' },
    { id: 'arms', label: 'Arms (cm)', color: '#8B5CF6' },
    { id: 'thighs', label: 'Thighs (cm)', color: '#14B8A6' }
  ];

  useEffect(() => {
    fetchMeasurements();
  }, [dateRange]);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/profiles/measurements');
      
      // Filter measurements by date range
      const now = new Date();
      let filteredMeasurements = response.data.data;
      
      if (dateRange === '1m') {
        filteredMeasurements = response.data.data.filter(m => 
          new Date(m.date) >= subMonths(now, 1)
        );
      } else if (dateRange === '3m') {
        filteredMeasurements = response.data.data.filter(m => 
          new Date(m.date) >= subMonths(now, 3)
        );
      } else if (dateRange === '6m') {
        filteredMeasurements = response.data.data.filter(m => 
          new Date(m.date) >= subMonths(now, 6)
        );
      } else if (dateRange === '1y') {
        filteredMeasurements = response.data.data.filter(m => 
          new Date(m.date) >= subMonths(now, 12)
        );
      }
      
      // Sort measurements by date (oldest first)
      const sortedMeasurements = filteredMeasurements.sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      
      setMeasurements(sortedMeasurements);
      calculateMetricStats(sortedMeasurements);
      setError('');
    } catch (err) {
      setError('Failed to load measurements');
      console.error('Error fetching measurements:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const calculateMetricStats = (data) => {
    if (!data || data.length === 0) {
      setMetricStats({});
      return;
    }
    
    const stats = {};
    
    availableMetrics.forEach(metric => {
      const metricId = metric.id;
      const validData = data.filter(m => m[metricId] !== null && m[metricId] !== undefined);
      
      if (validData.length === 0) {
        stats[metricId] = {
          current: null,
          oldest: null,
          change: null,
          percentChange: null,
          trend: null
        };
        return;
      }
      
      const current = validData[validData.length - 1][metricId];
      const oldest = validData[0][metricId];
      const change = current - oldest;
      const percentChange = (change / oldest) * 100;
      
      // Determine if trend is positive based on the metric type
      // For weight, waist, hips - decrease is positive
      // For other metrics - increase is positive
      let trend;
      if (['weight', 'bodyFat', 'waist'].includes(metricId)) {
        trend = change < 0 ? 'positive' : change > 0 ? 'negative' : 'neutral';
      } else {
        trend = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
      }
      
      stats[metricId] = {
        current,
        oldest,
        change,
        percentChange,
        trend
      };
    });
    
    setMetricStats(stats);
  };

  const toggleMetric = (metricId) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  const formatDateRange = () => {
    switch (dateRange) {
      case '1m': return 'Last Month';
      case '3m': return 'Last 3 Months';
      case '6m': return 'Last 6 Months';
      case '1y': return 'Last Year';
      case 'all': return 'All Time';
      default: return 'Last 6 Months';
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Measurement Trends" subtitle="Track how your body measurements change over time">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
          {/* Date range selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Time period:</span>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setDateRange('1m')}
                className={`px-3 py-1.5 text-xs font-medium rounded-l-md border ${
                  dateRange === '1m'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                1M
              </button>
              <button
                onClick={() => setDateRange('3m')}
                className={`px-3 py-1.5 text-xs font-medium border-t border-b ${
                  dateRange === '3m'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                3M
              </button>
              <button
                onClick={() => setDateRange('6m')}
                className={`px-3 py-1.5 text-xs font-medium border-t border-b ${
                  dateRange === '6m'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                6M
              </button>
              <button
                onClick={() => setDateRange('1y')}
                className={`px-3 py-1.5 text-xs font-medium border-t border-b ${
                  dateRange === '1y'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                1Y
              </button>
              <button
                onClick={() => setDateRange('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-r-md border ${
                  dateRange === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                All
              </button>
            </div>
          </div>
          
          {/* Metric selector */}
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Metrics:</span>
            {availableMetrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => toggleMetric(metric.id)}
                className={`px-2 py-1 text-xs font-medium rounded-md border mr-2 mb-2 md:mb-0 ${
                  selectedMetrics.includes(metric.id)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                {metric.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
        
        {/* Metric summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {selectedMetrics.map((metricId) => {
            const metric = availableMetrics.find(m => m.id === metricId);
            const stats = metricStats[metricId];
            
            if (!stats || stats.current === null) return null;
            
            return (
              <MetricSummaryCard
                key={metricId}
                title={metric.label.split(' ')[0]}
                current={stats.current}
                change={stats.change}
                percentChange={stats.percentChange}
                trend={stats.trend}
                unit={metric.label.match(/\((.*?)\)/)?.[1] || ''}
                color={metric.color}
              />
            );
          })}
        </div>
        
        {/* Main chart */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {formatDateRange()} Trends
          </h3>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : measurements.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              No measurement data available for the selected period
            </div>
          ) : (
            <div className="h-64 md:h-96 w-full">
              <MultiMetricChart 
                data={measurements} 
                metrics={availableMetrics.filter(m => selectedMetrics.includes(m.id))} 
              />
            </div>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/profile#measurements'}
          >
            Add New Measurement
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MeasurementTrends;