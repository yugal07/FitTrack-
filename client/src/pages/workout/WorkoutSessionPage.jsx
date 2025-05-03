// src/pages/WorkoutSessionPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  Rating,
  LinearProgress,
  CircularProgress,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RestartIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  Check as CompleteIcon,
  Cancel as CancelIcon,
  RestartAlt as ResetIcon,
  Timer as TimerIcon,
  FitnessCenter as WorkoutIcon,
  Whatshot as CaloriesIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  LocalFireDepartment as FireIcon
} from '@mui/icons-material';
import axios from 'axios';

const WorkoutSessionPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sets, setSets] = useState({});
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [workoutRating, setWorkoutRating] = useState(3);
  const [workoutDifficulty, setWorkoutDifficulty] = useState(3);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const timerRef = useRef(null);

  // Fetch workout data
  useEffect(() => {
    const fetchWorkout = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/workouts/${id}`);
        
        if (response.data.success) {
          setWorkout(response.data.data);
          // Initialize sets tracking state
          const initialSets = {};
          response.data.data.exercises.forEach((exercise, index) => {
            initialSets[index] = Array(exercise.sets).fill({ completed: false, reps: exercise.reps, weight: 0 });
          });
          setSets(initialSets);
        } else {
          throw new Error(response.data.error?.message || 'Failed to fetch workout details');
        }
      } catch (err) {
        console.error('Error fetching workout for session:', err);
        setError('Failed to load workout details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkout();
    
    // Start session timer
    setSessionStartTime(Date.now());
    const sessionTimerInterval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - (sessionStartTime || Date.now())) / 1000));
    }, 1000);
    
    // Clean up on unmount
    return () => {
      clearInterval(sessionTimerInterval);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id, sessionStartTime]);

  // Handle timer for rest periods
  useEffect(() => {
    if (timeRemaining > 0 && isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeRemaining, isTimerRunning]);

  // Demo workout data for UI preview (will be replaced by API data)
  const demoWorkout = {
    _id: '1',
    name: 'Full Body Strength',
    description: 'A comprehensive full body workout targeting all major muscle groups.',
    type: 'strength',
    fitnessLevel: 'intermediate',
    duration: 45,
    exercises: [
      {
        exerciseId: {
          _id: 'ex1',
          name: 'Barbell Squat',
          muscleGroups: ['legs'],
          difficulty: 'intermediate',
          instructions: 'Stand with feet shoulder-width apart. Lower your body by bending your knees and pushing your hips back as if sitting in a chair. Keep your chest up and back straight. Return to starting position.'
        },
        sets: 4,
        reps: 10,
        restTime: 90,
        order: 1
      },
      {
        exerciseId: {
          _id: 'ex2',
          name: 'Push-up',
          muscleGroups: ['chest', 'arms'],
          difficulty: 'beginner',
          instructions: 'Start in a plank position with hands slightly wider than shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.'
        },
        sets: 3,
        reps: 15,
        restTime: 60,
        order: 2
      },
      {
        exerciseId: {
          _id: 'ex3',
          name: 'Dumbbell Row',
          muscleGroups: ['back'],
          difficulty: 'beginner',
          instructions: 'Place one knee and hand on a bench with your back flat. Hold a dumbbell in your free hand, arm extended toward the floor. Pull the dumbbell up to your rib cage, then lower it back down.'
        },
        sets: 3,
        reps: 12,
        restTime: 60,
        order: 3
      },
      {
        exerciseId: {
          _id: 'ex4',
          name: 'Plank',
          muscleGroups: ['core'],
          difficulty: 'beginner',
          instructions: 'Start in a forearm plank position with elbows directly beneath shoulders. Keep your body in a straight line from head to heels. Hold the position.'
        },
        sets: 3,
        duration: 45,
        restTime: 45,
        order: 4
      }
    ]
  };

  // Use demo workout if no workout loaded yet
  const displayWorkout = workout || demoWorkout;

  // Start rest timer
  const startRestTimer = (restTime) => {
    setTimeRemaining(restTime);
    setIsTimerRunning(true);
  };

  // Toggle timer pause/play
  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  // Reset timer
  const resetTimer = () => {
    const currentExercise = displayWorkout.exercises[activeStep];
    setTimeRemaining(currentExercise.restTime);
    setIsTimerRunning(true);
  };

  // Mark a set as completed
  const completeSet = (exerciseIndex, setIndex) => {
    const newSets = { ...sets };
    newSets[exerciseIndex] = [...newSets[exerciseIndex]];
    newSets[exerciseIndex][setIndex] = { 
      ...newSets[exerciseIndex][setIndex], 
      completed: true 
    };
    setSets(newSets);
    
    // If this was the last set, prepare to move to the next exercise
    if (setIndex === displayWorkout.exercises[exerciseIndex].sets - 1) {
      // Wait a moment before starting the rest timer
      setTimeout(() => {
        const currentExercise = displayWorkout.exercises[exerciseIndex];
        if (currentExercise.restTime) {
          startRestTimer(currentExercise.restTime);
        }
      }, 1000);
    }
  };

  // Track set details (weight, reps)
  const updateSetDetails = (exerciseIndex, setIndex, field, value) => {
    const newSets = { ...sets };
    newSets[exerciseIndex] = [...newSets[exerciseIndex]];
    newSets[exerciseIndex][setIndex] = { 
      ...newSets[exerciseIndex][setIndex], 
      [field]: value 
    };
    setSets(newSets);
  };

  // Check if all sets for current exercise are completed
  const isExerciseCompleted = (index) => {
    if (!sets[index]) return false;
    return sets[index].every(set => set.completed);
  };

  // Handle next step
  const handleNext = () => {
    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    
    // Check if we're at the last exercise
    if (activeStep === displayWorkout.exercises.length - 1) {
      // Show workout completion dialog
      setOpenCompleteDialog(true);
    } else {
      // Move to next exercise
      setActiveStep(activeStep + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // Complete workout session
  const completeWorkout = async () => {
    try {
      // Prepare workout session data
      const sessionData = {
        workoutId: id,
        duration: Math.floor(sessionDuration / 60), // Convert to minutes
        completedExercises: Object.keys(sets).map(exerciseIndex => ({
          exerciseId: displayWorkout.exercises[exerciseIndex].exerciseId._id,
          sets: sets[exerciseIndex].map(set => ({
            weight: set.weight,
            reps: set.reps,
            completed: set.completed
          }))
        })),
        caloriesBurned: calculateCaloriesBurned(),
        rating: workoutRating,
        difficulty: workoutDifficulty,
        notes: workoutNotes
      };
      
      // In a real app, send this data to the API
      console.log('Workout session completed:', sessionData);
      // const response = await axios.post('/api/workout-sessions', sessionData);
      
      // Redirect to workout history or dashboard
      navigate('/dashboard', { state: { workoutCompleted: true } });
    } catch (err) {
      console.error('Error saving workout session:', err);
    }
  };

  // Cancel workout session
  const cancelWorkout = () => {
    navigate(-1);
  };

  // Format timer display as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate estimated calories burned
  const calculateCaloriesBurned = () => {
    // Simple calculation based on duration, workout type, and fitness level
    const baseRate = displayWorkout.type === 'cardio' || displayWorkout.type === 'hiit' 
      ? 10 : 7; // calories burned per minute
    
    const intensityMultiplier = 
      displayWorkout.fitnessLevel === 'beginner' ? 0.8 :
      displayWorkout.fitnessLevel === 'intermediate' ? 1 : 1.2;
    
    return Math.round((sessionDuration / 60) * baseRate * intensityMultiplier);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        <Button 
          startIcon={<BackIcon />}
          component={RouterLink}
          to="/workouts"
        >
          Back to Workouts
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Session Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {displayWorkout.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Chip 
            icon={<WorkoutIcon />} 
            label={displayWorkout.type.charAt(0).toUpperCase() + displayWorkout.type.slice(1)}
            color="primary" 
          />
          <Chip 
            icon={<TimeIcon />} 
            label={formatTime(sessionDuration)}
          />
          <Chip 
            icon={<CaloriesIcon />} 
            label={`${calculateCaloriesBurned()} calories`}
            color="secondary"
          />
        </Box>
      </Box>

      {/* Workout Progress Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Workout Progress
          </Typography>
          <Box>
            <Button 
              color="error" 
              onClick={() => setOpenCancelDialog(true)}
              startIcon={<CancelIcon />}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="success"
              onClick={() => setOpenCompleteDialog(true)}
              startIcon={<CompleteIcon />}
            >
              Complete
            </Button>
          </Box>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={(Object.keys(completed).length / displayWorkout.exercises.length) * 100} 
          sx={{ height: 10, borderRadius: 5, mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {Object.keys(completed).length} of {displayWorkout.exercises.length} exercises completed
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round((Object.keys(completed).length / displayWorkout.exercises.length) * 100)}%
          </Typography>
        </Box>
      </Paper>

      {/* Active Exercise */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Exercise Stepper */}
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            <Stepper 
              activeStep={activeStep} 
              orientation="vertical"
              nonLinear
            >
              {displayWorkout.exercises.map((exercise, index) => (
                <Step key={index} completed={isExerciseCompleted(index)}>
                  <StepLabel
                    optional={
                      <Typography variant="caption">
                        {exercise.sets} sets × {exercise.reps ? `${exercise.reps} reps` : `${exercise.duration} sec`}
                      </Typography>
                    }
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: activeStep === index ? 'bold' : 'normal',
                      }}
                    >
                      {exercise.exerciseId.name}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" paragraph>
                        {exercise.exerciseId.instructions}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Target: {exercise.sets} sets × {exercise.reps ? `${exercise.reps} reps` : `${exercise.duration} sec`}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {exercise.exerciseId.muscleGroups && exercise.exerciseId.muscleGroups.map((muscle, idx) => (
                            <Chip 
                              key={idx} 
                              label={muscle.charAt(0).toUpperCase() + muscle.slice(1)} 
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                      
                      {/* Sets Progress */}
                      <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                          {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                            <Grid item xs={12} sm={6} md={4} key={setIndex}>
                              <Card 
                                variant="outlined"
                                sx={{ 
                                  bgcolor: sets[index]?.[setIndex]?.completed 
                                    ? alpha(theme.palette.success.main, 0.1)
                                    : 'background.paper'
                                }}
                              >
                                <CardContent sx={{ py: 1.5 }}>
                                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Set {setIndex + 1}</span>
                                    {sets[index]?.[setIndex]?.completed && (
                                      <CompleteIcon color="success" fontSize="small" />
                                    )}
                                  </Typography>
                                  
                                  <Grid container spacing={1}>
                                    {/* Only show weight input for strength exercises */}
                                    {displayWorkout.type === 'strength' && (
                                      <Grid item xs={6}>
                                        <TextField
                                          label="Weight"
                                          type="number"
                                          size="small"
                                          fullWidth
                                          InputProps={{ endAdornment: 'kg' }}
                                          value={sets[index]?.[setIndex]?.weight || ''}
                                          onChange={(e) => updateSetDetails(
                                            index, 
                                            setIndex, 
                                            'weight', 
                                            e.target.value
                                          )}
                                          disabled={sets[index]?.[setIndex]?.completed}
                                        />
                                      </Grid>
                                    )}
                                    
                                    <Grid item xs={displayWorkout.type === 'strength' ? 6 : 12}>
                                      <TextField
                                        label={exercise.reps ? 'Reps' : 'Seconds'}
                                        type="number"
                                        size="small"
                                        fullWidth
                                        value={sets[index]?.[setIndex]?.reps || (exercise.reps || exercise.duration)}
                                        onChange={(e) => updateSetDetails(
                                          index, 
                                          setIndex, 
                                          'reps', 
                                          e.target.value
                                        )}
                                        disabled={sets[index]?.[setIndex]?.completed}
                                      />
                                    </Grid>
                                  </Grid>
                                </CardContent>
                                <CardActions>
                                  <Button
                                    fullWidth
                                    variant={sets[index]?.[setIndex]?.completed ? "outlined" : "contained"}
                                    color={sets[index]?.[setIndex]?.completed ? "success" : "primary"}
                                    onClick={() => completeSet(index, setIndex)}
                                    disabled={sets[index]?.[setIndex]?.completed}
                                  >
                                    {sets[index]?.[setIndex]?.completed ? 'Completed' : 'Complete Set'}
                                  </Button>
                                </CardActions>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2, display: 'flex', gap: 2, mt: 3 }}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        startIcon={<BackIcon />}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        endIcon={activeStep === displayWorkout.exercises.length - 1 ? <CompleteIcon /> : <NextIcon />}
                        disabled={!isExerciseCompleted(index)}
                      >
                        {activeStep === displayWorkout.exercises.length - 1 ? 'Complete Workout' : 'Next Exercise'}
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Rest Timer */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Rest Timer
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              py: 3
            }}>
            <Box sx={{ 
              width: 160,
              height: 160,
              borderRadius: '50%',
              border: `8px solid ${
                timeRemaining > 0 
                  ? theme.palette.primary.main 
                  : theme.palette.success.main
              }`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h3" fontWeight="bold">
                {formatTime(timeRemaining)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button 
                variant="contained"
                color={isTimerRunning ? "error" : "primary"}
                onClick={toggleTimer}
                startIcon={isTimerRunning ? <PauseIcon /> : <PlayIcon />}
                disabled={timeRemaining <= 0}
              >
                {isTimerRunning ? 'Pause' : 'Start'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={resetTimer}
                startIcon={<RestartIcon />}
                disabled={isTimerRunning && timeRemaining > 0}
              >
                Reset
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" align="center">
              {timeRemaining > 0 
                ? 'Rest between sets to recover' 
                : 'Ready for the next set!'}
            </Typography>
          </Box>
          </Paper>
          
          {/* Session Stats */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Session Stats
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <TimerIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {formatTime(sessionDuration)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <FireIcon sx={{ fontSize: 40, color: theme.palette.error.main, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Calories
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {calculateCaloriesBurned()}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <WorkoutIcon sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Exercises
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {Object.keys(completed).length}/{displayWorkout.exercises.length}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <WorkoutIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Sets Done
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {Object.values(sets).reduce((total, exerciseSets) => 
                      total + exerciseSets.filter(set => set.completed).length, 0
                    )}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Complete Workout Dialog */}
      <Dialog 
        open={openCompleteDialog} 
        onClose={() => setOpenCompleteDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Complete Workout</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Great job completing your workout! How was your session?
          </DialogContentText>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                How would you rate this workout?
              </Typography>
              <Rating
                name="workout-rating"
                value={workoutRating}
                onChange={(event, newValue) => setWorkoutRating(newValue)}
                size="large"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                How difficult was it?
              </Typography>
              <Rating
                name="workout-difficulty"
                value={workoutDifficulty}
                onChange={(event, newValue) => setWorkoutDifficulty(newValue)}
                size="large"
                icon={<FireIcon fontSize="inherit" />}
                emptyIcon={<FireIcon fontSize="inherit" />}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Workout Notes"
                multiline
                rows={3}
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="How did you feel? Any achievements or challenges?"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ border: `1px solid ${theme.palette.divider}`, p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Session Summary
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Chip icon={<TimeIcon />} label={`Duration: ${formatTime(sessionDuration)}`} />
                  <Chip icon={<CaloriesIcon />} label={`Calories: ${calculateCaloriesBurned()}`} />
                  <Chip icon={<WorkoutIcon />} label={`Exercises: ${Object.keys(completed).length}/${displayWorkout.exercises.length}`} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCompleteDialog(false)}>
            Cancel
          </Button>
          <Button onClick={completeWorkout} variant="contained" color="primary">
            Complete & Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Workout Dialog */}
      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
        <DialogTitle>Cancel Workout?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to end this workout session? Your progress will not be saved.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>
            Continue Workout
          </Button>
          <Button onClick={cancelWorkout} color="error">
            End Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkoutSessionPage;