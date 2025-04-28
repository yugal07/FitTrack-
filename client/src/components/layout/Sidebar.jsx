// src/components/layout/Sidebar.jsx
import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Drawer,
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

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [openSubmenus, setOpenSubmenus] = useState({
    workouts: false,
  });

  const handleSubmenuToggle = (submenu) => {
    setOpenSubmenus({
      ...openSubmenus,
      [submenu]: !openSubmenus[submenu],
    });
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
    },
    {
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
          text: 'Exercise Library',
          path: '/exercises',
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
      text: 'Nutrition',
      icon: <NutritionIcon />,
      path: '/nutrition',
    },{
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
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Box key={item.text}>
            {item.submenu ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleSubmenuToggle('workouts')}
                    selected={location.pathname === item.path}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {openSubmenus.workouts ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={openSubmenus.workouts} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenuItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.text}
                        component={RouterLink}
                        to={subItem.path}
                        selected={location.pathname === subItem.path}
                        sx={{ pl: 4 }}
                      >
                        {subItem.icon && <ListItemIcon>{subItem.icon}</ListItemIcon>}
                        <ListItemText primary={subItem.text} />
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
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            )}
          </Box>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;