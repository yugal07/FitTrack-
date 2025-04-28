// src/pages/Progress.jsx
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Divider,
  useTheme
} from '@mui/material';
import { WorkoutPerformance } from '../components/progress';
import MeasurementsTracker from '../components/progress/MeasurementTracker';
import PhotoComparison from '../components/progress/PhotoComparision';

const Progress = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Progress Tracking
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Workout Performance" />
          <Tab label="Body Measurements" />
          <Tab label="Progress Photos" />
        </Tabs>
      </Paper>

      {/* Workout Performance Charts */}
      {tabValue === 0 && (
        <WorkoutPerformance />
      )}

      {/* Body Measurements Tracker */}
      {tabValue === 1 && (
        <MeasurementsTracker />
      )}

      {/* Progress Photo Comparison */}
      {tabValue === 2 && (
        <PhotoComparison />
      )}
    </Box>
  );
};

export default Progress;