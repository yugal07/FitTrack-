// src/components/dashboard/GoalsSummary.jsx (with mock data)
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  EmojiEvents as GoalsIcon,
  Check as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
  FitnessCenter as FitnessCenterIcon,
  MonitorWeight as WeightIcon,
  DirectionsRun as DirectionsRunIcon,
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
  }
];

const GoalProgressItem = ({ goal }) => {
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
  
  // Get icon based on goal type
  const getGoalIcon = () => {
    switch (goal.type) {
      case 'weight': return <WeightIcon />;
      case 'strength': return <FitnessCenterIcon />;
      case 'endurance': return <DirectionsRunIcon />;
      default: return <GoalsIcon />;
    }
  };
  
  // Format goal description
  const getGoalDescription = () => {
    const unit = goal.unit || '';
    
    if (goal.type === 'weight' && goal.targetValue < goal.currentValue) {
      return `${goal.currentValue} ${unit} → ${goal.targetValue} ${unit}`;
    }
    
    return `${goal.currentValue} ${unit} / ${goal.targetValue} ${unit}`;
  };
  
  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!goal.targetDate) return '';
    
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const diffTime = Math.max(0, targetDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 0 ? 'Due today' : `${diffDays} days left`;
  };
  
  const progress = calculateProgress();
  
  // Get appropriate color based on progress
  const getProgressColor = () => {
    if (progress < 25) return theme.palette.error.main;
    if (progress < 50) return theme.palette.warning.main;
    if (progress < 75) return theme.palette.info.main;
    return theme.palette.success.main;
  };
  
  return (
    <>
      <ListItem
        component={RouterLink}
        to={`/goals/${goal._id}`}
        sx={{
          py: 1.5,
          px: 2,
          textDecoration: 'none',
          color: 'inherit',
          borderRadius: 1,
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          }
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          {getGoalIcon()}
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">
                {goal.type === 'weight' ? 'Weight Goal' : 
                 goal.type === 'strength' ? 'Strength Goal' : 
                 goal.type === 'endurance' ? 'Endurance Goal' : 
                 'Goal'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getDaysRemaining()}
              </Typography>
            </Box>
          }
          secondary={
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {getGoalDescription()}
                </Typography>
                <Typography variant="body2" fontWeight="medium" color={getProgressColor()}>
                  {Math.round(progress)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: getProgressColor(),
                  }
                }}
              />
            </Box>
          }
          primaryTypographyProps={{ 
            fontWeight: 'medium'
          }}
          secondaryTypographyProps={{
            component: 'div'
          }}
        />
      </ListItem>
      <Divider component="li" />
    </>
  );
};

const GoalsSummary = () => {
  const theme = useTheme();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Simulate loading data from API
  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setGoals(mockGoals);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <Paper sx={{ p: 3, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={32} />
      </Paper>
    );
  }
  
  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Active Goals
        </Typography>
        <Button
          component={RouterLink}
          to="/goals"
          endIcon={<ArrowForwardIcon />}
          size="small"
        >
          View All
        </Button>
      </Box>
      
      <Divider />
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {goals.length > 0 ? (
          <List disablePadding>
            {goals.map(goal => (
              <GoalProgressItem key={goal._id} goal={goal} />
            ))}
          </List>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 3 }}>
            <GoalsIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography variant="body1" gutterBottom align="center">
              No active goals found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph align="center">
              Set your fitness goals to track your progress
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/goals/create"
              startIcon={<AddIcon />}
              size="small"
              sx={{ mt: 1 }}
            >
              Create New Goal
            </Button>
          </Box>
        )}
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          component={RouterLink}
          to="/goals/create"
          startIcon={<AddIcon />}
          size="small"
        >
          Create New Goal
        </Button>
      </Box>
    </Paper>
  );
};

export default GoalsSummary;