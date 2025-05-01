// src/pages/admin/ExercisesList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  ListItemIcon,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  FitnessCenter as ExerciseIcon,
  Refresh as RefreshIcon,
  ImageNotSupported as NoImageIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

// Mock exercise data
const mockExercises = [
  {
    id: 1,
    name: 'Push-up',
    description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps.',
    muscleGroups: ['chest', 'shoulders', 'arms'],
    difficulty: 'beginner',
    averageRating: 4.8,
    equipment: [],
    imageUrl: '',
  },
  {
    id: 2,
    name: 'Squat',
    description: 'A compound exercise that primarily targets the quadriceps, hamstrings, and glutes.',
    muscleGroups: ['legs'],
    difficulty: 'beginner',
    averageRating: 4.9,
    equipment: [],
    imageUrl: '',
  },
  {
    id: 3,
    name: 'Dumbbell Bench Press',
    description: 'A strength exercise that targets the chest, shoulders, and triceps using dumbbells.',
    muscleGroups: ['chest', 'shoulders', 'arms'],
    difficulty: 'intermediate',
    averageRating: 4.6,
    equipment: ['dumbbells', 'bench'],
    imageUrl: '',
  },
  {
    id: 4,
    name: 'Pull-up',
    description: 'A challenging upper body exercise that works the back, biceps, and shoulders.',
    muscleGroups: ['back', 'arms'],
    difficulty: 'intermediate',
    averageRating: 4.8,
    equipment: ['pull-up bar'],
    imageUrl: '',
  },
  {
    id: 5,
    name: 'Deadlift',
    description: 'A compound exercise that works the entire posterior chain, including back, glutes, and hamstrings.',
    muscleGroups: ['back', 'legs'],
    difficulty: 'intermediate',
    averageRating: 4.9,
    equipment: ['barbell', 'weight plates'],
    imageUrl: '',
  },
  {
    id: 6,
    name: 'Mountain Climber',
    description: 'A dynamic exercise that combines core strengthening with cardio benefits.',
    muscleGroups: ['core', 'cardio'],
    difficulty: 'beginner',
    averageRating: 4.5,
    equipment: [],
    imageUrl: '',
  },
  {
    id: 7,
    name: 'Russian Twist',
    description: 'A rotational exercise that targets the obliques and deep core muscles.',
    muscleGroups: ['core'],
    difficulty: 'beginner',
    averageRating: 4.4,
    equipment: ['dumbbell', 'medicine ball'],
    imageUrl: '',
  },
  {
    id: 8,
    name: 'Bulgarian Split Squat',
    description: 'A unilateral leg exercise that targets the quadriceps, hamstrings, and glutes.',
    muscleGroups: ['legs'],
    difficulty: 'intermediate',
    averageRating: 4.7,
    equipment: ['bench', 'dumbbells'],
    imageUrl: '',
  },
  {
    id: 9,
    name: 'Burpee',
    description: 'A full-body exercise that combines a squat, push-up, and jump for strength and cardio benefits.',
    muscleGroups: ['full body', 'cardio'],
    difficulty: 'intermediate',
    averageRating: 4.6,
    equipment: [],
    imageUrl: '',
  },
  {
    id: 10,
    name: 'Plank',
    description: 'A core strengthening isometric exercise that also engages the shoulders and back.',
    muscleGroups: ['core', 'shoulders'],
    difficulty: 'beginner',
    averageRating: 4.7,
    equipment: [],
    imageUrl: '',
  },
];

const ExercisesList = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState('all');
  
  // Menu states
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  
  // Detail view dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewExercise, setViewExercise] = useState(null);

  // Load exercises on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setExercises(mockExercises);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter exercises based on search term and filters
  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = searchTerm === '' ||
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = difficultyFilter === 'all' || exercise.difficulty === difficultyFilter;
    const matchesMuscleGroup = muscleGroupFilter === 'all' ||
      exercise.muscleGroups.includes(muscleGroupFilter);
    
    return matchesSearch && matchesDifficulty && matchesMuscleGroup;
  });

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle filter menu
  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  // Handle action menu
  const handleActionMenuOpen = (event, exerciseId) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedExerciseId(exerciseId);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedExerciseId(null);
  };

  // Handle difficulty filter change
  const handleDifficultyFilterChange = (difficulty) => {
    setDifficultyFilter(difficulty);
    handleFilterMenuClose();
    setPage(0);
  };

  // Handle muscle group filter change
  const handleMuscleGroupFilterChange = (muscleGroup) => {
    setMuscleGroupFilter(muscleGroup);
    handleFilterMenuClose();
    setPage(0);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setExercises(mockExercises);
      setRefreshing(false);
    }, 1000);
  };

  // Handle view exercise details
  const handleViewExercise = (exercise) => {
    setViewExercise(exercise);
    setViewDialogOpen(true);
    handleActionMenuClose();
  };

  // Handle delete exercise
  const handleDeleteExercise = (exerciseId) => {
    // In a real app, this would call your API to delete the exercise
    console.log(`Delete exercise with id: ${exerciseId}`);
    setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
    handleActionMenuClose();
  };

  // Render muscle groups as chips
  const renderMuscleGroups = (muscleGroups) => {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {muscleGroups.map((group) => (
          <Chip
            key={group}
            label={group}
            size="small"
            sx={{ 
              textTransform: 'capitalize',
              bgcolor: 
                group === 'chest' ? alpha(theme.palette.primary.main, 0.1) : 
                group === 'back' ? alpha(theme.palette.secondary.main, 0.1) :
                group === 'legs' ? alpha(theme.palette.error.main, 0.1) :
                group === 'arms' ? alpha(theme.palette.info.main, 0.1) :
                group === 'shoulders' ? alpha(theme.palette.warning.main, 0.1) :
                group === 'core' ? alpha(theme.palette.success.main, 0.1) :
                alpha(theme.palette.grey[500], 0.1)
            }}
          />
        ))}
      </Box>
    );
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
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Exercise Library
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
          >
            Add Exercise
          </Button>
          <Button 
            startIcon={<RefreshIcon />} 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            placeholder="Search exercises..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          
          <Box>
            <Button 
              startIcon={<FilterListIcon />} 
              onClick={handleFilterMenuOpen}
              variant={difficultyFilter !== 'all' || muscleGroupFilter !== 'all' ? 'contained' : 'outlined'}
              size="small"
            >
              Filters
              {difficultyFilter !== 'all' || muscleGroupFilter !== 'all' ? ' (Active)' : ''}
            </Button>
            
            <Menu
              anchorEl={filterMenuAnchor}
              open={Boolean(filterMenuAnchor)}
              onClose={handleFilterMenuClose}
            >
              <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
                Filter by Difficulty
              </Typography>
              <MenuItem 
                onClick={() => handleDifficultyFilterChange('all')}
                selected={difficultyFilter === 'all'}
              >
                All Levels
              </MenuItem>
              <MenuItem 
                onClick={() => handleDifficultyFilterChange('beginner')}
                selected={difficultyFilter === 'beginner'}
              >
                Beginner
              </MenuItem>
              <MenuItem 
                onClick={() => handleDifficultyFilterChange('intermediate')}
                selected={difficultyFilter === 'intermediate'}
              >
                Intermediate
              </MenuItem>
              <MenuItem 
                onClick={() => handleDifficultyFilterChange('advanced')}
                selected={difficultyFilter === 'advanced'}
              >
                Advanced
              </MenuItem>
              
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, mt: 1 }}>
                Filter by Muscle Group
              </Typography>
              <MenuItem 
                onClick={() => handleMuscleGroupFilterChange('all')}
                selected={muscleGroupFilter === 'all'}
              >
                All Muscle Groups
              </MenuItem>
              {['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'full body', 'cardio'].map((muscleGroup) => (
                <MenuItem 
                  key={muscleGroup}
                  onClick={() => handleMuscleGroupFilterChange(muscleGroup)}
                  selected={muscleGroupFilter === muscleGroup}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {muscleGroup}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Exercise</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Muscle Groups</TableCell>
                <TableCell>Equipment</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExercises
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((exercise) => (
                  <TableRow key={exercise.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {exercise.imageUrl ? (
                          <Avatar 
                            src={exercise.imageUrl} 
                            alt={exercise.name}
                            variant="rounded"
                            sx={{ 
                              width: 50, 
                              height: 50,
                              mr: 2
                            }}
                          />
                        ) : (
                          <Avatar
                            variant="rounded"
                            sx={{ 
                              width: 50, 
                              height: 50,
                              mr: 2,
                              bgcolor: alpha(theme.palette.primary.main, 0.1)
                            }}
                          >
                            <ExerciseIcon color="primary" />
                          </Avatar>
                        )}
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {exercise.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                            {exercise.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={exercise.difficulty}
                        size="small"
                        color={
                          exercise.difficulty === 'beginner' ? 'success' :
                          exercise.difficulty === 'intermediate' ? 'warning' :
                          'error'
                        }
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      {renderMuscleGroups(exercise.muscleGroups)}
                    </TableCell>
                    <TableCell>
                      {exercise.equipment.length > 0 ? (
                        <Typography variant="body2">
                          {exercise.equipment.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(', ')}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Bodyweight
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating 
                          value={exercise.averageRating} 
                          readOnly 
                          precision={0.1}
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({exercise.averageRating.toFixed(1)})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleActionMenuOpen(e, exercise.id)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              
              {filteredExercises.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No exercises found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredExercises.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Exercise Actions Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={() => {
          const exercise = exercises.find(e => e.id === selectedExerciseId);
          if (exercise) handleViewExercise(exercise);
        }}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Exercise
        </MenuItem>
        <MenuItem 
          onClick={() => handleDeleteExercise(selectedExerciseId)}
          sx={{ color: theme.palette.error.main }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Exercise
        </MenuItem>
      </Menu>

      {/* View Exercise Dialog */}
      {viewExercise && (
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {viewExercise.name}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {viewExercise.description}
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  Muscle Groups
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {renderMuscleGroups(viewExercise.muscleGroups)}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Difficulty
                    </Typography>
                    <Chip
                      label={viewExercise.difficulty}
                      color={
                        viewExercise.difficulty === 'beginner' ? 'success' :
                        viewExercise.difficulty === 'intermediate' ? 'warning' :
                        'error'
                      }
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Rating
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating 
                        value={viewExercise.averageRating} 
                        readOnly 
                        precision={0.1}
                      />
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        ({viewExercise.averageRating.toFixed(1)})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  Equipment Required
                </Typography>
                {viewExercise.equipment.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {viewExercise.equipment.map((item) => (
                      <Chip 
                        key={item} 
                        label={item.charAt(0).toUpperCase() + item.slice(1)} 
                        size="small" 
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1">
                    Bodyweight exercise - no equipment required
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ ml: 3, width: 180 }}>
                {viewExercise.imageUrl ? (
                  <img 
                    src={viewExercise.imageUrl} 
                    alt={viewExercise.name}
                    style={{ width: '100%', borderRadius: theme.shape.borderRadius }}
                  />
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 180,
                    width: '100%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 1
                  }}>
                    <NoImageIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      No image available
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button 
              variant="contained"
              onClick={() => {
                setViewDialogOpen(false);
                // In a real app, this would navigate to the edit page
                console.log(`Edit exercise with id: ${viewExercise.id}`);
              }}
            >
              Edit Exercise
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ExercisesList;