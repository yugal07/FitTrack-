// src/components/common/ModeSwitcher.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  Chip
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  SwapHoriz as SwitchIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const ModeSwitcher = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser, loginMode, switchLoginMode } = useAuth();
  const navigate = useNavigate();

  // Only admin users should be able to switch modes
  const isAdmin = currentUser && currentUser.role === 'admin';

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchMode = (mode) => {
    handleClose();
    
    if (switchLoginMode(mode)) {
      // Navigate to the appropriate dashboard
      if (mode === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  if (!isAdmin) {
    return null; // Don't render anything for non-admin users
  }

  return (
    <>
      <Tooltip title="Switch view mode">
        <Button
          variant="outlined"
          size="small"
          onClick={handleClick}
          startIcon={<SwitchIcon />}
          endIcon={loginMode === 'admin' ? <AdminIcon /> : <UserIcon />}
          sx={{ borderRadius: 4 }}
        >
          {loginMode === 'admin' ? 'Admin Mode' : 'User Mode'}
        </Button>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Switch View Mode
          </Typography>
        </Box>
        
        <MenuItem 
          onClick={() => handleSwitchMode('user')}
          selected={loginMode === 'user'}
          disabled={loginMode === 'user'}
        >
          <ListItemIcon>
            <UserIcon />
          </ListItemIcon>
          <ListItemText primary="User Dashboard" />
          {loginMode === 'user' && (
            <Chip label="Current" size="small" variant="outlined" />
          )}
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleSwitchMode('admin')}
          selected={loginMode === 'admin'}
          disabled={loginMode === 'admin'}
        >
          <ListItemIcon>
            <AdminIcon />
          </ListItemIcon>
          <ListItemText primary="Admin Dashboard" />
          {loginMode === 'admin' && (
            <Chip label="Current" size="small" variant="outlined" />
          )}
        </MenuItem>
      </Menu>
    </>
  );
};

export default ModeSwitcher;