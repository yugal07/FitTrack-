// src/components/auth/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, loading, loginMode } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={50} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  console.log('AdminRoute - Checking access:', { 
    isAuthenticated: !!currentUser, 
    role: currentUser?.role, 
    loginMode,
    hasAccess: currentUser && currentUser.role === 'admin' && loginMode === 'admin'
  });

  // Redirect non-admin users or admin users in user mode to the user dashboard
  if (!currentUser || currentUser.role !== 'admin' || loginMode !== 'admin') {
    console.log('Access denied to admin route, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('Admin access granted, rendering admin content');
  return children;
};

export default AdminRoute;