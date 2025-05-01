// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Button, 
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  ListItemButton,
  Avatar,
  Chip,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  FitnessCenter as WorkoutIcon,
  AccessTime as TimeIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
  Flag as FlagIcon,
  PersonAdd as PersonAddIcon,
  EventNote as EventNoteIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// Sample data - in a real app, this would come from your API
const userStatsData = {
  totalUsers: 1285,
  newUsersToday: 24,
  activeUsers: 742,
  userGrowth: 8.5 // percentage
};

const contentStatsData = {
  workouts: 112,
  exercises: 347,
  flaggedContent: 5
};

const recentUsers = [
  { id: 1, name: 'John Smith', email: 'john@example.com', date: '2025-04-30', avatar: '' },
  { id: 2, name: 'Emily Johnson', email: 'emily@example.com', date: '2025-04-29', avatar: '' },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', date: '2025-04-29', avatar: '' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', date: '2025-04-28', avatar: '' }
];

const userActivityData = [
  { name: 'Mon', users: 320 },
  { name: 'Tue', users: 348 },
  { name: 'Wed', users: 410 },
  { name: 'Thu', users: 382 },
  { name: 'Fri', users: 401 },
  { name: 'Sat', users: 320 },
  { name: 'Sun', users: 290 }
];

const workoutTypeData = [
  { name: 'Strength', value: 45 },
  { name: 'Cardio', value: 30 },
  { name: 'HIIT', value: 15 },
  { name: 'Flexibility', value: 10 }
];

const flaggedContentItems = [
  { id: 1, type: 'User Profile', issue: 'Inappropriate content', date: '2025-04-30' },
  { id: 2, type: 'Custom Workout', issue: 'Potentially harmful exercise', date: '2025-04-29' },
  { id: 3, type: 'User Comment', issue: 'Spam or advertising', date: '2025-04-28' }
];

const AdminDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.success.main
  ];

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
          Admin Dashboard
        </Typography>
        
        <Button 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </Box>

      {/* High-level stats cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="overline" color="primary">
                  Total Users
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>
                  {userStatsData.totalUsers.toLocaleString()}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <PeopleIcon />
              </Avatar>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Chip 
                icon={<TrendingUpIcon fontSize="small" />} 
                label={`+${userStatsData.userGrowth}% growth`}
                size="small" 
                color="primary" 
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                vs last month
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: alpha(theme.palette.secondary.main, 0.1),
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="overline" color="secondary">
                  Active Today
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>
                  {userStatsData.activeUsers.toLocaleString()}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                <PersonAddIcon />
              </Avatar>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {Math.round((userStatsData.activeUsers / userStatsData.totalUsers) * 100)}% of users active
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: alpha(theme.palette.success.main, 0.1),
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="overline" color="success.main">
                  Total Workouts
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>
                  {contentStatsData.workouts.toLocaleString()}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                <WorkoutIcon />
              </Avatar>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {contentStatsData.exercises} exercises available
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: alpha(theme.palette.error.main, 0.1),
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="overline" color="error">
                  Needs Attention
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>
                  {contentStatsData.flaggedContent}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                <FlagIcon />
              </Avatar>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Button 
                size="small" 
                color="error" 
                endIcon={<ArrowForwardIcon />}
                component="a"
                href="/admin/content/flagged"
              >
                Review Now
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts and detailed data */}
      <Grid container spacing={3}>
        {/* User Activity Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">User Activity (Last 7 Days)</Typography>
              <Button 
                endIcon={<ArrowForwardIcon />}
                size="small"
                component="a"
                href="/admin/analytics/usage"
              >
                View Details
              </Button>
            </Box>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.divider,
                  }}
                />
                <Bar 
                  dataKey="users" 
                  name="Active Users" 
                  fill={theme.palette.primary.main} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Workout Type Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Workout Type Distribution
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workoutTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={3}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {workoutTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      borderColor: theme.palette.divider,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Users */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <Typography variant="h6">Recent User Registrations</Typography>
            </Box>
            
            <List sx={{ p: 0 }}>
              {recentUsers.map((user, index) => (
                <React.Fragment key={user.id}>
                  <ListItem
                    secondaryAction={
                      <Chip 
                        label={new Date(user.date).toLocaleDateString()} 
                        size="small" 
                        variant="outlined"
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {user.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={user.name} 
                      secondary={user.email}
                    />
                  </ListItem>
                  {index < recentUsers.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
              <Button 
                fullWidth
                component="a"
                href="/admin/users"
                endIcon={<ArrowForwardIcon />}
              >
                View All Users
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Flagged Content */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.error.main, 0.05) }}>
              <Typography variant="h6">Flagged Content</Typography>
            </Box>
            
            <List sx={{ p: 0 }}>
              {flaggedContentItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItemButton>
                    <ListItemIcon>
                      <FlagIcon color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.issue} 
                      secondary={`${item.type} • ${new Date(item.date).toLocaleDateString()}`}
                    />
                  </ListItemButton>
                  {index < flaggedContentItems.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
              {flaggedContentItems.length > 0 ? (
                <Button 
                  fullWidth
                  color="error"
                  component="a"
                  href="/admin/content/flagged"
                  endIcon={<ArrowForwardIcon />}
                >
                  Review All Flagged Content
                </Button>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  No flagged content to review
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<NotificationsIcon />}
                  component="a"
                  href="/admin/notifications/send"
                  sx={{ py: 1.5 }}
                >
                  Send Notification
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<WorkoutIcon />}
                  component="a"
                  href="/admin/content/workouts/new"
                  sx={{ py: 1.5 }}
                >
                  Add Workout
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<WorkoutIcon />}
                  component="a"
                  href="/admin/content/exercises/new"
                  sx={{ py: 1.5 }}
                >
                  Add Exercise
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<SettingsIcon />}
                  component="a"
                  href="/admin/settings/config"
                  sx={{ py: 1.5 }}
                >
                  System Settings
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;