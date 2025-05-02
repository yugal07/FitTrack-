// src/components/goal/GoalWizard.jsx (with mock data)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Grid,
  Divider,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  IconButton,
  Slider,
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  DirectionsRun as DirectionsRunIcon,
  MonitorWeight as MonitorWeightIcon,
  LocalDrink as LocalDrinkIcon,
  Restaurant as RestaurantIcon,
  EmojiEvents as EmojiEventsIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Flag as FlagIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
} from '@mui/icons-material';

// Step content components
const GoalTypeStep = ({ goalData, updateGoalData }) => {
  const theme = useTheme();

  const goalTypes = [
    {
      type: 'weight',
      title: 'Weight Goal',
      icon: <MonitorWeightIcon fontSize="large" />,
      description: 'Set targets for weight loss or gain'
    },
    {
      type: 'strength',
      title: 'Strength Goal',
      icon: <FitnessCenterIcon fontSize="large" />,
      description: 'Set targets for lifting weights or bodyweight exercises'
    },
    {
      type: 'endurance',
      title: 'Endurance Goal',
      icon: <DirectionsRunIcon fontSize="large" />,
      description: 'Set targets for running, cycling, or other cardio activities'
    },
    {
      type: 'habit',
      title: 'Habit Goal',
      icon: <CheckCircleIcon fontSize="large" />,
      description: 'Build consistent workout habits'
    },
    {
      type: 'nutrition',
      title: 'Nutrition Goal',
      icon: <RestaurantIcon fontSize="large" />,
      description: 'Set targets for calorie intake or macronutrients'
    },
    {
      type: 'custom',
      title: 'Custom Goal',
      icon: <AddIcon fontSize="large" />,
      description: 'Create a fully customized fitness goal'
    }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Goal Type
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Choose the type of goal you want to set. This will help us tailor the goal-setting process to your needs.
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {goalTypes.map((goalType) => (
          <Grid item xs={12} sm={6} md={4} key={goalType.type}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: goalData.type === goalType.type ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
                backgroundColor: goalData.type === goalType.type 
                  ? alpha(theme.palette.primary.main, 0.05) 
                  : theme.palette.background.paper,
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  transform: 'translateY(-4px)',
                }
              }}
              onClick={() => updateGoalData({ type: goalType.type })}
            >
              <Box 
                sx={{ 
                  mb: 2, 
                  color: goalData.type === goalType.type ? theme.palette.primary.main : 'text.secondary' 
                }}
              >
                {goalType.icon}
              </Box>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                {goalType.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {goalType.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const GoalDetailsStep = ({ goalData, updateGoalData }) => {
  const theme = useTheme();

  // Type-specific form fields
  const renderTypeSpecificFields = () => {
    switch (goalData.type) {
      case 'weight':
        return (
          <>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Weight"
                  name="currentValue"
                  type="number"
                  value={goalData.currentValue || ''}
                  onChange={(e) => updateGoalData({ currentValue: parseFloat(e.target.value) })}
                  InputProps={{
                    endAdornment: <Typography variant="body2">{goalData.unit || 'kg'}</Typography>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Target Weight"
                  name="targetValue"
                  type="number"
                  value={goalData.targetValue || ''}
                  onChange={(e) => updateGoalData({ targetValue: parseFloat(e.target.value) })}
                  InputProps={{
                    endAdornment: <Typography variant="body2">{goalData.unit || 'kg'}</Typography>
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <FormLabel component="legend">Select Unit</FormLabel>
                  <RadioGroup
                    row
                    value={goalData.unit || 'kg'}
                    onChange={(e) => updateGoalData({ unit: e.target.value })}
                  >
                    <FormControlLabel value="kg" control={<Radio />} label="Kilograms (kg)" />
                    <FormControlLabel value="lbs" control={<Radio />} label="Pounds (lbs)" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </>
        );
      
      case 'strength':
        return (
          <>
            <TextField
              fullWidth
              required
              label="Exercise Name"
              name="exerciseName"
              value={goalData.exerciseName || ''}
              onChange={(e) => updateGoalData({ exerciseName: e.target.value })}
              placeholder="e.g., Bench Press, Squats, Pull-ups"
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current"
                  name="currentValue"
                  type="number"
                  value={goalData.currentValue || ''}
                  onChange={(e) => updateGoalData({ currentValue: parseFloat(e.target.value) })}
                  InputProps={{
                    endAdornment: <Typography variant="body2">{goalData.unit || 'kg'}</Typography>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Target"
                  name="targetValue"
                  type="number"
                  value={goalData.targetValue || ''}
                  onChange={(e) => updateGoalData({ targetValue: parseFloat(e.target.value) })}
                  InputProps={{
                    endAdornment: <Typography variant="body2">{goalData.unit || 'kg'}</Typography>
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel>Measurement Type</InputLabel>
                  <Select
                    value={goalData.unit || 'kg'}
                    label="Measurement Type"
                    onChange={(e) => updateGoalData({ unit: e.target.value })}
                  >
                    <MenuItem value="kg">Weight (kg)</MenuItem>
                    <MenuItem value="lbs">Weight (lbs)</MenuItem>
                    <MenuItem value="reps">Repetitions</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </>
        );
      
      case 'endurance':
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Activity Type</InputLabel>
              <Select
                value={goalData.activityType || 'running'}
                label="Activity Type"
                onChange={(e) => updateGoalData({ activityType: e.target.value })}
              >
                <MenuItem value="running">Running</MenuItem>
                <MenuItem value="cycling">Cycling</MenuItem>
                <MenuItem value="swimming">Swimming</MenuItem>
                <MenuItem value="walking">Walking</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current"
                  name="currentValue"
                  type="number"
                  value={goalData.currentValue || ''}
                  onChange={(e) => updateGoalData({ currentValue: parseFloat(e.target.value) })}
                  InputProps={{
                    endAdornment: <Typography variant="body2">{goalData.unit || 'km'}</Typography>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Target"
                  name="targetValue"
                  type="number"
                  value={goalData.targetValue || ''}
                  onChange={(e) => updateGoalData({ targetValue: parseFloat(e.target.value) })}
                  InputProps={{
                    endAdornment: <Typography variant="body2">{goalData.unit || 'km'}</Typography>
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel>Measurement Type</InputLabel>
                  <Select
                    value={goalData.unit || 'km'}
                    label="Measurement Type"
                    onChange={(e) => updateGoalData({ unit: e.target.value })}
                  >
                    <MenuItem value="km">Distance (km)</MenuItem>
                    <MenuItem value="mi">Distance (miles)</MenuItem>
                    <MenuItem value="min">Time (minutes)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </>
        );
      
      case 'habit':
        return (
          <>
            <TextField
              fullWidth
              required
              label="Habit Description"
              name="habitDescription"
              value={goalData.habitDescription || ''}
              onChange={(e) => updateGoalData({ habitDescription: e.target.value })}
              placeholder="e.g., Work out 3 times per week"
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={goalData.frequency || 'weekly'}
                label="Frequency"
                onChange={(e) => updateGoalData({ frequency: e.target.value })}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              required
              label="Target Frequency"
              name="targetValue"
              type="number"
              value={goalData.targetValue || ''}
              onChange={(e) => updateGoalData({ targetValue: parseInt(e.target.value, 10) })}
              helperText={`Number of times ${goalData.frequency || 'weekly'}`}
              InputProps={{
                endAdornment: <Typography variant="body2">times</Typography>
              }}
            />
          </>
        );
      
      case 'nutrition':
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Nutrition Type</InputLabel>
              <Select
                value={goalData.nutritionType || 'calories'}
                label="Nutrition Type"
                onChange={(e) => updateGoalData({ nutritionType: e.target.value })}
              >
                <MenuItem value="calories">Daily Calories</MenuItem>
                <MenuItem value="protein">Protein Intake</MenuItem>
                <MenuItem value="carbs">Carbohydrate Intake</MenuItem>
                <MenuItem value="fat">Fat Intake</MenuItem>
                <MenuItem value="water">Water Intake</MenuItem>
              </Select>
            </FormControl>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Intake"
                  name="currentValue"
                  type="number"
                  value={goalData.currentValue || ''}
                  onChange={(e) => updateGoalData({ currentValue: parseFloat(e.target.value) })}
                  InputProps={{
                    endAdornment: <Typography variant="body2">
                      {goalData.nutritionType === 'water' ? 'L' : 
                      goalData.nutritionType === 'calories' ? 'kcal' : 'g'}
                    </Typography>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Target Intake"
                  name="targetValue"
                  type="number"
                  value={goalData.targetValue || ''}
                  onChange={(e) => updateGoalData({ targetValue: parseFloat(e.target.value) })}
                  InputProps={{
                    endAdornment: <Typography variant="body2">
                      {goalData.nutritionType === 'water' ? 'L' : 
                      goalData.nutritionType === 'calories' ? 'kcal' : 'g'}
                    </Typography>
                  }}
                />
              </Grid>
            </Grid>
            
            {/* Automatically set the unit based on nutrition type */}
            {goalData.nutritionType && updateGoalData({ 
              unit: goalData.nutritionType === 'water' ? 'L' : 
                  goalData.nutritionType === 'calories' ? 'kcal' : 'g' 
            })}
          </>
        );
      
      case 'custom':
        return (
          <>
            <TextField
              fullWidth
              required
              label="Goal Description"
              name="customDescription"
              value={goalData.customDescription || ''}
              onChange={(e) => updateGoalData({ customDescription: e.target.value })}
              placeholder="Describe your custom goal"
              sx={{ mb: 2 }}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Value"
                  name="currentValue"
                  type="number"
                  value={goalData.currentValue || ''}
                  onChange={(e) => updateGoalData({ currentValue: parseFloat(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Target Value"
                  name="targetValue"
                  type="number"
                  value={goalData.targetValue || ''}
                  onChange={(e) => updateGoalData({ targetValue: parseFloat(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Unit of Measurement"
                  name="unit"
                  value={goalData.unit || ''}
                  onChange={(e) => updateGoalData({ unit: e.target.value })}
                  placeholder="e.g., kg, minutes, times per week"
                />
              </Grid>
            </Grid>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Set Goal Details
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Provide specific details about your {goalData.type} goal.
      </Typography>

      {renderTypeSpecificFields()}
    </Box>
  );
};

const TimelineStep = ({ goalData, updateGoalData }) => {
  const theme = useTheme();
  
  // Calculate minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  // Calculate maximum date (5 years from now)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 5);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // Generate milestone dates (if target date is set)
  const generateMilestoneDates = () => {
    if (!goalData.targetDate) return [];
    
    const startDate = new Date();
    const endDate = new Date(goalData.targetDate);
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // Create 3 milestones
    const milestones = [];
    for (let i = 1; i <= 3; i++) {
      const milestone = new Date(startDate);
      milestone.setDate(startDate.getDate() + Math.floor(totalDays * (i / 4)));
      milestones.push(milestone.toISOString().split('T')[0]);
    }
    
    return milestones;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Set Timeline & Milestones
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Set your target date and define milestones to track your progress.
      </Typography>

      <TextField
        fullWidth
        required
        label="Target Date"
        type="date"
        value={goalData.targetDate || ''}
        onChange={(e) => updateGoalData({ targetDate: e.target.value })}
        InputLabelProps={{ shrink: true }}
        inputProps={{ min: minDate, max: maxDateString }}
        sx={{ mb: 4 }}
      />

      {goalData.targetDate && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Milestone Planning
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Progress Tracking Type</Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={goalData.progressType || 'linear'}
                onChange={(e) => updateGoalData({ progressType: e.target.value })}
              >
                <FormControlLabel value="linear" control={<Radio />} label="Linear Progress" />
                <FormControlLabel value="milestone" control={<Radio />} label="Milestone-based" />
              </RadioGroup>
            </FormControl>
          </Box>

          {goalData.progressType === 'milestone' && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Set milestone values based on your target value of {goalData.targetValue} {goalData.unit}.
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {generateMilestoneDates().map((date, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Milestone {index + 1}
                      </Typography>
                      <TextField
                        fullWidth
                        type="date"
                        value={date}
                        disabled
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Target Value"
                        type="number"
                        value={goalData.milestones ? (goalData.milestones[index]?.value || '') : ''}
                        onChange={(e) => {
                          const newMilestones = [...(goalData.milestones || [])];
                          if (!newMilestones[index]) {
                            newMilestones[index] = {};
                          }
                          newMilestones[index] = {
                            ...newMilestones[index],
                            date,
                            value: parseFloat(e.target.value)
                          };
                          updateGoalData({ milestones: newMilestones });
                        }}
                        InputProps={{
                          endAdornment: <Typography variant="body2">{goalData.unit}</Typography>
                        }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

const ReviewStep = ({ goalData }) => {
  const theme = useTheme();
  
  // Get goal type display name
  const getGoalTypeDisplay = () => {
    switch (goalData.type) {
      case 'weight': return 'Weight Goal';
      case 'strength': return 'Strength Goal';
      case 'endurance': return 'Endurance Goal';
      case 'habit': return 'Habit Goal';
      case 'nutrition': return 'Nutrition Goal';
      case 'custom': return 'Custom Goal';
      default: return 'Goal';
    }
  };
  
  // Get goal description based on type
  const getGoalDescription = () => {
    switch (goalData.type) {
      case 'weight':
        return `${goalData.currentValue || 0} ${goalData.unit} → ${goalData.targetValue} ${goalData.unit}`;
      case 'strength':
        return `${goalData.exerciseName}: ${goalData.currentValue || 0} ${goalData.unit} → ${goalData.targetValue} ${goalData.unit}`;
      case 'endurance':
        return `${goalData.activityType}: ${goalData.currentValue || 0} ${goalData.unit} → ${goalData.targetValue} ${goalData.unit}`;
      case 'habit':
        return `${goalData.habitDescription}: ${goalData.targetValue} times ${goalData.frequency}`;
      case 'nutrition':
        return `${goalData.nutritionType}: ${goalData.currentValue || 0} ${goalData.unit} → ${goalData.targetValue} ${goalData.unit}`;
      case 'custom':
        return `${goalData.customDescription}: ${goalData.currentValue || 0} ${goalData.unit || ''} → ${goalData.targetValue} ${goalData.unit || ''}`;
      default:
        return '';
    }
  };

  // Get appropriate icon for goal type
  const getGoalIcon = () => {
    switch (goalData.type) {
      case 'weight': return <MonitorWeightIcon fontSize="large" />;
      case 'strength': return <FitnessCenterIcon fontSize="large" />;
      case 'endurance': return <DirectionsRunIcon fontSize="large" />;
      case 'habit': return <CheckCircleIcon fontSize="large" />;
      case 'nutrition': return <RestaurantIcon fontSize="large" />;
      case 'custom': return <EmojiEventsIcon fontSize="large" />;
      default: return <FlagIcon fontSize="large" />;
    }
  };

  // Calculate days until target
  const calculateDaysUntilTarget = () => {
    if (!goalData.targetDate) return 0;
    
    const today = new Date();
    const targetDate = new Date(goalData.targetDate);
    const diffTime = Math.abs(targetDate - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Goal
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Review your goal details before finalizing.
      </Typography>

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.background.default, 0.5)
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              {getGoalTypeDisplay()}
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {getGoalDescription()}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Timeline Details
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Start Date:</Typography>
              <Typography variant="body2">{new Date().toLocaleDateString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Target Date:</Typography>
              <Typography variant="body2">{goalData.targetDate ? new Date(goalData.targetDate).toLocaleDateString() : 'Not set'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Days to Achieve:</Typography>
              <Typography variant="body2">{calculateDaysUntilTarget()} days</Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Progress Tracking
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Tracking Type:</Typography>
              <Typography variant="body2">{goalData.progressType === 'milestone' ? 'Milestone-based' : 'Linear Progress'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Current Value:</Typography>
              <Typography variant="body2">{goalData.currentValue || '0'} {goalData.unit}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Target Value:</Typography>
              <Typography variant="body2" fontWeight="medium">{goalData.targetValue} {goalData.unit}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {goalData.progressType === 'milestone' && goalData.milestones && goalData.milestones.length > 0 && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Milestones
          </Typography>
          <Grid container spacing={2}>
            {goalData.milestones.map((milestone, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box sx={{ 
                  p: 1.5, 
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Milestone {index + 1}:
                  </Typography>
                  <Typography variant="body2">
                    {milestone.value} {goalData.unit} by {new Date(milestone.date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

// Main component
const GoalWizard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Set start date to today
  const today = new Date();
  
  // State for goal data
  const [goalData, setGoalData] = useState({
    type: '',
    currentValue: '',
    targetValue: '',
    unit: '',
    targetDate: '',
    startDate: today.toISOString(),
    progressType: 'linear',
    milestones: [],
    status: 'active'
  });

  // Update goal data
  const updateGoalData = (newData) => {
    setGoalData(prevData => ({ ...prevData, ...newData }));
  };

  // Steps configuration
  const steps = [
    {
      label: 'Goal Type',
      component: <GoalTypeStep goalData={goalData} updateGoalData={updateGoalData} />
    },
    {
      label: 'Goal Details',
      component: <GoalDetailsStep goalData={goalData} updateGoalData={updateGoalData} />
    },
    {
      label: 'Timeline & Milestones',
      component: <TimelineStep goalData={goalData} updateGoalData={updateGoalData} />
    },
    {
      label: 'Review',
      component: <ReviewStep goalData={goalData} />
    }
  ];

  // Handle step navigation
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  // Validate current step
  const validateStep = () => {
    switch (activeStep) {
      case 0: // Goal Type
        return !!goalData.type;
      case 1: // Goal Details
        return !!goalData.targetValue;
      case 2: // Timeline
        return !!goalData.targetDate;
      case 3: // Review
        return true;
      default:
        return false;
    }
  };

  // Submit goal - mock implementation
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log the goal data that would be sent to the API
      console.log('Goal data submitted:', goalData);
      
      setSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/goals');
      }, 1500);
    } catch (err) {
      console.error('Error creating goal:', err);
      setError('Failed to create goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create New Goal
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Goal created successfully! Redirecting...
        </Alert>
      )}
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Current step content */}
      <Box sx={{ mb: 4 }}>
        {steps[activeStep].component}
      </Box>
      
      {/* Navigation buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0 || loading}
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          onClick={handleNext}
          endIcon={activeStep === steps.length - 1 ? <SaveIcon /> : <ArrowForwardIcon />}
          disabled={!validateStep() || loading}
        >
          {activeStep === steps.length - 1 ? (
            loading ? <CircularProgress size={24} /> : 'Save Goal'
          ) : (
            'Next'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default GoalWizard;