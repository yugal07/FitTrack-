// src/pages/WorkoutPage.jsx
import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  Chip,
  Divider,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Tabs,
  Tab,
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import { 
  FitnessCenter as WorkoutIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  ArrowForward as ArrowIcon,
  AccessTime as TimeIcon,
  Speed as DifficultyIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const WorkoutPage = () => {
  const theme = useTheme();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState({
    type: '',
    fitnessLevel: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Tabs control
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter controls
  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      fitnessLevel: '',
      search: '',
    });
  };

  // Fetch workouts based on tab and filters
  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let queryParams = new URLSearchParams();
        
        // Add tab-specific parameters
        if (tabValue === 0) {
          // All workouts
        } else if (tabValue === 1) {
          // My workouts
          queryParams.append('isCustom', 'true');
        } else if (tabValue === 2) {
          // Favorite workouts
          queryParams.append('favorites', 'true');
        }
        
        // Add filters
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.fitnessLevel) queryParams.append('fitnessLevel', filters.fitnessLevel);
        if (filters.search) queryParams.append('search', filters.search);
        
        // Fetch workouts
        const response = await axios.get(`/api/workouts?${queryParams.toString()}`);
        
        if (response.data.success) {
          setWorkouts(response.data.data);
        } else {
          throw new Error(response.data.error?.message || 'Failed to fetch workouts');
        }
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError('Failed to load workouts. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkouts();
  }, [tabValue, filters]);

  // For demo purposes - workout types and fitness levels
  const workoutTypes = [
    { value: '', label: 'All Types' },
    { value: 'strength', label: 'Strength' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'hiit', label: 'HIIT' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'custom', label: 'Custom' },
  ];
  
  const fitnessLevels = [
    { value: '', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];
  
  // Format duration
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
  };
  
  // Generate workout card color based on type
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
  
  // Generate chip label for workout type
  const getWorkoutTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Demo workouts for UI purpose (will be replaced by API data)
  const demoWorkouts = [
    {
      _id: '1',
      name: 'Full Body Strength',
      description: 'Complete full body workout targeting all major muscle groups',
      type: 'strength',
      fitnessLevel: 'intermediate',
      duration: 45,
      exercises: [{ exerciseName: 'Squat' }, { exerciseName: 'Push-up' }],
      averageRating: 4.7,
      isCustom: false
    },
    {
      _id: '2',
      name: 'HIIT Cardio Blast',
      description: 'High intensity interval training to boost cardiovascular fitness',
      type: 'hiit',
      fitnessLevel: 'advanced',
      duration: 30,
      exercises: [{ exerciseName: 'Burpee' }, { exerciseName: 'Mountain Climber' }],
      averageRating: 4.9,
      isCustom: false
    },
    {
      _id: '3',
      name: 'Beginner Flow',
      description: 'Gentle flexibility routine for beginners',
      type: 'flexibility',
      fitnessLevel: 'beginner',
      duration: 25,
      exercises: [{ exerciseName: 'Stretch' }],
      averageRating: 4.5,
      isCustom: true
    },
    {
      _id: '4',
      name: 'Upper Body Focus',
      description: 'Strengthen your chest, shoulders, and arms',
      type: 'strength',
      fitnessLevel: 'intermediate',
      duration: 40,
      exercises: [{ exerciseName: 'Push-up' }, { exerciseName: 'Pull-up' }],
      averageRating: 4.6,
      isCustom: false
    }
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Workouts
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/workouts/create"
        >
          Create Workout
        </Button>
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="All Workouts" />
          <Tab label="My Workouts" />
          <Tab label="Favorites" />
        </Tabs>
      </Paper>
      
      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Search workouts..."
            variant="outlined"
            fullWidth
            size="small"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            onClick={toggleFilters}
            startIcon={<FilterIcon />}
          >
            Filters
          </Button>
        </Box>
        
        {showFilters && (
          <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Workout Type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  {workoutTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Fitness Level"
                  name="fitnessLevel"
                  value={filters.fitnessLevel}
                  onChange={handleFilterChange}
                >
                  {fitnessLevels.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
      
      {/* Workouts Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : workouts.length > 0 ? (
        <Grid container spacing={3}>
          {(workouts.length > 0 ? workouts : demoWorkouts).map((workout) => (
            <Grid item xs={12} sm={6} md={4} key={workout._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 20px -10px ${alpha(getWorkoutColor(workout.type), 0.3)}`
                  }
                }}
              >
                <Box 
                  sx={{ 
                    height: 8, 
                    bgcolor: getWorkoutColor(workout.type) 
                  }} 
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {workout.name}
                    </Typography>
                    <IconButton size="small" aria-label="favorite">
                      <FavoriteBorderIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={getWorkoutTypeLabel(workout.type)} 
                      size="small" 
                      sx={{ 
                        bgcolor: alpha(getWorkoutColor(workout.type), 0.1),
                        color: getWorkoutColor(workout.type),
                        fontWeight: 500,
                        mr: 1
                      }} 
                    />
                    <Chip 
                      label={workout.fitnessLevel} 
                      size="small"
                      sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {workout.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDuration(workout.duration)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DifficultyIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {workout.fitnessLevel.charAt(0).toUpperCase() + workout.fitnessLevel.slice(1)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 'medium' }}>
                      {workout.averageRating || 4.5}
                    </Typography>
                    {workout.isCustom && (
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                        <PersonIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                          Your workout
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button 
                    component={RouterLink}
                    to={`/workouts/${workout._id}`}
                    endIcon={<ArrowIcon />}
                    fullWidth
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <WorkoutIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No workouts found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {tabValue === 0 ? 'Try adjusting your filters or create a new workout' : 
             tabValue === 1 ? 'You haven\'t created any workouts yet' : 
             'You haven\'t saved any workouts as favorites'}
          </Typography>
          {tabValue === 1 && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/workouts/create"
              sx={{ mt: 1 }}
            >
              Create Workout
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default WorkoutPage;