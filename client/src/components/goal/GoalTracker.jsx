// src/components/goal/GoalTracker.jsx (with mock data)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  LinearProgress,
  Alert,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  alpha,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  MonitorWeight as WeightIcon,
  FitnessCenter as StrengthIcon,
  DirectionsRun as EnduranceIcon,
  CheckCircle as HabitIcon,
  Restaurant as NutritionIcon,
  EmojiEvents as CustomIcon,
  TrendingUp as TrendingUpIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';

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
    status: 'active'
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
    status: 'active'
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
    status: 'active'
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
    status: 'active'
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
    status: 'completed'
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
    status: 'abandoned'
  }
];

// Component for the goal progress visualization
const GoalProgress = ({ goal }) => {
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
    <Box sx={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress
        variant="determinate"
        value={progressValue}
        size={80}
        thickness={4}
        sx={{ color: getProgressColor() }}
      />
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" component="div" fontWeight="bold">
          {formatProgress()}
        </Typography>
      </Box>
    </Box>
  );
};

// Component for the goal card
const GoalCard = ({ goal, onUpdate, onDelete }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateValue, setUpdateValue] = useState(goal.currentValue || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEditClick = () => {
    handleMenuClose();
    setUpdateDialogOpen(true);
  };
  
  const handleDeleteClick = () => {
    handleMenuClose();
    onDelete(goal._id);
  };
  
  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
    setUpdateValue(goal.currentValue || 0);
    setError(null);
  };
  
  const handleUpdateSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      await onUpdate(goal._id, updateValue);
      setUpdateDialogOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to update goal progress');
    } finally {
      setLoading(false);
    }
  };
  
  // Get icon based on goal type
  const getGoalIcon = () => {
    switch (goal.type) {
      case 'weight': return <WeightIcon />;
      case 'strength': return <StrengthIcon />;
      case 'endurance': return <EnduranceIcon />;
      case 'habit': return <HabitIcon />;
      case 'nutrition': return <NutritionIcon />;
      case 'custom': return <CustomIcon />;
      default: return <EmojiEvents />;
    }
  };
  
  // Format goal title
  const getGoalTitle = () => {
    switch (goal.type) {
      case 'weight': return 'Weight Goal';
      case 'strength': return 'Strength Goal';
      case 'endurance': return 'Endurance Goal';
      case 'habit': return 'Habit Goal';
      case 'nutrition': return 'Nutrition Goal';
      case 'custom': return 'Custom Goal';
      default: return 'Goal';
    }
  };
  
  // Format goal description
  const getGoalDescription = () => {
    const unit = goal.unit || '';
    const target = goal.targetValue || 0;
    const current = goal.currentValue || 0;
    
    if (goal.type === 'weight' && target < current) {
      return `Lose weight from ${current} ${unit} to ${target} ${unit}`;
    }
    
    return `${current} ${unit} / ${target} ${unit}`;
  };
  
  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!goal.targetDate) return 'No deadline';
    
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const diffTime = Math.max(0, targetDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 0 ? 'Due today' : `${diffDays} days left`;
  };
  
  // Get status display
  const getStatusDisplay = () => {
    if (goal.status === 'completed') {
      return <Chip label="Completed" color="success" size="small" />;
    }
    
    if (goal.status === 'abandoned') {
      return <Chip label="Abandoned" color="error" size="small" />;
    }
    
    if (new Date(goal.targetDate) < new Date()) {
      return <Chip label="Overdue" color="error" size="small" />;
    }
    
    return <Chip label="Active" color="primary" size="small" />;
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                mr: 1.5, 
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                p: 1,
                borderRadius: '50%'
              }}
            >
              {getGoalIcon()}
            </Box>
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                {getGoalTitle()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getGoalDescription()}
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditClick}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Update Progress
              </MenuItem>
              <MenuItem onClick={handleDeleteClick}>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Delete Goal
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <GoalProgress goal={goal} />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">
            {getDaysRemaining()}
          </Typography>
          {getStatusDisplay()}
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          startIcon={<ShowChartIcon />}
          onClick={handleEditClick}
        >
          Update Progress
        </Button>
      </CardActions>
      
      {/* Update Progress Dialog */}
      <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
        <DialogTitle>Update Goal Progress</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
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
          <Button onClick={handleUpdateDialogClose}>Cancel</Button>
          <Button 
            onClick={handleUpdateSubmit} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

// Main component for goal tracking
const GoalTracker = ({ viewMode = 'grid' }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');
  
  // Simulate fetching goals from API
  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setGoals(mockGoals);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update goal progress (mock implementation)
  const updateGoalProgress = async (goalId, currentValue) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state
      setGoals(prevGoals => 
        prevGoals.map(goal => {
          if (goal._id === goalId) {
            // Auto-update status if goal is met
            let status = goal.status;
            if (currentValue >= goal.targetValue) {
              status = 'completed';
            } else if (status === 'completed') {
              status = 'active';
            }
            
            return { ...goal, currentValue, status };
          }
          return goal;
        })
      );
      
      return { success: true };
    } catch (err) {
      console.error('Error updating goal progress:', err);
      throw new Error('Failed to update goal progress');
    }
  };
  
  // Delete goal (mock implementation)
  const deleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state
      setGoals(prevGoals => prevGoals.filter(goal => goal._id !== goalId));
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Failed to delete goal');
    }
  };
  
  // Filter goals
  const getFilteredGoals = () => {
    return goals.filter(goal => {
      // Filter by type
      if (filterType !== 'all' && goal.type !== filterType) {
        return false;
      }
      
      // Filter by status
      if (filterStatus !== 'all' && goal.status !== filterStatus) {
        return false;
      }
      
      return true;
    });
  };
  
  // Get completion stats
  const getCompletionStats = () => {
    const total = goals.length;
    const completed = goals.filter(goal => goal.status === 'completed').length;
    const inProgress = goals.filter(goal => goal.status === 'active').length;
    const abandoned = goals.filter(goal => goal.status === 'abandoned').length;
    
    return { total, completed, inProgress, abandoned };
  };
  
  // Handle creating a new goal
  const handleCreateGoal = () => {
    navigate('/goals/create');
  };
  
  const filteredGoals = getFilteredGoals();
  const stats = getCompletionStats();
  
  if (loading && goals.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Goal Tracker
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleCreateGoal}
        >
          Create Goal
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Goals
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {stats.completed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {stats.inProgress}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In Progress
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="error.main" fontWeight="bold">
              {stats.abandoned}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Abandoned
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1">Filter Goals</Typography>
          </Grid>
          <Grid item xs={12} sm={4.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Goal Type</InputLabel>
              <Select
                value={filterType}
                label="Goal Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="weight">Weight</MenuItem>
                <MenuItem value="strength">Strength</MenuItem>
                <MenuItem value="endurance">Endurance</MenuItem>
                <MenuItem value="habit">Habit</MenuItem>
                <MenuItem value="nutrition">Nutrition</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="abandoned">Abandoned</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Goal Cards */}
      {filteredGoals.length > 0 ? (
        <Grid container spacing={3}>
          {filteredGoals.map(goal => (
            <Grid item xs={12} sm={6} md={4} key={goal._id}>
              <GoalCard 
                goal={goal} 
                onUpdate={updateGoalProgress} 
                onDelete={deleteGoal}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <EmojiEvents sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No goals found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {goals.length > 0 
              ? 'Try changing your filters to see more goals' 
              : 'Start by creating your first fitness goal'}
          </Typography>
          {goals.length === 0 && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleCreateGoal}
              sx={{ mt: 2 }}
            >
              Create Your First Goal
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default GoalTracker;