// src/pages/admin/SendNotifications.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Save as SaveIcon,
  ContentCopy as ContentCopyIcon,
  AddCircleOutline as AddCircleOutlineIcon
} from '@mui/icons-material';

// Template notification samples
const notificationTemplates = [
  {
    id: 1,
    title: 'New Feature Announcement',
    message: 'We\'re excited to announce our latest feature: [Feature Name]. Check it out in the app today!',
    type: 'system'
  },
  {
    id: 2,
    title: 'Weekly Workout Reminder',
    message: 'Don\'t forget to log your workouts this week! Consistency is key to achieving your fitness goals.',
    type: 'workout'
  },
  {
    id: 3,
    title: 'Nutrition Tip',
    message: 'Remember to track your daily water intake for proper hydration. Aim for at least 8 glasses per day!',
    type: 'nutrition'
  }
];

const SendNotifications = () => {
  const theme = useTheme();
  const [notificationType, setNotificationType] = useState('system');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [sending, setSending] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle notification type change
  const handleTypeChange = (event) => {
    setNotificationType(event.target.value);
  };

  // Handle target audience change
  const handleTargetChange = (event) => {
    setTargetAudience(event.target.value);
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setNotificationTitle(template.title);
    setNotificationMessage(template.message);
    setNotificationType(template.type);
  };

  // Handle scheduling toggle
  const handleScheduleToggle = () => {
    setScheduled(!scheduled);
    if (!scheduled) {
      // Set default schedule date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduleDate(tomorrow.toISOString().split('T')[0]);
    }
  };

  // Handle send notification
  const handleSendNotification = () => {
    if (!notificationTitle || !notificationMessage) {
      return;
    }

    setSending(true);

    // In a real app, this would call your API
    setTimeout(() => {
      setSending(false);
      setSuccessMessage(scheduled ? 
        'Notification scheduled successfully!' : 
        'Notification sent successfully!');
      setShowSuccessAlert(true);
      
      // Reset form after successful send in a real app
      if (!scheduled) {
        resetForm();
      }
    }, 1500);
  };

  // Reset form
  const resetForm = () => {
    setNotificationTitle('');
    setNotificationMessage('');
    setNotificationType('system');
    setTargetAudience('all');
    setSelectedTemplate(null);
    setScheduled(false);
    setScheduleDate('');
  };

  // Format audience count based on selection
  const getAudienceCount = () => {
    switch (targetAudience) {
      case 'all':
        return '1,285 users';
      case 'active':
        return '742 active users';
      case 'inactive':
        return '543 inactive users';
      case 'beginners':
        return '460 beginner users';
      case 'intermediate':
        return '585 intermediate users';
      case 'advanced':
        return '240 advanced users';
      default:
        return '1,285 users';
    }
  };

  // Get notification type icon
  const getNotificationTypeIcon = () => {
    switch (notificationType) {
      case 'system':
        return <NotificationsIcon />;
      case 'workout':
        return <SendIcon />;
      case 'nutrition':
        return <SendIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Send Notifications
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Notification Type</InputLabel>
                  <Select
                    value={notificationType}
                    onChange={handleTypeChange}
                    label="Notification Type"
                  >
                    <MenuItem value="system">System Announcement</MenuItem>
                    <MenuItem value="workout">Workout Reminder</MenuItem>
                    <MenuItem value="nutrition">Nutrition Reminder</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    value={targetAudience}
                    onChange={handleTargetChange}
                    label="Target Audience"
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    <MenuItem value="active">Active Users</MenuItem>
                    <MenuItem value="inactive">Inactive Users</MenuItem>
                    <MenuItem value="beginners">Beginner Fitness Level</MenuItem>
                    <MenuItem value="intermediate">Intermediate Fitness Level</MenuItem>
                    <MenuItem value="advanced">Advanced Fitness Level</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notification Title"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  margin="normal"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notification Message"
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  margin="normal"
                  required
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button 
                startIcon={scheduled ? <ScheduleIcon /> : <SendIcon />}
                variant="contained"
                onClick={handleSendNotification}
                disabled={!notificationTitle || !notificationMessage || sending}
                sx={{ minWidth: 150 }}
              >
                {sending ? <CircularProgress size={24} /> : 
                  scheduled ? 'Schedule' : 'Send Now'}
              </Button>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                  onClick={handleScheduleToggle}
                  color={scheduled ? 'primary' : 'inherit'}
                >
                  {scheduled ? 'Cancel Schedule' : 'Schedule For Later'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={resetForm}
                  color="inherit"
                >
                  Clear Form
                </Button>
              </Box>
            </Box>
            
            {scheduled && (
              <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Schedule Delivery
                </Typography>
                <TextField
                  type="datetime-local"
                  label="Schedule Date & Time"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  required
                />
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Notification Preview
              </Typography>
              <Chip 
                label={getAudienceCount()} 
                color="primary" 
                size="small"
              />
            </Box>
            
            {(notificationTitle || notificationMessage) ? (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                      {getNotificationTypeIcon()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {notificationTitle || 'Notification Title'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date().toLocaleString()} • {
                          notificationType === 'system' ? 'System Announcement' :
                          notificationType === 'workout' ? 'Workout Reminder' :
                          'Nutrition Reminder'
                        }
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ pl: 6 }}>
                    {notificationMessage || 'Notification message will appear here...'}
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                <NotificationsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography>
                  Fill out the notification details to see a preview
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Templates
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Use these templates as a starting point for common notifications.
            </Typography>
            
            {notificationTemplates.map((template) => (
              <Card 
                key={template.id} 
                variant="outlined" 
                sx={{ 
                  mb: 2, 
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }
                }}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {template.title}
                    </Typography>
                    <Chip 
                      label={
                        template.type === 'system' ? 'System' :
                        template.type === 'workout' ? 'Workout' :
                        'Nutrition'
                      } 
                      size="small" 
                      color={
                        template.type === 'system' ? 'primary' :
                        template.type === 'workout' ? 'secondary' :
                        'success'
                      }
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {template.message}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            
            <Button 
              startIcon={<AddCircleOutlineIcon />}
              fullWidth
              sx={{ mt: 2 }}
            >
              Create New Template
            </Button>
          </Paper>
          
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Tips
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" paragraph>
                Keep notifications concise and action-oriented.
              </Typography>
              <Typography component="li" variant="body2" paragraph>
                Use a clear call-to-action when appropriate.
              </Typography>
              <Typography component="li" variant="body2" paragraph>
                Target specific user segments for better engagement.
              </Typography>
              <Typography component="li" variant="body2" paragraph>
                Schedule important announcements during peak usage hours.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Success notification */}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={6000}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowSuccessAlert(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SendNotifications;