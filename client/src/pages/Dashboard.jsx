// src/pages/Dashboard.jsx (Updated with Goals Summary)
import React , { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Chip,
  LinearProgress,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import { 
  FitnessCenter as WorkoutIcon,
  DirectionsRun as ActivityIcon,
  RestaurantMenu as MealIcon,
  LocalFireDepartment as CaloriesIcon,
  WaterDrop as WaterIcon,
  Scale as WeightIcon,
  TrendingUp as TrendingUpIcon,
  Today as TodayIcon,
  CheckCircleOutline as CompletedIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  EmojiEvents as AchievementIcon,
  Speed as PerformanceIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Import Goals Summary Component
import GoalsSummary from '../components/dashboard/GoalsSummary';

// For demo purposes only
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  // Demo data - in a real app, this would come from your API
  const recentWorkouts = [
    { id: 1, name: 'Upper Body Strength', date: '2025-04-25', duration: 45, type: 'strength' },
    { id: 2, name: 'Morning Cardio', date: '2025-04-23', duration: 30, type: 'cardio' },
    { id: 3, name: 'Full Body HIIT', date: '2025-04-21', duration: 35, type: 'hiit' }
  ];

  const weightData = [
    { date: 'Feb 1', weight: 185 },
    { date: 'Feb 15', weight: 183 },
    { date: 'Mar 1', weight: 181 },
    { date: 'Mar 15', weight: 180 },
    { date: 'Apr 1', weight: 178 },
    { date: 'Apr 15', weight: 176 },
    { date: 'May 1', weight: 175 }
  ];

  const nutritionData = [
    { name: 'Protein', value: 35 },
    { name: 'Carbs', value: 45 },
    { name: 'Fat', value: 20 }
  ];

  const macroColors = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.error.main];

  const todaysGoals = [
    { id: 1, name: 'Complete workout', completed: true },
    { id: 2, name: 'Log all meals', completed: true },
    { id: 3, name: 'Drink 2L of water', completed: false },
    { id: 4, name: 'Get 8 hours of sleep', completed: false }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const calculateCompletionPercentage = () => {
    const completed = todaysGoals.filter(goal => goal.completed).length;
    return (completed / todaysGoals.length) * 100;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {getGreeting()}, {currentUser?.firstName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Featured Card - Today's Overview */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 0, 
              overflow: 'hidden',
              backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              position: 'relative'
            }}
          >
            <Box sx={{ position: 'absolute', top: 0, right: 0, height: '100%', width: '40%', opacity: 0.1 }}>
              <WorkoutIcon sx={{ fontSize: 300, position: 'absolute', right: -50, top: -50, transform: 'rotate(15deg)' }} />
            </Box>
            <Grid container>
              <Grid item xs={12} md={8}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Today's Progress
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                    You've completed 2 of 4 daily goals. Keep it up!
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Daily Goals Completion</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {calculateCompletionPercentage()}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateCompletionPercentage()} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'white'
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button 
                      variant="contained" 
                      component={RouterLink}
                      to="/workouts/start"
                      sx={{ 
                        bgcolor: 'white', 
                        color: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: alpha('#ffffff', 0.9)
                        }
                      }}
                      startIcon={<WorkoutIcon />}
                    >
                      Start Workout
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      component={RouterLink}
                      to="/nutrition/log"
                      sx={{ 
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                      startIcon={<MealIcon />}
                    >
                      Log Meal
                    </Button>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={4} sx={{ bgcolor: 'rgba(0,0,0,0.1)', display: { xs: 'none', md: 'block' } }}>
                <Box sx={{ p: 3, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Today's Goals
                  </Typography>
                  <List disablePadding>
                    {todaysGoals.map(goal => (
                      <ListItem 
                        key={goal.id} 
                        sx={{ 
                          px: 0, 
                          borderRadius: 1,
                          opacity: goal.completed ? 1 : 0.7,
                        }}
                        secondaryAction={
                          goal.completed && <CompletedIcon sx={{ color: 'white' }} />
                        }
                        disablePadding
                      >
                        <ListItemText 
                          primary={goal.name}
                          primaryTypographyProps={{
                            variant: 'body2',
                            sx: { 
                              textDecoration: goal.completed ? 'line-through' : 'none',
                              fontWeight: goal.completed ? 'normal' : 'medium'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary" variant="subtitle2">
                Weekly Workouts
              </Typography>
              <WorkoutIcon color="primary" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 'auto' }}>
              4
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                +1 from last week
              </Typography>
              <Chip 
                label="3 days streak" 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ height: 24 }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary" variant="subtitle2">
                Calories Today
              </Typography>
              <CaloriesIcon color="error" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 'auto' }}>
              1,850
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Goal: 2,100
              </Typography>
              <Chip 
                label="88% of goal" 
                size="small" 
                color="error" 
                variant="outlined"
                sx={{ height: 24 }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary" variant="subtitle2">
                Current Weight
              </Typography>
              <WeightIcon color="info" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 'auto' }}>
              175 lbs
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                -10 lbs since Feb
              </Typography>
              <Chip 
                label="On target" 
                size="small" 
                color="success" 
                variant="outlined"
                sx={{ height: 24 }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary" variant="subtitle2">
                Water Intake
              </Typography>
              <WaterIcon color="primary" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 'auto' }}>
              1.2L
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Goal: 2.5L
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={48} 
                sx={{ 
                  width: '60%', 
                  height: 6, 
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.1)
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Workouts & Active Goals */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Workouts</Typography>
              <Button 
                component={RouterLink} 
                to="/workouts" 
                endIcon={<ArrowForwardIcon />}
                sx={{ textTransform: 'none' }}
              >
                View All
              </Button>
            </Box>
            <List>
              {recentWorkouts.map((workout, index) => (
                <React.Fragment key={workout.id}>
                  <ListItem
                    sx={{ 
                      px: 2, 
                      py: 1.5, 
                      borderRadius: 2,
                      bgcolor: index === 0 ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        component={RouterLink}
                        to={`/workouts/${workout.id}`}
                        size="small"
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 
                            workout.type === 'strength' 
                              ? theme.palette.primary.main 
                              : workout.type === 'cardio'
                                ? theme.palette.secondary.main
                                : theme.palette.error.main,
                          width: 40,
                          height: 40
                        }}
                      >
                        <WorkoutIcon fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={workout.name}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.875rem' }} />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(workout.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.875rem' }} />
                            <Typography variant="body2" color="text.secondary">
                              {workout.duration} min
                            </Typography>
                          </Box>
                        </Box>
                      }
                      primaryTypographyProps={{ fontWeight: index === 0 ? 'medium' : 'normal' }}
                    />
                  </ListItem>
                  {index < recentWorkouts.length - 1 && (
                    <Divider variant="inset" component="li" sx={{ ml: 7 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Button 
                variant="contained" 
                component={RouterLink}
                to="/workouts/start"
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
              >
                Start New Workout
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Active Goals Summary */}
        <Grid item xs={12} md={6}>
          <GoalsSummary />
        </Grid>

        {/* Weight Progress & Nutrition */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Weight Progress</Typography>
              <Button 
                component={RouterLink} 
                to="/progress/measurements" 
                endIcon={<ArrowForwardIcon />}
                sx={{ textTransform: 'none' }}
              >
                Details
              </Button>
            </Box>
            
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke={theme.palette.text.secondary} />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 12 }} stroke={theme.palette.text.secondary} />
                <Tooltip 
                  formatter={(value) => [`${value} lbs`, 'Weight']} 
                  contentStyle={{ 
                    borderRadius: 8, 
                    border: 'none', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    fontSize: 12
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke={theme.palette.primary.main} 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Nutrition Breakdown</Typography>
              <Button 
                component={RouterLink} 
                to="/nutrition/macros" 
                endIcon={<ArrowForwardIcon />}
                sx={{ textTransform: 'none' }}
              >
                Details
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: '50%', height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={nutritionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {nutritionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={macroColors[index % macroColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, ""]} 
                      contentStyle={{ 
                        borderRadius: 8, 
                        border: 'none', 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        fontSize: 12
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ width: '50%', pl: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Today's Macros
                </Typography>
                
                {nutritionData.map((entry, index) => (
                  <Box key={entry.name} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          component="span"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: macroColors[index],
                            display: 'inline-block',
                            mr: 1
                          }}
                        />
                        {entry.name}
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {entry.value}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={entry.value}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: alpha(macroColors[index], 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: macroColors[index]
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Achievements & Upcoming */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Achievements</Typography>
              <Button 
                component={RouterLink} 
                to="/progress" 
                endIcon={<ArrowForwardIcon />}
                sx={{ textTransform: 'none' }}
              >
                View All
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ 
                  borderRadius: 2, 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  height: '100%'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Weight Goal
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Lost 10 pounds
                        </Typography>
                      </Box>
                      <AchievementIcon fontSize="large" color="primary" />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <Chip 
                      label="Apr 15, 2025" 
                      size="small" 
                      variant="outlined"
                      icon={<TodayIcon />}
                      sx={{ height: 24 }}
                    />
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ 
                  borderRadius: 2, 
                  bgcolor: alpha(theme.palette.secondary.main, 0.05),
                  height: '100%'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Workout Streak
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          10 consecutive days
                        </Typography>
                      </Box>
                      <AchievementIcon fontSize="large" color="secondary" />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <Chip 
                      label="Apr 10, 2025" 
                      size="small" 
                      variant="outlined"
                      icon={<TodayIcon />}
                      sx={{ height: 24 }}
                    />
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Performance Highlights */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Performance Highlights</Typography>
              <Button 
                component={RouterLink} 
                to="/progress/workout" 
                endIcon={<ArrowForwardIcon />}
                sx={{ textTransform: 'none' }}
              >
                View More
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ 
                  borderRadius: 2, 
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  height: '100%'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Bench Press PR
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Increased by 15 lbs
                        </Typography>
                      </Box>
                      <PerformanceIcon fontSize="large" color="info" />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <Chip 
                      label="Last week" 
                      size="small" 
                      variant="outlined"
                      sx={{ height: 24 }}
                    />
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ 
                  borderRadius: 2, 
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                  height: '100%'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Running Distance
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          New record: 10K
                        </Typography>
                      </Box>
                      <PerformanceIcon fontSize="large" color="success" />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <Chip 
                      label="Yesterday" 
                      size="small" 
                      variant="outlined"
                      sx={{ height: 24 }}
                    />
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;