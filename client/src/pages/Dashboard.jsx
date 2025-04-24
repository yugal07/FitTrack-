// src/pages/Dashboard.jsx
import { Typography, Grid, Paper, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6">Recent Workouts</Typography>
            <Typography variant="body2" color="text.secondary">
              You haven't logged any workouts yet.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6">Nutrition Summary</Typography>
            <Typography variant="body2" color="text.secondary">
              No nutrition data available.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6">Goals Progress</Typography>
            <Typography variant="body2" color="text.secondary">
              Set some fitness goals to track your progress.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;