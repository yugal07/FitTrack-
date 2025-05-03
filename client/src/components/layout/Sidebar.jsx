// src/components/layout/Sidebar.jsx
import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
  Collapse,
  Toolbar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FitnessCenter as WorkoutIcon,
  Restaurant as NutritionIcon,
  Timeline as ProgressIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  DirectionsRun as ExerciseIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

const Sidebar = ({ open, handleDrawerToggle }) => {
  const location = useLocation();
  const theme = useTheme();
  
  // Track open state for each submenu using its ID
  const [openSubmenus, setOpenSubmenus] = useState({
    workouts: true, // Set to true to have the workout submenu expanded by default
    progress: false
  });

  const handleSubmenuToggle = (submenuId) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [submenuId]: !prev[submenuId]
    }));
  };

  // Check if the current route is part of a submenu
  const isSubmenuActive = (submenuItems) => {
    return submenuItems.some(item => location.pathname === item.path);
  };

  const menuItems = [
    {
      id: 'dashboard',
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
    },
    {
      id: 'workouts',
      text: 'Workouts',
      icon: <WorkoutIcon />,
      path: '/workouts',
      submenu: true,
      submenuItems: [
        {
          text: 'My Workouts',
          path: '/workouts',
        },
        {
          text: 'Create Workout',
          path: '/workouts/create',
          icon: <ExerciseIcon />,
        },
        {
          text: 'Workout History',
          path: '/workout-history',
          icon: <HistoryIcon />,
        },
      ],
    },
    {
      id: 'nutrition',
      text: 'Nutrition',
      icon: <NutritionIcon />,
      path: '/nutrition',
    },
    {
      id: 'progress',
      text: 'Progress',
      icon: <ProgressIcon />,
      path: '/progress',
      submenu: true,
      submenuItems: [
        {
          text: 'Overview',
          path: '/progress',
        },
        {
          text: 'Workout Performance',
          path: '/progress/workout',
        },
        {
          text: 'Body Measurements',
          path: '/progress/measurements',
        },
        {
          text: 'Progress Photos',
          path: '/progress/photos',
        },
      ],
    },
    {
      id: 'settings',
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  return (
    <div>
      <List>
        {menuItems.map((item) => (
          <Box key={item.id}>
            {item.submenu ? (
              <>
                <ListItemButton
                  onClick={() => handleSubmenuToggle(item.id)}
                  selected={location.pathname === item.path || isSubmenuActive(item.submenuItems)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                  {open && (openSubmenus[item.id] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
                <Collapse in={open && openSubmenus[item.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenuItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.text}
                        component={RouterLink}
                        to={subItem.path}
                        selected={location.pathname === subItem.path}
                        sx={{ 
                          pl: 4,
                          minHeight: 48,
                          justifyContent: open ? 'initial' : 'center',
                          px: 2.5,
                        }}
                      >
                        {subItem.icon && (
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                        )}
                        <ListItemText 
                          primary={subItem.text} 
                          sx={{ opacity: open ? 1 : 0 }}
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
                selected={location.pathname === item.path || (item.path === '/' && location.pathname === '/dashboard')}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
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
      <Divider />
    </div>
  );
};

export default Sidebar;