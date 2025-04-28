// src/components/progress/WorkoutPerformance.jsx
import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { 
  CalendarToday as CalendarIcon,
  FitnessCenter as WorkoutIcon,
  Speed as PerformanceIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import axios from 'axios';
import { 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const WorkoutPerformance = () => {
  const theme = useTheme();
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  
  const colors = {
    strength: theme.palette.primary.main,
    cardio: theme.palette.secondary.main,
    hiit: theme.palette.error.main,
    flexibility: theme.palette.success.main,
    hybrid: theme.palette.warning.main,
    custom: theme.palette.info.main
  };

  // Define date ranges based on period
  const getPeriodDates = () => {
    const today = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(today.getMonth() - 1);
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
  };

  const fetchWorkoutStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = getPeriodDates();
      const response = await axios.get('/api/workout-sessions/stats', {
        params: { startDate, endDate }
      });
      
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching workout stats:', err);
      setError('Failed to load workout performance data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutStats();
  }, [period]);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  // Prepare data for workout frequency chart
  const prepareFrequencyData = () => {
    if (!stats || !stats.workoutFrequencyByDay) return [];
    
    // Ensure all days are represented with proper order
    const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Create map from stats data
    const frequencyMap = stats.workoutFrequencyByDay.reduce((acc, day) => {
      acc[day.day] = day.count;
      return acc;
    }, {});
    
    // Create array with all days, filling in zeros for missing days
    return daysOrder.map(day => ({
      day,
      count: frequencyMap[day] || 0
    }));
  };

  // Prepare workout types data for pie chart
  const prepareWorkoutTypesData = () => {
    if (!stats || !stats.workoutsByType) return [];
    return stats.workoutsByType.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Workout Performance Analysis
        </Typography>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={period}
            label="Time Period"
            onChange={handlePeriodChange}
          >
            <MenuItem value="week">Past Week</MenuItem>
            <MenuItem value="month">Past Month</MenuItem>
            <MenuItem value="quarter">Past 3 Months</MenuItem>
            <MenuItem value="year">Past Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {stats && (
        <>
          {/* Summary Stats */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary" variant="subtitle2">
                    Total Workouts
                  </Typography>
                  <WorkoutIcon color="primary" />
                </Box>
                <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {stats.totalWorkouts || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
                  {period === 'week' ? 'Past 7 days' : 
                   period === 'month' ? 'Past 30 days' : 
                   period === 'quarter' ? 'Past 3 months' : 'Past year'}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary" variant="subtitle2">
                    Total Duration
                  </Typography>
                  <CalendarIcon color="secondary" />
                </Box>
                <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {stats.totalDuration || 0} mins
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
                  Avg: {Math.round(stats.avgDuration || 0)} mins/workout
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary" variant="subtitle2">
                    Calories Burned
                  </Typography>
                  <TrendingUpIcon color="error" />
                </Box>
                <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {Math.round(stats.totalCalories || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
                  {Math.round(stats.totalCalories / (stats.totalWorkouts || 1))} cal/workout
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary" variant="subtitle2">
                    Average Intensity
                  </Typography>
                  <PerformanceIcon color="warning" />
                </Box>
                <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {stats.avgDifficulty ? stats.avgDifficulty.toFixed(1) : '0'}/5
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
                  Based on your difficulty ratings
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={3}>
            {/* Workout Frequency by Day */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Workout Frequency by Day
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepareFrequencyData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      name="Workouts" 
                      fill={theme.palette.primary.main} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Workout Types Distribution */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Workout Types
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={prepareWorkoutTypesData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareWorkoutTypesData().map((entry, index) => {
                        const colorKey = entry.name.toLowerCase();
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={colors[colorKey] || theme.palette.primary.main} 
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default WorkoutPerformance;