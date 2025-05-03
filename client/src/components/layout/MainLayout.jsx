// src/components/layout/MainLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, useMediaQuery, useTheme, Drawer, IconButton, Toolbar, AppBar } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 260;

const MainLayout = ({ toggleTheme, darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header 
        toggleTheme={toggleTheme} 
        darkMode={darkMode} 
        toggleSidebar={handleDrawerToggle} 
        open={open}
        drawerWidth={drawerWidth}
      />
      
      {/* Sidebar for desktop - persistent drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: { xs: 'none', md: 'block' },
          width: open ? drawerWidth : theme.spacing(9),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : theme.spacing(9),
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            backgroundImage: 'none',
            transition: theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <Sidebar 
            open={open} 
            handleDrawerToggle={handleDrawerToggle}
          />
        </Box>
      </Drawer>

      {/* Sidebar for mobile - temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundImage: 'none',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <Sidebar 
            open={true} 
            handleDrawerToggle={handleDrawerToggle}
          />
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          width: { md: `calc(100% - ${open ? drawerWidth : theme.spacing(9)}px)` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          mt: 8,
          overflow: 'auto',
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;