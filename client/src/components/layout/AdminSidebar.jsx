// src/components/layout/AdminSidebar.jsx
import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  FitnessCenter as WorkoutIcon,
  BarChart as AnalyticsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Restaurant as NutritionIcon,
  ExpandLess,
  ExpandMore,
  Person as UserIcon,
  List as ListIcon,
  Flag as FlagIcon,
  Campaign as AnnouncementIcon,
  Tune as ConfigIcon,
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  SportsGymnastics as ExerciseIcon
} from '@mui/icons-material';

const AdminSidebar = ({ open }) => {
  const location = useLocation();
  const theme = useTheme();
  
  // Track open state for each submenu
  const [openSubmenus, setOpenSubmenus] = useState({
    users: false,
    content: false,
    analytics: false,
    notifications: false,
    settings: false
  });

  const handleSubmenuToggle = (submenuId) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [submenuId]: !prev[submenuId]
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      text: 'Admin Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
    },
    {
      id: 'users',
      text: 'User Management',
      icon: <PeopleIcon />,
      submenu: true,
      items: [
        {
          text: 'User Accounts',
          path: '/admin/users',
          icon: <UserIcon fontSize="small" />
        },
        {
          text: 'User Activity',
          path: '/admin/users/activity',
          icon: <HistoryIcon fontSize="small" />
        }
      ]
    },
    {
      id: 'content',
      text: 'Content Management',
      icon: <ListIcon />,
      submenu: true,
      items: [
        {
          text: 'Workout Templates',
          path: '/admin/content/workouts',
          icon: <WorkoutIcon fontSize="small" />
        },
        {
          text: 'Exercise Library',
          path: '/admin/content/exercises',
          icon: <ExerciseIcon fontSize="small" />
        },
        {
          text: 'Nutrition Database',
          path: '/admin/content/nutrition',
          icon: <NutritionIcon fontSize="small" />
        },
        {
          text: 'Flagged Content',
          path: '/admin/content/flagged',
          icon: <FlagIcon fontSize="small" />
        }
      ]
    },
    {
      id: 'analytics',
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      submenu: true,
      items: [
        {
          text: 'Usage Metrics',
          path: '/admin/analytics/usage',
        },
        {
          text: 'User Engagement',
          path: '/admin/analytics/engagement',
        },
        {
          text: 'Growth & Retention',
          path: '/admin/analytics/growth',
        }
      ]
    },
    {
      id: 'notifications',
      text: 'Notifications',
      icon: <NotificationsIcon />,
      submenu: true,
      items: [
        {
          text: 'Announcements',
          path: '/admin/notifications/announcements',
          icon: <AnnouncementIcon fontSize="small" />
        },
        {
          text: 'Send Notifications',
          path: '/admin/notifications/send',
        },
        {
          text: 'Templates',
          path: '/admin/notifications/templates',
        }
      ]
    },
    {
      id: 'settings',
      text: 'System Settings',
      icon: <SettingsIcon />,
      submenu: true,
      items: [
        {
          text: 'Configuration',
          path: '/admin/settings/config',
          icon: <ConfigIcon fontSize="small" />
        },
        {
          text: 'Admin Accounts',
          path: '/admin/settings/admins',
          icon: <AccountIcon fontSize="small" />
        },
        {
          text: 'Security',
          path: '/admin/settings/security',
          icon: <SecurityIcon fontSize="small" />
        }
      ]
    }
  ];

  return (
    <>
      <List component="nav" sx={{ px: 2 }}>
        {!open && (
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <DashboardIcon color="primary" fontSize="large" />
          </Box>
        )}
        
        {open && (
          <Box sx={{ py: 2, px: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Admin Panel
            </Typography>
          </Box>
        )}
        
        {menuItems.map((item) => (
          <Box key={item.id}>
            {item.submenu ? (
              <>
                <ListItemButton
                  onClick={() => handleSubmenuToggle(item.id)}
                  sx={{
                    mb: 0.5,
                    py: 1,
                    borderRadius: 1,
                    backgroundColor: location.pathname.includes(`/admin/${item.id}`) 
                      ? theme.palette.action.selected 
                      : 'transparent',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      color: location.pathname.includes(`/admin/${item.id}`) 
                        ? theme.palette.primary.main 
                        : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      opacity: open ? 1 : 0,
                      color: location.pathname.includes(`/admin/${item.id}`) 
                        ? theme.palette.primary.main 
                        : 'inherit',
                    }}
                  />
                  {open && (openSubmenus[item.id] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
                
                <Collapse in={open && openSubmenus[item.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.items.map((subItem) => (
                      <ListItemButton
                        key={subItem.text}
                        component={RouterLink}
                        to={subItem.path}
                        selected={location.pathname === subItem.path}
                        sx={{ 
                          pl: 4,
                          py: 0.75,
                          borderRadius: 1,
                          mr: 1,
                          mb: 0.5,
                        }}
                      >
                        {subItem.icon && (
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: 2,
                              justifyContent: 'center',
                              color: location.pathname === subItem.path 
                                ? theme.palette.primary.main 
                                : 'inherit',
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                        )}
                        <ListItemText 
                          primary={subItem.text} 
                          primaryTypographyProps={{ 
                            fontSize: '0.875rem',
                            fontWeight: location.pathname === subItem.path ? 500 : 400
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  mb: 0.5,
                  py: 1,
                  borderRadius: 1
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            )}
          </Box>
        ))}
      </List>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', pt: 2, pb: 2 }}>
        {!open ? (
          <RouterLink to="/">
            <WorkoutIcon color="primary" />
          </RouterLink>
        ) : (
          <Typography 
            component={RouterLink} 
            to="/"
            variant="body2" 
            color="text.secondary"
            sx={{ 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              '&:hover': { color: theme.palette.primary.main }
            }}
          >
            <WorkoutIcon fontSize="small" sx={{ mr: 1 }} />
            Back to FitTrack
          </Typography>
        )}
      </Box>
    </>
  );
};

export default AdminSidebar;