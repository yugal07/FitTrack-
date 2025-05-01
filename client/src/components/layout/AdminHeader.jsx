// src/components/layout/AdminHeader.jsx
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  useTheme
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  FormatListBulleted as ContentIcon,
  BarChart as AnalyticsIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const AdminHeader = ({ title, subtitle }) => {
  const theme = useTheme();
  const location = useLocation();
  
  // Get path segments for breadcrumbs
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  
  // Get icon for current section
  const getIcon = (segment) => {
    switch (segment) {
      case 'dashboard':
        return <DashboardIcon fontSize="small" sx={{ mr: 0.5 }} />;
      case 'users':
        return <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />;
      case 'content':
        return <ContentIcon fontSize="small" sx={{ mr: 0.5 }} />;
      case 'analytics':
        return <AnalyticsIcon fontSize="small" sx={{ mr: 0.5 }} />;
      case 'notifications':
        return <NotificationsIcon fontSize="small" sx={{ mr: 0.5 }} />;
      case 'settings':
        return <SettingsIcon fontSize="small" sx={{ mr: 0.5 }} />;
      default:
        return null;
    }
  };
  
  // Get label for breadcrumb
  const getLabel = (segment) => {
    // Use special cases for subsections
    if (pathSegments[1] === 'content' && segment === 'workouts') return 'Workout Templates';
    if (pathSegments[1] === 'content' && segment === 'exercises') return 'Exercise Library';
    if (pathSegments[1] === 'content' && segment === 'flagged') return 'Flagged Content';
    if (pathSegments[1] === 'analytics' && segment === 'usage') return 'Usage Metrics';
    if (pathSegments[1] === 'analytics' && segment === 'engagement') return 'User Engagement';
    if (pathSegments[1] === 'analytics' && segment === 'growth') return 'Growth & Retention';
    
    // Default formatting: capitalize first letter of each word
    return segment.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 1 }}
      >
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/admin/dashboard"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <DashboardIcon fontSize="small" sx={{ mr: 0.5 }} />
          Admin
        </Link>
        
        {pathSegments.slice(1).map((segment, index) => {
          // Skip 'admin' as it's already in the first breadcrumb
          if (segment === 'admin') return null;
          
          // Build the path up to this segment
          const path = `/${pathSegments.slice(0, index + 2).join('/')}`;
          
          // If this is the last segment, don't render as a link
          const isLast = index === pathSegments.slice(1).length - 1;
          
          if (isLast) {
            return (
              <Typography 
                key={segment} 
                color="text.primary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {getIcon(segment)}
                {getLabel(segment)}
              </Typography>
            );
          }
          
          return (
            <Link
              key={segment}
              underline="hover"
              color="inherit"
              component={RouterLink}
              to={path}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {getIcon(segment)}
              {getLabel(segment)}
            </Link>
          );
        })}
      </Breadcrumbs>
      
      {/* Page title */}
      {title && (
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      )}
      
      {/* Optional subtitle */}
      {subtitle && (
        <Typography variant="subtitle1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default AdminHeader;