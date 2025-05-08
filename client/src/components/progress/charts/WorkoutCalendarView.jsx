import React from 'react';
import { format } from 'date-fns';

const WorkoutCalendarView = ({ monthData }) => {
  // Days of the week for header
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Parse the month and year to generate calendar grid
  const month = monthData.month; // e.g., "January 2025"
  const [monthName, year] = month.split(' ');
  
  // Create a date for the first day of the month
  const firstDayOfMonth = new Date(`${monthName} 1, ${year}`);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Get the number of days in the month
  const daysInMonth = new Date(parseInt(year), firstDayOfMonth.getMonth() + 1, 0).getDate();
  
  // Calculate the number of rows needed for the calendar
  const numRows = Math.ceil((firstDayOfWeek + daysInMonth) / 7);
  
  // Create a 2D array for the calendar grid
  const calendarGrid = [];
  let day = 1;
  
  for (let row = 0; row < numRows; row++) {
    const week = [];
    
    for (let col = 0; col < 7; col++) {
      if ((row === 0 && col < firstDayOfWeek) || day > daysInMonth) {
        // Empty cell
        week.push(null);
      } else {
        // Day cell
        week.push(day);
        day++;
      }
    }
    
    calendarGrid.push(week);
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">{monthData.month}</h3>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {/* Calendar header - Days of the week */}
          {daysOfWeek.map((day, index) => (
            <div 
              key={index} 
              className="text-xs font-medium text-center text-gray-500 dark:text-gray-400 p-1"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar grid */}
          {calendarGrid.flat().map((day, index) => {
            if (day === null) {
              // Empty cell
              return (
                <div 
                  key={`empty-${index}`} 
                  className="aspect-square bg-gray-50 dark:bg-gray-900 rounded"
                ></div>
              );
            }
            
            const dayKey = day.toString();
            const hasWorkout = monthData.days[dayKey] !== undefined;
            const workouts = hasWorkout ? monthData.days[dayKey] : [];
            
            // Determine cell color based on workout intensity
            let cellColor;
            
            if (!hasWorkout) {
              cellColor = 'bg-gray-50 dark:bg-gray-900';
            } else if (workouts.length === 1) {
              cellColor = 'bg-indigo-100 dark:bg-indigo-900';
            } else if (workouts.length === 2) {
              cellColor = 'bg-indigo-200 dark:bg-indigo-800';
            } else if (workouts.length >= 3) {
              cellColor = 'bg-indigo-300 dark:bg-indigo-700';
            }
            
            return (
              <div 
                key={`day-${day}`} 
                className={`aspect-square rounded-lg ${cellColor} relative group`}
              >
                <div className="absolute top-1 left-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {day}
                </div>
                
                {hasWorkout && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                        {workouts.length}
                      </span>
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                        {workouts.map((workout, wIndex) => (
                          <div key={wIndex} className="whitespace-nowrap">
                            {workout.workoutId?.name || 'Workout'} ({workout.duration} min)
                          </div>
                        ))}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-end space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-50 dark:bg-gray-900 rounded mr-1"></div>
            <span className="text-gray-500 dark:text-gray-400">No workout</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-100 dark:bg-indigo-900 rounded mr-1"></div>
            <span className="text-gray-500 dark:text-gray-400">1 workout</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-200 dark:bg-indigo-800 rounded mr-1"></div>
            <span className="text-gray-500 dark:text-gray-400">2 workouts</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-300 dark:bg-indigo-700 rounded mr-1"></div>
            <span className="text-gray-500 dark:text-gray-400">3+ workouts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCalendarView;