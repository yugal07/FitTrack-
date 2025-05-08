import React from 'react';

const MetricSummaryCard = ({ title, current, change, percentChange, trend, unit, color }) => {
  // Format the values
  const formattedCurrent = typeof current === 'number' ? current.toFixed(1) : current;
  const formattedChange = typeof change === 'number' ? Math.abs(change).toFixed(1) : change;
  const formattedPercentChange = typeof percentChange === 'number' 
    ? Math.abs(percentChange).toFixed(1) 
    : percentChange;
  
  // Get trend icon and color
  const getTrendDetails = () => {
    if (trend === 'positive') {
      return {
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
        ),
        className: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800'
      };
    } else if (trend === 'negative') {
      return {
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
          </svg>
        ),
        className: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800'
      };
    } else {
      return {
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        ),
        className: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
      };
    }
  };
  
  const trendDetails = getTrendDetails();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h4 
        className="text-sm font-medium mb-2"
        style={{ color: color }}
      >
        {title}
      </h4>
      
      <div className="flex justify-between items-end">
        <div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {formattedCurrent} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{unit}</span>
          </div>
          
          {change !== 0 && change !== null && (
            <div className="flex items-center mt-1">
              <span className={`flex items-center text-xs px-2 py-0.5 rounded ${trendDetails.className}`}>
                {change > 0 ? '+' : ''}{formattedChange} {unit}
                <span className="ml-1">
                  {trendDetails.icon}
                </span>
              </span>
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                ({percentChange > 0 ? '+' : ''}{formattedPercentChange}%)
              </span>
            </div>
          )}
        </div>
        
        <div 
          className="h-10 w-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <div 
            className="h-6 w-6 rounded-full"
            style={{ backgroundColor: color }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MetricSummaryCard;