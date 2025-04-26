// src/components/layout/Header.jsx
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Header = ({ toggleTheme, darkMode, toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    handleClose();
    navigate('/login');
  };
  
  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };
  
  const handleSettings = () => {
    // Future implementation
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
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            color: 'white',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          FitTrack
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Toggle dark/light mode">
            <IconButton color="inherit" onClick={toggleTheme}>
              {darkMode ? <LightIcon /> : <DarkIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenu}
              color="inherit"
              size="small"
              sx={{ ml: 1 }}
            >
              <Avatar
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: !avatarSrc ? 'primary.main' : undefined 
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
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleSettings}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;