// src/pages/workout/WorkoutHistoryPage.jsx
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  TextField, 
  MenuItem, 
  IconButton, 
  Chip, 
  Divider, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination, 
  CircularProgress, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  DialogContentText,
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import {
  FitnessCenter as WorkoutIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  Speed as DifficultyIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  ViewAgenda as ViewDetailsIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

// Demo data (will be replaced with API data)
const demoWorkoutSessions = [
  {
    _id: '1',
    date: '2025-04-29T10:30:00.000Z',
    duration: 45,
    workoutId: {
      _id: '1',
      name: 'Full Body Strength',
      type: 'strength'
    },
    caloriesBurned: 350,
    rating: 4,
    difficulty: 3,
    mood: 'energized',
    notes: 'Great workout, increased weights on squats',
    completedExercises: [
      {
        exerciseId: {
          _id: 'ex1',
          name: 'Barbell Squat',
          muscleGroups: ['legs']
        },
        sets: [
          { weight: 135, reps: 10, completed: true },
          { weight: 155, reps: 8, completed: true },
          { weight: 175, reps: 6, completed: true }
        ]
      },
      {
        exerciseId: {
          _id: 'ex2',
          name: 'Push-up',
          muscleGroups: ['chest', 'arms']
        },
        sets: [
          { reps: 15, completed: true },
          { reps: 12, completed: true },
          { reps: 10, completed: true }
        ]
      }
    ]
  },
  {
    _id: '2',
    date: '2025-04-26T17:00:00.000Z',
    duration: 30,
    workoutId: {
      _id: '2',
      name: 'HIIT Cardio',
      type: 'hiit'
    },
    caloriesBurned: 280,
    rating: 5,
    difficulty: 4,
    mood: 'tired',
    notes: 'Tough workout but felt great after',
    completedExercises: [
      {
        exerciseId: {
          _id: 'ex3',
          name: 'Burpees',
          muscleGroups: ['full body']
        },
        sets: [
          { duration: 60, completed: true },
          { duration: 45, completed: true },
          { duration: 30, completed: true }
        ]
      }
    ]
  },
  {
    _id: '3',
    date: '2025-04-24T08:15:00.000Z',
    duration: 40,
    workoutId: {
      _id: '3',
      name: 'Upper Body Focus',
      type: 'strength'
    },
    caloriesBurned: 320,
    rating: 4,
    difficulty: 3,
    mood: 'strong',
    notes: 'New PR on bench press',
    completedExercises: [
      {
        exerciseId: {
          _id: 'ex4',
          name: 'Bench Press',
          muscleGroups: ['chest']
        },
        sets: [
          { weight: 165, reps: 8, completed: true },
          { weight: 185, reps: 6, completed: true },
          { weight: 195, reps: 4, completed: true }
        ]
      }
    ]
  },
  {
    _id: '4',
    date: '2025-04-21T16:00:00.000Z',
    duration: 25,
    workoutId: {
      _id: '4',
      name: 'Yoga Flow',
      type: 'flexibility'
    },
    caloriesBurned: 180,
    rating: 3,
    difficulty: 2,
    mood: 'relaxed',
    notes: 'Recovery session',
    completedExercises: []
  },
  {
    _id: '5',
    date: '2025-04-19T11:45:00.000Z',
    duration: 50,
    workoutId: {
      _id: '1',
      name: 'Full Body Strength',
      type: 'strength'
    },
    caloriesBurned: 380,
    rating: 5,
    difficulty: 4,
    mood: 'proud',
    notes: 'Completed all sets with increased weight',
    completedExercises: []
  }
];

// Demo data for statistics
const demoStats = {
  totalWorkouts: 24,
  totalDuration: 1120,
  avgDuration: 46.7,
  totalCalories: 8750,
  avgDifficulty: 3.4,
  avgRating: 4.2,
  workoutsByType: [
    { _id: 'strength', count: 12 },
    { _id: 'cardio', count: 5 },
    { _id: 'hiit', count: 4 },
    { _id: 'flexibility', count: 3 }
  ],
  workoutFrequencyByDay: [
    { day: 'Monday', count: 5 },
    { day: 'Tuesday', count: 3 },
    { day: 'Wednesday', count: 4 },
    { day: 'Thursday', count: 2 },
    { day: 'Friday', count: 4 },
    { day: 'Saturday', count: 4 },
    { day: 'Sunday', count: 2 }
  ]
};

const WorkoutHistoryPage = () => {
  const theme = useTheme();
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    workoutType: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    // Fetch workout sessions history
    const fetchWorkoutSessions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, make an API call with filters
        // const queryParams = new URLSearchParams();
        // if (filters.startDate) queryParams.append('startDate', filters.startDate);
        // if (filters.endDate) queryParams.append('endDate', filters.endDate);
        // if (filters.workoutType) queryParams.append('type', filters.workoutType);
        // if (filters.search) queryParams.append('search', filters.search);
        
        // const response = await axios.get(`/api/workout-sessions?${queryParams.toString()}`);
        // setWorkoutSessions(response.data.data);
        
        // For demo, use the demo data with a delay
        setTimeout(() => {
          setWorkoutSessions(demoWorkoutSessions);
          setStats(demoStats);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching workout history:', err);
        setError('Failed to load workout history. Please try again.');
        setLoading(false);
      }
    };
    
    fetchWorkoutSessions();
  }, [filters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      workoutType: '',
      search: ''
    });
  };

  const handleDeleteClick = (session) => {
    setSessionToDelete(session);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // In a real app, make API call to delete
      // await axios.delete(`/api/workout-sessions/${sessionToDelete._id}`);
      
      // Update local state to remove deleted session
      setWorkoutSessions(prevSessions => 
        prevSessions.filter(session => session._id !== sessionToDelete._id)
      );
      
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    } catch (err) {
      console.error('Error deleting workout session:', err);
      setError('Failed to delete workout session. Please try again.');
    }
  };

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setDetailsDialogOpen(true);
  };

  // Get mood emoji based on mood value
  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'energized':
        return '😃';
      case 'tired':
        return '😓';
      case 'strong':
        return '💪';
      case 'weak':
        return '😔';
      case 'proud':
        return '😊';
      case 'disappointed':
        return '😞';
      case 'relaxed':
        return '😌';
      default:
        return '😐';
    }
  };

  // Get color based on workout type
  const getWorkoutColor = (type) => {
    switch (type) {
      case 'strength':
        return theme.palette.primary.main;
      case 'cardio':
        return theme.palette.secondary.main;
      case 'hiit':
        return theme.palette.error.main;
      case 'flexibility':
        return theme.palette.info.main;
      case 'hybrid':
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Workout History
        </Typography>
        <Button 
          component={RouterLink} 
          to="/workouts"
          startIcon={<BackIcon />}
          variant="outlined"
        >
          Back to Workouts
        </Button>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
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
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  size="small"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  size="small"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  label="Workout Type"
                  fullWidth
                  size="small"
                  name="workoutType"
                  value={filters.workoutType}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="strength">Strength</MenuItem>
                  <MenuItem value="cardio">Cardio</MenuItem>
                  <MenuItem value="hiit">HIIT</MenuItem>
                  <MenuItem value="flexibility">Flexibility</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
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
      
      {/* Workout Statistics */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Workout Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <WorkoutIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Total Workouts
                    </Typography>
                    <Typography variant="h5" fontWeight="medium">
                      {stats.totalWorkouts}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <TimeIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Total Duration
                    </Typography>
                    <Typography variant="h5" fontWeight="medium">
                      {stats.totalDuration} min
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <FireIcon sx={{ fontSize: 40, color: theme.palette.error.main, mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Calories Burned
                    </Typography>
                    <Typography variant="h5" fontWeight="medium">
                      {stats.totalCalories}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <StarIcon sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Average Rating
                    </Typography>
                    <Typography variant="h5" fontWeight="medium">
                      {stats.avgRating.toFixed(1)}/5
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Workout Type Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {stats.workoutsByType.map((type) => (
                  <Box key={type._id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {type._id}
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {type.count} workouts
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, height: 10, overflow: 'hidden' }}>
                      <Box
                        sx={{
                          width: `${(type.count / stats.totalWorkouts) * 100}%`,
                          height: '100%',
                          bgcolor: getWorkoutColor(type._id),
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Workout Frequency by Day
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  {stats.workoutFrequencyByDay.map((day) => (
                    <Box key={day.day} sx={{ textAlign: 'center', width: '14%' }}>
                      <Box 
                        sx={{ 
                          height: `${(day.count / Math.max(...stats.workoutFrequencyByDay.map(d => d.count))) * 100}px`,
                          maxHeight: '100px',
                          width: '100%',
                          bgcolor: alpha(theme.palette.primary.main, 0.7),
                          borderRadius: '4px 4px 0 0',
                          minHeight: '10px',
                          mx: 'auto'
                        }}
                      />
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                        {day.day.substring(0, 3)}
                      </Typography>
                      <Typography variant="caption" fontWeight="bold">
                        {day.count}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Workout Sessions Table */}
      <Paper sx={{ width: '100%', mb: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Workout</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Calories</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Mood</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workoutSessions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((session) => (
                  <TableRow 
                    key={session._id}
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer'
                    }}
                    onClick={() => handleViewDetails(session)}
                  >
                    <TableCell>
                      {format(new Date(session.date), 'MMM d, yyyy - h:mm a')}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                          size="small"
                          label={session.workoutId.type.toUpperCase()}
                          sx={{ 
                            mr: 1, 
                            bgcolor: alpha(getWorkoutColor(session.workoutId.type), 0.1),
                            color: getWorkoutColor(session.workoutId.type),
                            fontWeight: 'bold'
                          }}
                        />
                        {session.workoutId.name}
                      </Box>
                    </TableCell>
                    <TableCell>{session.duration} min</TableCell>
                    <TableCell>{session.caloriesBurned} cal</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 16, mr: 0.5 }} />
                        {session.rating}/5
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DifficultyIcon sx={{ color: theme.palette.error.main, fontSize: 16, mr: 0.5 }} />
                        {session.difficulty}/5
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ mr: 0.5 }}>
                              {getMoodIcon(session.mood)}
                            </Typography>
                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                              {session.mood}
                            </Typography>
                          </Box>
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(session);
                        }}
                      >
                        <ViewDetailsIcon />
                      </IconButton>
                      <IconButton 
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(session);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {workoutSessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Box sx={{ py: 3 }}>
                      <WorkoutIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                        No workout sessions found
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Start a workout to begin tracking your fitness journey
                      </Typography>
                      <Button 
                        variant="contained" 
                        component={RouterLink}
                        to="/workouts"
                      >
                        Browse Workouts
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={workoutSessions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Workout Session</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this workout session? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Workout Session Details Dialog */}
      {selectedSession && (
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Workout Session Details
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  pb: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="h5">
                    {selectedSession.workoutId.name}
                  </Typography>
                  <Chip
                    label={selectedSession.workoutId.type.toUpperCase()}
                    sx={{ 
                      bgcolor: alpha(getWorkoutColor(selectedSession.workoutId.type), 0.1),
                      color: getWorkoutColor(selectedSession.workoutId.type),
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {format(new Date(selectedSession.date), 'EEEE, MMMM d, yyyy - h:mm a')}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedSession.duration} minutes
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">
                  Calories Burned
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedSession.caloriesBurned} calories
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon 
                      key={i}
                      sx={{ 
                        color: i < selectedSession.rating 
                          ? theme.palette.warning.main 
                          : theme.palette.grey[300],
                        fontSize: 24
                      }}
                    />
                  ))}
                </Box>
                
                <Typography variant="subtitle2" color="text.secondary">
                  Difficulty
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <DifficultyIcon 
                      key={i}
                      sx={{ 
                        color: i < selectedSession.difficulty 
                          ? theme.palette.error.main 
                          : theme.palette.grey[300],
                        fontSize: 24
                      }}
                    />
                  ))}
                </Box>
                
                <Typography variant="subtitle2" color="text.secondary">
                  Mood
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ fontSize: 24, mr: 1 }}>
                    {getMoodIcon(selectedSession.mood)}
                  </Box>
                  <span style={{ textTransform: 'capitalize' }}>{selectedSession.mood}</span>
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Notes
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                  <Typography variant="body1">
                    {selectedSession.notes || 'No notes recorded for this session.'}
                  </Typography>
                </Paper>
              </Grid>
              
              {/* Completed Exercises */}
              {selectedSession.completedExercises && selectedSession.completedExercises.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Completed Exercises
                  </Typography>
                  
                  {selectedSession.completedExercises.map((exercise, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2, mt: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {exercise.exerciseId.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {exercise.exerciseId.muscleGroups && exercise.exerciseId.muscleGroups.map((muscle, idx) => (
                          <Chip 
                            key={idx} 
                            label={muscle.charAt(0).toUpperCase() + muscle.slice(1)} 
                            size="small"
                          />
                        ))}
                      </Box>
                      
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Set</TableCell>
                              {exercise.sets[0].weight !== undefined && <TableCell>Weight</TableCell>}
                              {exercise.sets[0].reps !== undefined && <TableCell>Reps</TableCell>}
                              {exercise.sets[0].duration !== undefined && <TableCell>Duration</TableCell>}
                              <TableCell>Completed</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {exercise.sets.map((set, setIndex) => (
                              <TableRow key={setIndex}>
                                <TableCell>{setIndex + 1}</TableCell>
                                {set.weight !== undefined && <TableCell>{set.weight} lbs</TableCell>}
                                {set.reps !== undefined && <TableCell>{set.reps}</TableCell>}
                                {set.duration !== undefined && <TableCell>{set.duration} sec</TableCell>}
                                <TableCell>
                                  {set.completed ? (
                                    <Chip 
                                      label="Completed" 
                                      size="small" 
                                      color="success" 
                                      variant="outlined" 
                                    />
                                  ) : (
                                    <Chip 
                                      label="Not Completed" 
                                      size="small" 
                                      color="error" 
                                      variant="outlined" 
                                    />
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  ))}
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
            <Button 
              component={RouterLink}
              to={`/workouts/${selectedSession.workoutId._id}`}
              variant="contained"
            >
              View Workout
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default WorkoutHistoryPage;