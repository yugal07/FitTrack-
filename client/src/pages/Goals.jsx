// src/pages/Goals.jsx
import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon,
} from '@mui/icons-material';

// Import goal components
import GoalTracker from '../components/goal/GoalTracker';
import GoalWizard from '../components/goal/GoalWizard';
import GoalDetail from '../components/goal/GoalDetail';

// Main Goals page
const Goals = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  
  // Handle creating a new goal
  const handleCreateGoal = () => {
    navigate('/goals/create');
  };
  
  // Handle view mode change
  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue);
  };
  
  return (
    <Box>
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                  Your Goals
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleCreateGoal}
                >
                  Create Goal
                </Button>
              </Box>
              
              <Paper sx={{ mb: 3 }}>
                <Tabs 
                  value={viewMode} 
                  onChange={handleViewModeChange}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab 
                    value="grid" 
                    label="Grid View" 
                    icon={<GridViewIcon />} 
                    iconPosition="start"
                  />
                  <Tab 
                    value="list" 
                    label="List View" 
                    icon={<ViewListIcon />} 
                    iconPosition="start"
                  />
                </Tabs>
              </Paper>
              
              <GoalTracker viewMode={viewMode} />
            </>
          } 
        />
        <Route path="/create" element={<GoalWizard />} />
        <Route path="/:goalId" element={<GoalDetail />} />
      </Routes>
    </Box>
  );
};

export default Goals;