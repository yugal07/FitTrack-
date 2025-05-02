// src/components/goal/GoalDetail.jsx (with mock data)
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  LinearProgress,
  Alert,
  Chip,
  Divider,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MonitorWeight as WeightIcon,
  FitnessCenter as StrengthIcon,
  DirectionsRun as EnduranceIcon,
  CheckCircle as HabitIcon,
  Restaurant as NutritionIcon,
  EmojiEvents as CustomIcon,
  Update as UpdateIcon,
  Flag as FlagIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

// Mock data for goals
const mockGoals = [
  {
    _id: 'goal1',
    type: 'weight',
    currentValue: 182,
    targetValue: 170,
    unit: 'lbs',
    startDate: new Date('2025-03-15').toISOString(),
    targetDate: new Date('2025-06-15').toISOString(),
    status: 'active',
    progressType: 'linear'
  },
  {
    _id: 'goal2',
    type: 'strength',
    currentValue: 135,
    targetValue: 185,
    unit: 'lbs',
    exerciseName: 'Bench Press',
    startDate: new Date('2025-03-01').toISOString(),
    targetDate: new Date('2025-07-30').toISOString(),
    status: 'active',
    progressType: 'milestone',
    milestones: [
      {
        date: new Date('2025-04-15').toISOString(),
        value: 150
      },
      {
        date: new Date('2025-05-30').toISOString(),
        value: 165
      },
      {
        date: new Date('2025-07-15').toISOString(),
        value: 175
      }
    ]
  },
  {
    _id: 'goal3',
    type: 'endurance',
    currentValue: 3.5,
    targetValue: 10,
    unit: 'km',
    activityType: 'Running',
    startDate: new Date('2025-04-10').toISOString(),
    targetDate: new Date('2025-08-10').toISOString(),
    status: 'active',
    progressType: 'linear'
  },
  {
    _id: 'goal4',
    type: 'habit',
    habitDescription: 'Workout',
    currentValue: 3,
    targetValue: 4,
    frequency: 'weekly',
    startDate: new Date('2025-04-01').toISOString(),
    targetDate: new Date('2025-05-01').toISOString(),
    status: 'active',
    progressType: 'linear'
  },
  {
    _id: 'goal5',
    type: 'nutrition',
    nutritionType: 'protein',
    currentValue: 120,
    targetValue: 150,
    unit: 'g',
    startDate: new Date('2025-03-20').toISOString(),
    targetDate: new Date('2025-04-20').toISOString(),
    status: 'completed',
    progressType: 'linear'
  },
  {
    _id: 'goal6',
    type: 'custom',
    customDescription: 'Meditation',
    currentValue: 15,
    targetValue: 30,
    unit: 'min',
    startDate: new Date('2025-01-01').toISOString(),
    targetDate: new Date('2025-02-01').toISOString(),
    status: 'abandoned',
    progressType: 'linear'
  }
];

// Component for the large circular progress visualization
const GoalProgressCircle = ({ goal }) => {
  const theme = useTheme();
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (!goal || typeof goal.currentValue !== 'number' || typeof goal.targetValue !== 'number') {
      return 0;
    }
    
    // For weight loss goals, reverse the calculation if target is less than current
    if (goal.type === 'weight' && goal.targetValue < goal.currentValue) {
      const totalDifference = goal.currentValue - goal.targetValue;
      const currentDifference = goal.currentValue - goal.currentValue;
      return Math.min(100, Math.max(0, (currentDifference / totalDifference) * 100));
    }
    
    // Standard calculation
    return Math.min(100, Math.max(0, (goal.currentValue / goal.targetValue) * 100));
  };
  
  // Format progress display
  const formatProgress = () => {
    if (!goal) return '0%';
    
    const progress = calculateProgress();
    return `${Math.round(progress)}%`;
  };
  
  const progressValue = calculateProgress();
  
  // Get appropriate color based on progress
  const getProgressColor = () => {
    if (progressValue < 25) return theme.palette.error.main;
    if (progressValue < 50) return theme.palette.warning.main;
    if (progressValue < 75) return theme.palette.info.main;
    return theme.palette.success.main;
  };
  
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', m: 2 }}>
      <CircularProgress
        variant="determinate"
        value={progressValue}
        size={160}
        thickness={6}
        sx={{ color: getProgressColor() }}
      />
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" component="div" fontWeight="bold">
          {formatProgress()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete
        </Typography>
      </Box>
    </Box>
  );
};

// Main component
const GoalDetail = () => {
  const { goalId } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateValue, setUpdateValue] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Fetch goal data using mock data
  const fetchGoal = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find goal in mock data
      const foundGoal = mockGoals.find(g => g._id === goalId);
      
      if (foundGoal) {
        setGoal(foundGoal);
        setUpdateValue(foundGoal.currentValue || 0);
        
        // Generate sample progress history
        generateProgressHistory(foundGoal);
      } else {
        throw new Error('Goal not found');
      }
    } catch (err) {
      console.error('Error fetching goal details:', err);
      setError(err.message || 'Failed to fetch goal details');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate sample progress history
  const generateProgressHistory = (goalData) => {
    if (!goalData) return;
    
    const startDate = new Date(goalData.startDate || new Date());
    const targetDate = new Date(goalData.targetDate);
    const today = new Date();
    
    const totalDays = Math.floor((targetDate - startDate) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    // Create progress points
    const history = [];
    const initialValue = goalData.type === 'weight' && goalData.targetValue < goalData.currentValue 
      ? goalData.currentValue * 1.05 // For weight loss, start a bit higher
      : goalData.currentValue * 0.7; // For other goals, start lower
      
    const targetValue = goalData.targetValue;
    
    // Add starting point
    history.push({
      date: startDate.toISOString().split('T')[0],
      value: initialValue,
      formattedDate: startDate.toLocaleDateString()
    });
    
    // Add intermediate points (one every ~2 weeks)
    const pointsCount = Math.min(5, Math.floor(elapsedDays / 14) + 1);
    for (let i = 1; i <= pointsCount; i++) {
      const pointDate = new Date(startDate);
      pointDate.setDate(startDate.getDate() + Math.floor(elapsedDays * (i / pointsCount)));
      
      // Calculate value based on progress toward target
      let value;
      if (goalData.type === 'weight' && targetValue < initialValue) {
        // For weight loss
        const progress = i / pointsCount;
        value = initialValue - (initialValue - targetValue) * (progress * 0.7 + Math.random() * 0.2);
      } else {
        // For other goals
        const progress = i / pointsCount;
        value = initialValue + (targetValue - initialValue) * (progress * 0.7 + Math.random() * 0.2);
      }
      
      history.push({
        date: pointDate.toISOString().split('T')[0],
        value,
        formattedDate: pointDate.toLocaleDateString()
      });
    }
    
    // Add current point
    history.push({
      date: today.toISOString().split('T')[0],
      value: goalData.currentValue,
      formattedDate: today.toLocaleDateString()
    });
    
    // Sort by date
    history.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setProgressHistory(history);
  };
  
  // Update goal progress
  const updateGoalProgress = async () => {
    setUpdateLoading(true);
    setUpdateError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local goal state
      const updatedGoal = { ...goal, currentValue: updateValue };
      
      // Auto-update status if goal is met
      if (updateValue >= goal.targetValue) {
        updatedGoal.status = 'completed';
      } else if (goal.status === 'completed') {
        updatedGoal.status = 'active';
      }
      
      setGoal(updatedGoal);
      setUpdateDialogOpen(false);
      
      // Update progress history
      const updatedHistory = [...progressHistory];
      const today = new Date();
      
      // Check if we already have a point for today
      const todayPoint = updatedHistory.find(p => p.date === today.toISOString().split('T')[0]);
      
      if (todayPoint) {
        todayPoint.value = updateValue;
      } else {
        updatedHistory.push({
          date: today.toISOString().split('T')[0],
          value: updateValue,
          formattedDate: today.toLocaleDateString()
        });
      }
      
      // Sort by date
      updatedHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setProgressHistory(updatedHistory);
    } catch (err) {
      console.error('Error updating goal progress:', err);
      setUpdateError(err.message || 'Failed to update goal progress');
    } finally {
      setUpdateLoading(false);
    }
  };
  
  // Delete goal
  const deleteGoal = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/goals');
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError(err.message || 'Failed to delete goal');
      setDeleteDialogOpen(false);
    }
  };
  
  // Load goal on component mount
  useEffect(() => {
    fetchGoal();
  }, [goalId]);
  
  // Get icon based on goal type
  const getGoalIcon = () => {
    if (!goal) return <CustomIcon />;
    
    switch (goal.type) {
      case 'weight': return <WeightIcon fontSize="large" />;
      case 'strength': return <StrengthIcon fontSize="large" />;
      case 'endurance': return <EnduranceIcon fontSize="large" />;
      case 'habit': return <HabitIcon fontSize="large" />;
      case 'nutrition': return <NutritionIcon fontSize="large" />;
      case 'custom': return <CustomIcon fontSize="large" />;
      default: return <EmojiEvents fontSize="large" />;
    }
  };
  
  // Format goal title
  const getGoalTitle = () => {
    if (!goal) return 'Goal Details';
    
    switch (goal.type) {
      case 'weight': return 'Weight Goal';
      case 'strength': return 'Strength Goal';
      case 'endurance': return 'Endurance Goal';
      case 'habit': return 'Habit Goal';
      case 'nutrition': return 'Nutrition Goal';
      case 'custom': return 'Custom Goal';
      default: return 'Goal Details';
    }
  };
  
  // Get description based on goal type
  const getGoalDescription = () => {
    if (!goal) return '';
    
    const unit = goal.unit || '';
    
    switch (goal.type) {
      case 'weight':
        return goal.targetValue < goal.currentValue
          ? `Lose weight from ${goal.currentValue} ${unit} to ${goal.targetValue} ${unit}`
          : `Gain weight from ${goal.currentValue} ${unit} to ${goal.targetValue} ${unit}`;
      case 'strength':
        return `Increase ${goal.exerciseName || 'strength'} from ${goal.currentValue} ${unit} to ${goal.targetValue} ${unit}`;
      case 'endurance':
        return `Improve ${goal.activityType || 'endurance'} from ${goal.currentValue} ${unit} to ${goal.targetValue} ${unit}`;
      case 'habit':
        return `${goal.habitDescription || 'Build habit'} ${goal.targetValue} times ${goal.frequency || 'weekly'}`;
      case 'nutrition':
        return `${goal.nutritionType || 'Nutrition'} goal: ${goal.currentValue} ${unit} to ${goal.targetValue} ${unit}`;
      case 'custom':
        return goal.customDescription || `${goal.currentValue} ${unit} to ${goal.targetValue} ${unit}`;
      default:
        return '';
    }
  };
  
  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!goal || !goal.targetDate) return 'No deadline';
    
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const diffTime = Math.max(0, targetDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 0 ? 'Due today' : `${diffDays} days remaining`;
  };
  
  // Calculate total days
  const getTotalDays = () => {
    if (!goal || !goal.targetDate || !goal.startDate) return 0;
    
    const startDate = new Date(goal.startDate);
    const targetDate = new Date(goal.targetDate);
    const diffTime = Math.abs(targetDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Calculate elapsed days
  const getElapsedDays = () => {
    if (!goal || !goal.startDate) return 0;
    
    const startDate = new Date(goal.startDate);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Get status display
  const getStatusDisplay = () => {
    if (!goal) return null;
    
    if (goal.status === 'completed') {
      return <Chip label="Completed" color="success" />;
    }
    
    if (goal.status === 'abandoned') {
      return <Chip label="Abandoned" color="error" />;
    }
    
    if (new Date(goal.targetDate) < new Date()) {
      return <Chip label="Overdue" color="error" />;
    }
    
    return <Chip label="Active" color="primary" />;
  };
  
  // Handle update dialog
  const handleOpenUpdateDialog = () => {
    setUpdateDialogOpen(true);
    setUpdateValue(goal.currentValue || 0);
    setUpdateError(null);
  };
  
  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
  };
  
  // Handle delete dialog
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  // Go back to goals list
  const handleGoBack = () => {
    navigate('/goals');
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          Back to Goals
        </Button>
      </Box>
    );
  }
  
  if (!goal) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Goal not found
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          Back to Goals
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mr: 2 }}
        >
          Back to Goals
        </Button>
        <Typography variant="h5">
          {getGoalTitle()}
        </Typography>
        <Box>
          <IconButton color="primary" onClick={handleOpenUpdateDialog} sx={{ mr: 1 }}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={handleOpenDeleteDialog}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {/* Goal Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <Box
                sx={{
                  mr: 2,
                  p: 1.5,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                }}
              >
                {getGoalIcon()}
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {getGoalTitle()}
                </Typography>
                <Typography variant="body1">
                  {getGoalDescription()}
                </Typography>
                <Box sx={{ mt: 1.5 }}>
                  {getStatusDisplay()}
                </Box>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Start Date
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {goal.startDate ? new Date(goal.startDate).toLocaleDateString() : 'Not set'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FlagIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Target Date
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'Not set'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimelineIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Timeline
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {getDaysRemaining()} ({getElapsedDays()} days elapsed of {getTotalDays()} total days)
                </Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <GoalProgressCircle goal={goal} />
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<UpdateIcon />}
                onClick={handleOpenUpdateDialog}
              >
                Update Progress
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Progress Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Progress Over Time
            </Typography>
            
            <Box sx={{ height: 360 }}>
              {progressHistory.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressHistory}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                      dataKey="formattedDate" 
                      stroke={theme.palette.text.secondary}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip 
                      formatter={(value) => [
                        `${Number(value).toFixed(1)} ${goal.unit || ''}`, 
                        'Value'
                      ]}
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`
                      }}
                    />
                    <ReferenceLine 
                      y={goal.targetValue} 
                      stroke={theme.palette.success.main} 
                      strokeDasharray="3 3"
                      label={{ 
                        value: 'Target', 
                        position: 'right', 
                        fill: theme.palette.success.main,
                        fontSize: 12
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <TrendingUpIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Not enough data points to display chart
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Current Progress
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Current Value
                </Typography>
                <Typography variant="h6">
                  {goal.currentValue} {goal.unit}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Target Value
                </Typography>
                <Typography variant="h6">
                  {goal.targetValue} {goal.unit}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, (goal.currentValue / goal.targetValue) * 100))}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Milestones (if available) */}
        {goal.progressType === 'milestone' && goal.milestones && goal.milestones.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Milestones
              </Typography>
              
              <Grid container spacing={2}>
                {goal.milestones.map((milestone, index) => {
                  const isCompleted = goal.currentValue >= milestone.value;
                  const milestoneDate = new Date(milestone.date);
                  
                  return (
                    <Grid item xs={12} sm={4} key={index}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          bgcolor: isCompleted ? alpha(theme.palette.success.main, 0.1) : undefined,
                          borderColor: isCompleted ? theme.palette.success.main : undefined
                        }}
                      >
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            Milestone {index + 1}
                            {isCompleted && (
                              <CheckCircle 
                                color="success" 
                                fontSize="small" 
                                sx={{ ml: 1, verticalAlign: 'middle' }} 
                              />
                            )}
                          </Typography>
                          <Typography variant="h6">
                            {milestone.value} {goal.unit}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            By {milestoneDate.toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      {/* Update Progress Dialog */}
      <Dialog open={updateDialogOpen} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Update Goal Progress</DialogTitle>
        <DialogContent>
          {updateError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {updateError}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label={`Current Value (${goal.unit || ''})`}
            type="number"
            value={updateValue}
            onChange={(e) => setUpdateValue(parseFloat(e.target.value))}
            margin="normal"
            InputProps={{ inputProps: { min: 0 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button 
            onClick={updateGoalProgress} 
            variant="contained"
            disabled={updateLoading}
          >
            {updateLoading ? <CircularProgress size={24} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Goal</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this goal? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button 
            onClick={deleteGoal} 
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GoalDetail;