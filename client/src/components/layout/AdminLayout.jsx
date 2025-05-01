// src/components/layout/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Box, 
  CssBaseline, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  Divider, 
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const drawerWidth = 260;

const AdminLayout = ({ toggleTheme, darkMode }) => {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

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

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenu = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  // Get user's initials for avatar when no profile picture
  const getUserInitials = () => {
    if (!currentUser) return '';
    return `${currentUser.firstName?.charAt(0) || ''}${currentUser.lastName?.charAt(0) || ''}`;
  };

  // Avatar src or empty string if no profile picture
  const avatarSrc = currentUser?.profilePicture || '';

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      {/* Admin AppBar */}
      <AppBar 
        position="fixed" 
        sx={{
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(28, 35, 51, 0.85)'
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            width: { md: `calc(100% - ${drawerWidth}px)` },
            marginLeft: { md: `${drawerWidth}px` },
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: !open ? 'block' : 'none', xs: 'block' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DashboardIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
            <Typography
              variant="h5"
              component="div"
              sx={{
                display: { xs: 'none', sm: 'block' },
                color: 'text.primary',
                fontWeight: 'bold',
                letterSpacing: -0.5,
              }}
            >
              Admin Dashboard
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <ModeSwitcher />
            <Tooltip title="Toggle dark/light mode">
              <IconButton 
                onClick={toggleTheme}
                sx={{ 
                  bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    bgcolor: darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
                  }
                }}
              >
                {darkMode ? <LightIcon /> : <DarkIcon />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton 
                onClick={handleNotificationsMenu}
                sx={{ 
                  bgcolor: notificationsAnchorEl ? theme.palette.primary.main : 'transparent',
                  color: notificationsAnchorEl ? 'white' : 'inherit',
                  '&:hover': {
                    bgcolor: notificationsAnchorEl 
                      ? theme.palette.primary.dark 
                      : (darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'),
                  }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Menu
              anchorEl={notificationsAnchorEl}
              open={Boolean(notificationsAnchorEl)}
              onClose={handleNotificationsClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                elevation: 2,
                sx: { 
                  width: 320,
                  maxHeight: 400,
                  mt: 1.5,
                  p: 1
                }
              }}
            >
              <Typography variant="subtitle1" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                Admin Notifications
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <MenuItem onClick={handleNotificationsClose} sx={{ borderRadius: 1 }}>
                <ListItemText 
                  primary="New user registrations"
                  secondary="5 new users registered today"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: '0.775rem' }}
                />
              </MenuItem>
              <MenuItem onClick={handleNotificationsClose} sx={{ borderRadius: 1 }}>
                <ListItemText 
                  primary="Content flagged for review"
                  secondary="3 items need your attention"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: '0.775rem' }}
                />
              </MenuItem>
              <MenuItem onClick={handleNotificationsClose} sx={{ borderRadius: 1 }}>
                <ListItemText 
                  primary="System update available"
                  secondary="Version 2.1.0 is ready to install"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: '0.775rem' }}
                />
              </MenuItem>
            </Menu>
            
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleMenu}
                size="small"
                sx={{ ml: 1 }}
              >
                <Avatar
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: !avatarSrc ? 'primary.main' : undefined,
                    border: '2px solid',
                    borderColor: 'primary.main'
                  }}
                  alt={currentUser?.firstName || 'Admin'}
                  src={avatarSrc || undefined}
                >
                  {!avatarSrc && getUserInitials()}
                </Avatar>
              </IconButton>
            </Tooltip>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                elevation: 2,
                sx: { 
                  width: 200,
                  mt: 1.5
                }
              }}
            >
              {currentUser && (
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {currentUser.firstName} {currentUser.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.775rem' }}>
                    Administrator
                  </Typography>
                </Box>
              )}
              <Divider sx={{ mb: 1 }} />
              <MenuItem onClick={() => { handleClose(); navigate('/admin/settings'); }} sx={{ borderRadius: 1 }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Admin Settings</ListItemText>
              </MenuItem>
              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={handleLogout} sx={{ borderRadius: 1 }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar for desktop - persistent drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              width: theme.spacing(7),
            }),
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <AdminSidebar open={open} />
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
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <AdminSidebar open={true} />
      </Drawer>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          backgroundColor: theme.palette.mode === 'light' 
            ? theme.palette.grey[100] 
            : theme.palette.background.default,
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <AdminHeader />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;