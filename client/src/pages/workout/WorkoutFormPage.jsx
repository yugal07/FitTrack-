// src/pages/workout/WorkoutFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../../services/api';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Alert,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as BackIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  FitnessCenter as WorkoutIcon,
  Save as SaveIcon,
  ArrowUpward as MoveUpIcon,
  ArrowDownward as MoveDownIcon,
  Search as SearchIcon,
  Timer as TimeIcon,
  Info as InfoIcon,
  FitnessCenter as ExerciseIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const WorkoutFormPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [openExerciseDialog, setOpenExerciseDialog] = useState(false);
  const [openCreateExerciseDialog, setOpenCreateExerciseDialog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [exerciseLoading, setExerciseLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [dialogIndex, setDialogIndex] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    muscleGroups: [],
    difficulty: 'beginner',
    instructions: '',
    equipment: []
  });
  
  // Define form validation
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      type: 'strength',
      fitnessLevel: 'intermediate',
      duration: 30,
      tags: []
    }
  });
  
  // Get form values to use in calculations
  const formValues = watch();
  
  // Fetch workout data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchWorkout = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const response = await api.get(`/workouts/${id}`);
          
          if (response.data.success) {
            const workout = response.data.data;
            
            // Set form values
            setValue('name', workout.name);
            setValue('description', workout.description);
            setValue('type', workout.type);
            setValue('fitnessLevel', workout.fitnessLevel);
            setValue('duration', workout.duration);
            setValue('tags', workout.tags || []);
            
            // Set workout exercises
            setWorkoutExercises(workout.exercises.map(ex => ({
              exerciseId: ex.exerciseId._id,
              exercise: ex.exerciseId,
              sets: ex.sets,
              reps: ex.reps,
              duration: ex.duration,
              restTime: ex.restTime,
              order: ex.order
            })));
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
    }
  }, [id, isEditMode, setValue]);
  
  // Fetch exercises for the dialog
  useEffect(() => {
    const fetchExercises = async () => {
      if (openExerciseDialog) {
        setExerciseLoading(true);
        
        try {
          // Build query params
          const queryParams = new URLSearchParams();
          if (exerciseSearch) {
            queryParams.append('search', exerciseSearch);
          }
          
          const response = await api.get(`/exercises?${queryParams.toString()}`);
          
          if (response.data.success) {
            setExercises(response.data.data);
          } else {
            throw new Error(response.data.error?.message || 'Failed to fetch exercises');
          }
        } catch (err) {
          console.error('Error fetching exercises:', err);
        } finally {
          setExerciseLoading(false);
        }
      }
    };
    
    fetchExercises();
  }, [openExerciseDialog, exerciseSearch]);
  
  // Open exercise selection dialog
  const handleAddExercise = () => {
    setDialogMode('add');
    setDialogIndex(null);
    setSelectedExercise(null);
    setOpenExerciseDialog(true);
  };
  
  // Open exercise edit dialog
  const handleEditExercise = (index) => {
    setDialogMode('edit');
    setDialogIndex(index);
    setSelectedExercise(null);
    setOpenExerciseDialog(true);
  };
  
  // Add exercise to workout
  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
  };
  
  // Confirm adding the selected exercise
  const handleConfirmExercise = () => {
    if (dialogMode === 'add' && selectedExercise) {
      setWorkoutExercises([
        ...workoutExercises,
        {
          exerciseId: selectedExercise._id,
          exercise: selectedExercise,
          sets: 3,
          reps: selectedExercise.muscleGroups.includes('cardio') ? 0 : 10,
          duration: selectedExercise.muscleGroups.includes('cardio') ? 30 : 0,
          restTime: 60,
          order: workoutExercises.length + 1
        }
      ]);
    } else if (dialogMode === 'edit' && dialogIndex !== null && selectedExercise) {
      const newExercises = [...workoutExercises];
      newExercises[dialogIndex] = {
        ...newExercises[dialogIndex],
        exerciseId: selectedExercise._id,
        exercise: selectedExercise
      };
      setWorkoutExercises(newExercises);
    }
    
    setOpenExerciseDialog(false);
    setSelectedExercise(null);
  };
  
  // Update exercise details
  const updateExerciseDetail = (index, field, value) => {
    const newExercises = [...workoutExercises];
    newExercises[index] = {
      ...newExercises[index],
      [field]: value
    };
    setWorkoutExercises(newExercises);
  };
  
  // Remove exercise from workout
  const removeExercise = (index) => {
    const newExercises = workoutExercises.filter((_, i) => i !== index);
    // Update order for remaining exercises
    newExercises.forEach((ex, i) => {
      ex.order = i + 1;
    });
    setWorkoutExercises(newExercises);
  };
  
  // Move exercise up in the list
  const moveExerciseUp = (index) => {
    if (index === 0) return;
    
    const newExercises = [...workoutExercises];
    const temp = newExercises[index];
    newExercises[index] = newExercises[index - 1];
    newExercises[index - 1] = temp;
    
    // Update order
    newExercises.forEach((ex, i) => {
      ex.order = i + 1;
    });
    
    setWorkoutExercises(newExercises);
  };
  
  // Move exercise down in the list
  const moveExerciseDown = (index) => {
    if (index === workoutExercises.length - 1) return;
    
    const newExercises = [...workoutExercises];
    const temp = newExercises[index];
    newExercises[index] = newExercises[index + 1];
    newExercises[index + 1] = temp;
    
    // Update order
    newExercises.forEach((ex, i) => {
      ex.order = i + 1;
    });
    
    setWorkoutExercises(newExercises);
  };
  
  // Calculate estimated workout duration
  const calculateDuration = () => {
    let totalDuration = 0;
    
    workoutExercises.forEach(ex => {
      // Time per set (including rest)
      const setTime = (ex.reps ? ex.reps * 3 : ex.duration) + ex.restTime;
      
      // Multiply by number of sets
      totalDuration += setTime * ex.sets;
    });
    
    // Convert to minutes and round up
    return Math.ceil(totalDuration / 60);
  };
  
  // Update duration when exercises change
  useEffect(() => {
    if (workoutExercises.length > 0) {
      const calculatedDuration = calculateDuration();
      setValue('duration', calculatedDuration);
    }
  }, [workoutExercises, setValue]);
  
  // Form submission
  const onSubmit = async (data) => {
    if (workoutExercises.length === 0) {
      setSaveError('Please add at least one exercise to the workout');
      return;
    }
    
    setSaveLoading(true);
    setSaveError(null);
    
    try {
      // Prepare workout data
      const workoutData = {
        ...data,
        exercises: workoutExercises.map(ex => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          restTime: ex.restTime,
          order: ex.order
        }))
      };
      
      let response;
      
      if (isEditMode) {
        response = await api.put(`/workouts/${id}`, workoutData);
      } else {
        response = await api.post('/workouts', workoutData);
      }
      
      if (response.data.success) {
        // Redirect to workout details
        navigate(`/workouts/${response.data.data._id || id}`);
      } else {
        throw new Error(response.data.error?.message || 'Failed to save workout');
      }
    } catch (err) {
      console.error('Error saving workout:', err);
      setSaveError('Failed to save workout. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle create exercise dialog
  const openCreateExercise = () => {
    setOpenExerciseDialog(false);
    setOpenCreateExerciseDialog(true);
  };

  // Handle create exercise input change
  const handleNewExerciseChange = (e) => {
    const { name, value } = e.target;
    setNewExercise({
      ...newExercise,
      [name]: value
    });
  };

  // Handle muscle groups selection for new exercise
  const handleMuscleGroupsChange = (event) => {
    const { value } = event.target;
    setNewExercise({
      ...newExercise,
      muscleGroups: typeof value === 'string' ? value.split(',') : value,
    });
  };

  // Handle equipment selection for new exercise
  const handleEquipmentChange = (event) => {
    const { value } = event.target;
    setNewExercise({
      ...newExercise,
      equipment: typeof value === 'string' ? value.split(',') : value,
    });
  };

  // Submit new exercise
  const handleCreateExercise = async () => {
    setExerciseLoading(true);
    
    try {
      const response = await api.post('/exercises', newExercise);
      
      if (response.data.success) {
        // Add the newly created exercise to the list and select it
        const createdExercise = response.data.data;
        setExercises([...exercises, createdExercise]);
        setSelectedExercise(createdExercise);
        
        // Reset form and close dialog
        setNewExercise({
          name: '',
          description: '',
          muscleGroups: [],
          difficulty: 'beginner',
          instructions: '',
          equipment: []
        });
        setOpenCreateExerciseDialog(false);
        setOpenExerciseDialog(true);
      } else {
        throw new Error(response.data.error?.message || 'Failed to create exercise');
      }
    } catch (err) {
      console.error('Error creating exercise:', err);
      alert('Failed to create exercise. Please try again.');
    } finally {
      setExerciseLoading(false);
    }
  };
  
  // Demo exercises for the UI
  const demoExercises = [
    {
      _id: 'ex1',
      name: 'Barbell Squat',
      muscleGroups: ['legs'],
      difficulty: 'intermediate',
      description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes.'
    },
    {
      _id: 'ex2',
      name: 'Push-up',
      muscleGroups: ['chest', 'arms'],
      difficulty: 'beginner',
      description: 'A bodyweight exercise that works the chest, shoulders, and triceps.'
    },
    {
      _id: 'ex3',
      name: 'Pull-up',
      muscleGroups: ['back', 'arms'],
      difficulty: 'intermediate',
      description: 'A challenging upper body exercise that works the back, biceps, and shoulders.'
    },
    {
      _id: 'ex4',
      name: 'Plank',
      muscleGroups: ['core'],
      difficulty: 'beginner',
      description: 'An isometric core exercise that also engages the shoulders and back.'
    }
  ];
  
  // Workout types for form
  const workoutTypes = [
    { value: 'strength', label: 'Strength' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'hiit', label: 'HIIT' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'custom', label: 'Custom' },
  ];
  
  // Fitness levels for form
  const fitnessLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];
  
  // Suggested tags for the form
  const suggestedTags = [
    'upper body', 'lower body', 'full body', 'core', 'legs', 'arms', 'back', 'chest',
    'quick', 'intense', 'recovery', 'no equipment', 'dumbbell', 'barbell', 'bodyweight',
    'morning', 'evening', 'beginner friendly', 'advanced', 'fat burning'
  ];

  // Muscle groups options
  const muscleGroupOptions = [
    'chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'full body', 'cardio'
  ];

  // Equipment options
  const equipmentOptions = [
    'barbell', 'dumbbell', 'kettlebell', 'resistance bands', 'cable machine', 
    'bodyweight', 'medicine ball', 'bench', 'pull-up bar', 'stability ball'
  ];
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
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
          {isEditMode ? 'Edit Workout' : 'Create Workout'}
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Workout Details Section */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Workout Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: 'Workout name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Workout Name"
                        variant="outlined"
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: 'Workout type is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Workout Type"
                        variant="outlined"
                        fullWidth
                        error={!!errors.type}
                        helperText={errors.type?.message}
                      >
                        {workoutTypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="fitnessLevel"
                    control={control}
                    rules={{ required: 'Fitness level is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Fitness Level"
                        variant="outlined"
                        fullWidth
                        error={!!errors.fitnessLevel}
                        helperText={errors.fitnessLevel?.message}
                      >
                        {fitnessLevels.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="duration"
                    control={control}
                    rules={{ 
                      required: 'Duration is required',
                      min: { value: 1, message: 'Duration must be at least 1 minute' }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Duration (minutes)"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          endAdornment: <InputAdornment position="end">min</InputAdornment>,
                          readOnly: workoutExercises.length > 0
                        }}
                        error={!!errors.duration}
                        helperText={
                          errors.duration?.message || 
                          (workoutExercises.length > 0 ? 'Duration is calculated from exercises' : '')
                        }
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        multiple
                        freeSolo
                        options={suggestedTags}
                        value={value}
                        onChange={(_, newValue) => onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tags"
                            placeholder="Add tags"
                            helperText="Press Enter to add custom tags"
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip 
                              size="small" 
                              label={option} 
                              {...getTagProps({ index })} 
                            />
                          ))
                        }
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: 'Description is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>
            
            {/* Exercises Section */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Exercises
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddExercise}
                >
                  Add Exercise
                </Button>
              </Box>
              
              {workoutExercises.length === 0 ? (
                <Box 
                  sx={{ 
                    py: 4, 
                    textAlign: 'center', 
                    bgcolor: 'background.paper',
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: 1
                  }}
                >
                  <ExerciseIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                    No exercises added yet
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Add exercises to create your workout
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddExercise}
                  >
                    Add Exercise
                  </Button>
                </Box>
              ) : (
                <Box sx={{ mb: 3 }}>
                  {workoutExercises.map((exercise, index) => (
                    <Card 
                      key={index} 
                      variant="outlined"
                      sx={{ mb: 2 }}
                    >
                      <CardContent sx={{ pb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              variant="h6" 
                              component="div" 
                              sx={{ 
                                bgcolor: theme.palette.primary.main, 
                                color: 'white',
                                width: 30,
                                height: 30,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2
                              }}
                            >
                              {index + 1}
                            </Typography>
                            <Box>
                              <Typography variant="h6" component="div">
                                {exercise.exercise.name}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                {exercise.exercise.muscleGroups && exercise.exercise.muscleGroups.map((muscle, idx) => (
                                  <Chip 
                                    key={idx} 
                                    label={muscle.charAt(0).toUpperCase() + muscle.slice(1)} 
                                    size="small"
                                    sx={{ height: 24 }}
                                  />
                                ))}
                                <Chip 
                                  label={exercise.exercise.difficulty.charAt(0).toUpperCase() + exercise.exercise.difficulty.slice(1)} 
                                  size="small"
                                  sx={{ height: 24 }}
                                  color={
                                    exercise.exercise.difficulty === 'beginner' ? 'success' :
                                    exercise.exercise.difficulty === 'intermediate' ? 'primary' : 'error'
                                  }
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          </Box>
                          <Box>
                            <IconButton 
                              size="small"
                              onClick={() => moveExerciseUp(index)}
                              disabled={index === 0}
                            >
                              <MoveUpIcon />
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={() => moveExerciseDown(index)}
                              disabled={index === workoutExercises.length - 1}
                            >
                              <MoveDownIcon />
                            </IconButton>
                            <IconButton 
                              size="small"
                              color="error"
                              onClick={() => removeExercise(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                        
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={6} sm={3}>
                            <TextField
                              label="Sets"
                              type="number"
                              size="small"
                              fullWidth
                              InputProps={{ inputProps: { min: 1 } }}
                              value={exercise.sets}
                              onChange={(e) => updateExerciseDetail(index, 'sets', parseInt(e.target.value) || 1)}
                            />
                          </Grid>
                          
                          <Grid item xs={6} sm={3}>
                            <TextField
                              label={exercise.exercise.muscleGroups.includes('cardio') ? "Duration (sec)" : "Reps"}
                              type="number"
                              size="small"
                              fullWidth
                              InputProps={{ inputProps: { min: 1 } }}
                              value={exercise.exercise.muscleGroups.includes('cardio') ? exercise.duration : exercise.reps}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                if (exercise.exercise.muscleGroups.includes('cardio')) {
                                  updateExerciseDetail(index, 'duration', value);
                                } else {
                                  updateExerciseDetail(index, 'reps', value);
                                }
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={6} sm={3}>
                            <TextField
                              label="Rest (sec)"
                              type="number"
                              size="small"
                              fullWidth
                              InputProps={{ inputProps: { min: 0 } }}
                              value={exercise.restTime}
                              onChange={(e) => updateExerciseDetail(index, 'restTime', parseInt(e.target.value) || 0)}
                            />
                          </Grid>
                          
                          <Grid item xs={6} sm={3}>
                            <Button
                              variant="outlined"
                              fullWidth
                              onClick={() => handleEditExercise(index)}
                              sx={{ height: '100%' }}
                            >
                              Change
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
              
              {workoutExercises.length > 0 && (
                <Box sx={{ pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Calculated Duration: {formValues.duration} minutes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Based on the exercises, sets, reps, and rest periods.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Workout Summary Card */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Workout Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formValues.name || 'Not specified'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Type
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formValues.type ? formValues.type.charAt(0).toUpperCase() + formValues.type.slice(1) : 'Not specified'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Fitness Level
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formValues.fitnessLevel ? formValues.fitnessLevel.charAt(0).toUpperCase() + formValues.fitnessLevel.slice(1) : 'Not specified'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formValues.duration ? `${formValues.duration} minutes` : 'Not specified'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Exercise Count
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {workoutExercises.length} exercises
                </Typography>
              </Box>
              
              {formValues.tags && formValues.tags.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {formValues.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
            
            {/* Submit Card */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Save Workout
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {saveError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {saveError}
                </Alert>
              )}
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" paragraph>
                  {isEditMode 
                    ? 'Update your workout with the changes you\'ve made.' 
                    : 'Save your workout to access it later and start tracking your progress.'}
                </Typography>
                
                <Typography variant="caption" color="text.secondary" display="block">
                  * Required fields must be filled in
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  * At least one exercise must be added
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={saveLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={saveLoading || workoutExercises.length === 0}
                  fullWidth
                >
                  {saveLoading ? <CircularProgress size={24} /> : isEditMode ? 'Update Workout' : 'Save Workout'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </form>
      
      {/* Exercise Selection Dialog */}
      <Dialog 
        open={openExerciseDialog} 
        onClose={() => setOpenExerciseDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {dialogMode === 'add' ? 'Add Exercise' : 'Change Exercise'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <TextField
              fullWidth
              placeholder="Search exercises..."
              value={exerciseSearch}
              onChange={(e) => setExerciseSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          {/* Muscle Group Filters */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {['all', 'chest', 'back', 'legs', 'arms', 'core', 'cardio'].map((muscle) => (
              <Chip 
                key={muscle}
                label={muscle === 'all' ? 'All' : muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                onClick={() => {/* Add filter functionality */}}
                color={muscle === 'all' ? 'primary' : 'default'}
                variant={muscle === 'all' ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
          
          {exerciseLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button 
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openCreateExercise}
                >
                  Create New Exercise
                </Button>
              </Box>
            
              <Grid container spacing={2}>
                {(exercises.length > 0 ? exercises : demoExercises).map((exercise) => (
                  <Grid item xs={12} sm={6} md={4} key={exercise._id}>
                    <Card 
                      variant="outlined"
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: selectedExercise?._id === exercise._id ? `2px solid ${theme.palette.primary.main}` : undefined,
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          boxShadow: '0 0 0 1px rgba(0,0,0,0.05)'
                        }
                      }}
                      onClick={() => handleSelectExercise(exercise)}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" component="div" fontWeight="medium">
                          {exercise.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1, mb: 1 }}>
                          {exercise.muscleGroups && exercise.muscleGroups.map((muscle, idx) => (
                            <Chip 
                              key={idx} 
                              label={muscle.charAt(0).toUpperCase() + muscle.slice(1)} 
                              size="small"
                              sx={{ height: 24 }}
                            />
                          ))}
                          <Chip 
                            label={exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)} 
                            size="small"
                            sx={{ height: 24 }}
                            color={
                              exercise.difficulty === 'beginner' ? 'success' :
                              exercise.difficulty === 'intermediate' ? 'primary' : 'error'
                            }
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {exercise.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExerciseDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmExercise}
            variant="contained"
            disabled={!selectedExercise}
          >
            {dialogMode === 'add' ? 'Add to Workout' : 'Change Exercise'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Exercise Dialog */}
      <Dialog 
        open={openCreateExerciseDialog} 
        onClose={() => setOpenCreateExerciseDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Create New Exercise
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Exercise Name"
                name="name"
                value={newExercise.name}
                onChange={handleNewExerciseChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Muscle Groups</InputLabel>
                <Select
                  multiple
                  name="muscleGroups"
                  value={newExercise.muscleGroups}
                  onChange={handleMuscleGroupsChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {muscleGroupOptions.map((muscle) => (
                    <MenuItem key={muscle} value={muscle}>
                      {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Difficulty"
                name="difficulty"
                value={newExercise.difficulty}
                onChange={handleNewExerciseChange}
                required
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newExercise.description}
                onChange={handleNewExerciseChange}
                multiline
                rows={2}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instructions"
                name="instructions"
                value={newExercise.instructions}
                onChange={handleNewExerciseChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Equipment</InputLabel>
                <Select
                  multiple
                  name="equipment"
                  value={newExercise.equipment}
                  onChange={handleEquipmentChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {equipmentOptions.map((equipment) => (
                    <MenuItem key={equipment} value={equipment}>
                      {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateExerciseDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateExercise}
            variant="contained"
            disabled={!newExercise.name || !newExercise.muscleGroups.length || !newExercise.description || !newExercise.instructions}
          >
            {exerciseLoading ? <CircularProgress size={24} /> : 'Create Exercise'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkoutFormPage;