// src/components/layout/Header.jsx
import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Badge,
  useMediaQuery,
  useTheme,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon,
  FitnessCenter as FitnessCenterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Header = ({ toggleTheme, darkMode, toggleSidebar, open, drawerWidth }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
  
  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };
  
  const handleSettings = () => {
    navigate('/settings');
    handleClose();
  };

  // Get user's initials for avatar when no profile picture
  const getUserInitials = () => {
    if (!currentUser) return '';
    return `${currentUser.firstName?.charAt(0) || ''}${currentUser.lastName?.charAt(0) || ''}`;
  };

  // Avatar src or empty string if no profile picture
  const avatarSrc = currentUser?.profilePicture || '';

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        boxShadow: 'none',
        backdropFilter: 'blur(10px)',
        backgroundColor: darkMode 
          ? 'rgba(28, 35, 51, 0.85)' 
          : 'rgba(255, 255, 255, 0.85)',
        borderBottom: `1px solid ${theme.palette.divider}`,
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
        ...(!open && {
          width: { md: `calc(100% - ${theme.spacing(9)})` },
          marginLeft: { md: theme.spacing(9) },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
      }}
    >
      <Toolbar sx={{ pr: 3, pl: { xs: 2, md: 3 } }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2, display: { md: !open ? 'block' : 'none', xs: 'block' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FitnessCenterIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              display: { xs: 'none', sm: 'block' },
              color: 'text.primary',
              textDecoration: 'none',
              fontWeight: 'bold',
              letterSpacing: -0.5,
            }}
          >
            FitTrack
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          {/* Dashboard quick access - visible on wider screens */}
          {!isMobile && (
            <Button
              variant={location.pathname === '/dashboard' ? 'contained' : 'text'}
              startIcon={<DashboardIcon />}
              component={RouterLink}
              to="/dashboard"
              sx={{ 
                display: { xs: 'none', lg: 'flex' },
                borderRadius: '8px',
                px: 2,
              }}
            >
              Dashboard
            </Button>
          )}
          
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
              Recent Notifications
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <MenuItem onClick={handleNotificationsClose} sx={{ borderRadius: 1 }}>
              <ListItemText 
                primary="New workout recommendation"
                secondary="Check out the new HIIT session tailored for you"
                primaryTypographyProps={{ fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: '0.775rem' }}
              />
            </MenuItem>
            <MenuItem onClick={handleNotificationsClose} sx={{ borderRadius: 1 }}>
              <ListItemText 
                primary="Goal achieved"
                secondary="Congratulations! You completed your weight goal"
                primaryTypographyProps={{ fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: '0.775rem' }}
              />
            </MenuItem>
            <MenuItem onClick={handleNotificationsClose} sx={{ borderRadius: 1 }}>
              <ListItemText 
                primary="Don't forget to log your meals"
                secondary="Keep your nutrition tracking consistent"
                primaryTypographyProps={{ fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: '0.775rem' }}
              />
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button size="small">View All Notifications</Button>
            </Box>
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
                alt={currentUser?.firstName || 'User'}
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
                  {currentUser.email}
                </Typography>
              </Box>
            )}
            <Divider sx={{ mb: 1 }} />
            <MenuItem onClick={handleProfile} sx={{ borderRadius: 1 }}>
              <ListItemIcon>
                <AccountIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleSettings} sx={{ borderRadius: 1 }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
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
  );
};

export default Header;