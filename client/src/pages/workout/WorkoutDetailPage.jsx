// src/pages/WorkoutDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  IconButton,
  Rating,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  alpha
} from '@mui/material';
import {
  FitnessCenter as WorkoutIcon,
  Timer as TimerIcon,
  FavoriteBorder as FavoriteIcon,
  Favorite as FavoriteFilledIcon,
  AccessTime as TimeIcon,
  DirectionsRun as StartIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  ArrowBack as BackIcon,
  Speed as DifficultyIcon
} from '@mui/icons-material';
import axios from 'axios';

const WorkoutDetailPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [openRatingDialog, setOpenRatingDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Fetch workout data
  useEffect(() => {
    const fetchWorkout = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/workouts/${id}`);
        
        if (response.data.success) {
          setWorkout(response.data.data);
          // Check if user has already rated this workout
          if (response.data.data.ratings && response.data.data.ratings.length > 0) {
            // Assuming API includes user's own rating if it exists
            const userRating = response.data.data.ratings.find(
              rating => rating.userId === 'currentUserId' // Replace with actual user ID check
            );
            if (userRating) {
              setUserRating(userRating.rating);
            }
          }
          // In a real app, check if this workout is in user's favorites
          setIsFavorite(false);
        } else {
          throw new Error(response.data.error?.message || 'Failed to fetch workout details');
        }
      } catch (err) {
        console.error('Error fetching workout details:', err);
        setError('Failed to load workout details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkout();
  }, [id]);

  // Toggle favorite status
  const handleToggleFavorite = async () => {
    try {
      // In a real app, make API call to toggle favorite status
      setIsFavorite(!isFavorite);
      // const response = await axios.post(`/api/workouts/${id}/favorite`);
    } catch (err) {
      console.error('Error toggling favorite status:', err);
      // Revert state if API call fails
      setIsFavorite(!isFavorite);
    }
  };

  // Handle rating
  const handleRatingChange = async (event, newValue) => {
    setUserRating(newValue);
    setOpenRatingDialog(true);
  };

  const handleRatingSubmit = async () => {
    try {
      // In a real app, make API call to submit rating
      // const response = await axios.post(`/api/workouts/${id}/ratings`, {
      //   rating: userRating,
      // });
      setOpenRatingDialog(false);
    } catch (err) {
      console.error('Error submitting rating:', err);
      // Handle error
    }
  };

  // Handle delete
  const handleDeleteWorkout = async () => {
    try {
      // In a real app, make API call to delete workout
      // const response = await axios.delete(`/api/workouts/${id}`);
      setOpenDeleteDialog(false);
      navigate('/workouts');
    } catch (err) {
      console.error('Error deleting workout:', err);
      // Handle error
    }
  };

  // Format duration
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
  };

  // Generate workout color based on type
  const getWorkoutColor = (type) => {
    switch (type) {
      case 'strength': return theme.palette.primary.main;
      case 'cardio': return theme.palette.secondary.main;
      case 'hiit': return theme.palette.error.main;
      case 'flexibility': return theme.palette.info.main;
      case 'hybrid': return theme.palette.warning.main;
      case 'custom': return theme.palette.success.main;
      default: return theme.palette.primary.main;
    }
  };

  // Demo workout data for UI preview (will be replaced by API data)
  const demoWorkout = {
    _id: '1',
    name: 'Full Body Strength',
    description: 'A comprehensive full body workout targeting all major muscle groups. Perfect for building overall strength and muscle endurance. This workout combines compound movements with isolation exercises for a balanced approach.',
    type: 'strength',
    fitnessLevel: 'intermediate',
    duration: 45,
    createdBy: {
      _id: 'user123',
      firstName: 'John',
      lastName: 'Doe'
    },
    exercises: [
      {
        exerciseId: {
          _id: 'ex1',
          name: 'Barbell Squat',
          muscleGroups: ['legs'],
          difficulty: 'intermediate'
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
          difficulty: 'beginner'
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
          difficulty: 'beginner'
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
          difficulty: 'beginner'
        },
        sets: 3,
        duration: 45,
        restTime: 45,
        order: 4
      }
    ],
    averageRating: 4.7,
    isCustom: false,
    tags: ['full body', 'strength', 'intermediate']
  };

  // Use demo workout if no workout loaded yet
  const displayWorkout = workout || demoWorkout;
  const workoutColor = getWorkoutColor(displayWorkout.type);

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
      {/* Header Section with Back Button */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<BackIcon />}
          variant="outlined"
          component={RouterLink}
          to="/workouts"
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Workout Details
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Workout Info Card */}
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 0, 
              overflow: 'hidden',
              borderTop: `6px solid ${workoutColor}`
            }}
          >
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {displayWorkout.name}
                </Typography>
                <IconButton 
                  onClick={handleToggleFavorite}
                  color={isFavorite ? 'error' : 'default'}
                >
                  {isFavorite ? <FavoriteFilledIcon /> : <FavoriteIcon />}
                </IconButton>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={displayWorkout.type.charAt(0).toUpperCase() + displayWorkout.type.slice(1)} 
                  sx={{ 
                    bgcolor: alpha(workoutColor, 0.1),
                    color: workoutColor,
                    fontWeight: 500,
                    mr: 1 
                  }} 
                />
                <Chip 
                  label={displayWorkout.fitnessLevel.charAt(0).toUpperCase() + displayWorkout.fitnessLevel.slice(1)} 
                  sx={{ mr: 1 }}
                />
                <Chip 
                  icon={<TimeIcon fontSize="small" />} 
                  label={formatDuration(displayWorkout.duration)} 
                />
              </Box>

              <Typography variant="body1" paragraph>
                {displayWorkout.description}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  Created by:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {displayWorkout.createdBy ? 
                      `${displayWorkout.createdBy.firstName} ${displayWorkout.createdBy.lastName}` : 
                      'FitTrack Team'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                  <StarIcon sx={{ color: theme.palette.warning.main, mr: 0.5 }} />
                  <Typography variant="body2" fontWeight="medium">
                    {displayWorkout.averageRating} Rating
                  </Typography>
                </Box>
                <Rating 
                  name="workout-rating"
                  value={userRating}
                  onChange={handleRatingChange}
                  size="small"
                />
                <Typography variant="body2" sx={{ ml: 1, color: theme.palette.text.secondary }}>
                  Rate this workout
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {displayWorkout.tags && displayWorkout.tags.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    size="small" 
                    variant="outlined"
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<StartIcon />}
                  component={RouterLink}
                  to={`/workouts/${displayWorkout._id}/start`}
                  sx={{ px: 4 }}
                >
                  Start Workout
                </Button>
                {displayWorkout.isCustom && (
                  <>
                    <Button 
                      variant="outlined" 
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setOpenDeleteDialog(true)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Side Stats Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Workout Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <WorkoutIcon sx={{ fontSize: 40, color: workoutColor, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Exercises
                  </Typography>
                  <Typography variant="h5" fontWeight="medium">
                    {displayWorkout.exercises.length}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <TimerIcon sx={{ fontSize: 40, color: workoutColor, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="h5" fontWeight="medium">
                    {formatDuration(displayWorkout.duration)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <DifficultyIcon sx={{ fontSize: 40, color: workoutColor, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Level
                  </Typography>
                  <Typography variant="h5" fontWeight="medium">
                    {displayWorkout.fitnessLevel.charAt(0).toUpperCase() + displayWorkout.fitnessLevel.slice(1)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <StarIcon sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Rating
                  </Typography>
                  <Typography variant="h5" fontWeight="medium">
                    {displayWorkout.averageRating}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Target Muscle Groups:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {/* Extract unique muscle groups from all exercises */}
                {[...new Set(displayWorkout.exercises.flatMap(ex => 
                  ex.exerciseId.muscleGroups || []
                ))].map((muscle, index) => (
                  <Chip 
                    key={index} 
                    label={muscle.charAt(0).toUpperCase() + muscle.slice(1)} 
                    size="small" 
                    sx={{ 
                      bgcolor: alpha(workoutColor, 0.1),
                      color: workoutColor
                    }}
                  />
                ))}
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Estimated Calories:
              </Typography>
              <Typography variant="body1">
                {/* Calculate based on duration and intensity */}
                {displayWorkout.fitnessLevel === 'beginner' 
                  ? Math.round(displayWorkout.duration * 6)
                  : displayWorkout.fitnessLevel === 'intermediate'
                    ? Math.round(displayWorkout.duration * 8)
                    : Math.round(displayWorkout.duration * 10)
                } calories
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Exercises List */}
        <Grid item xs={12}>
          <Paper sx={{ overflow: 'hidden' }}>
            <Box sx={{ p: 3, pb: 2 }}>
              <Typography variant="h6">
                Exercise List
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete all exercises in the order shown below
              </Typography>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="5%">#</TableCell>
                    <TableCell>Exercise</TableCell>
                    <TableCell>Muscle Groups</TableCell>
                    <TableCell>Sets</TableCell>
                    <TableCell>Reps/Duration</TableCell>
                    <TableCell>Rest</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayWorkout.exercises.map((exercise, index) => (
                    <TableRow key={index}>
                      <TableCell>{exercise.order || index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {exercise.exerciseId.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {exercise.exerciseId.difficulty}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {exercise.exerciseId.muscleGroups && exercise.exerciseId.muscleGroups.map((muscle, idx) => (
                            <Chip 
                              key={idx} 
                              label={muscle} 
                              size="small" 
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>{exercise.sets}</TableCell>
                      <TableCell>
                        {exercise.reps ? `${exercise.reps} reps` : 
                        exercise.duration ? `${exercise.duration} sec` : '-'}
                      </TableCell>
                      <TableCell>{exercise.restTime} sec</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Rating Dialog */}
      <Dialog open={openRatingDialog} onClose={() => setOpenRatingDialog(false)}>
        <DialogTitle>Rate this workout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            How would you rate {displayWorkout.name}?
          </DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Rating
              name="rating-dialog"
              value={userRating}
              onChange={(event, newValue) => setUserRating(newValue)}
              size="large"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRatingDialog(false)}>Cancel</Button>
          <Button onClick={handleRatingSubmit} variant="contained">Submit Rating</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Workout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{displayWorkout.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteWorkout} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkoutDetailPage;