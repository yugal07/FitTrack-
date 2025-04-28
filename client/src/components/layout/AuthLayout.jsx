// src/components/layout/AuthLayout.jsx
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Container, Box, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';
import { FitnessCenter as FitnessCenterIcon } from '@mui/icons-material';

const AuthLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/login')) return 'Log In';
    if (path.includes('/register')) return 'Create Account';
    if (path.includes('/forgot-password')) return 'Reset Password';
    return 'Welcome';
  };

  // Change body background for auth pages
  useEffect(() => {
    // Save original background
    const originalBg = document.body.style.background;
    
    // Set gradient background for auth pages
    document.body.style.background = theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.primary.dark})`
      : `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.primary.light})`;
    
    // Restore original background on cleanup
    return () => {
      document.body.style.background = originalBg;
    };
  }, [theme]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorative elements */}
      <Box 
        sx={{ 
          position: 'absolute', 
          width: '50vw', 
          height: '50vw', 
          borderRadius: '50%', 
          background: theme.palette.primary.main,
          opacity: 0.05,
          top: '-15vw',
          right: '-15vw',
          zIndex: -1
        }}
      />
      <Box 
        sx={{ 
          position: 'absolute', 
          width: '30vw', 
          height: '30vw', 
          borderRadius: '50%', 
          background: theme.palette.secondary.main,
          opacity: 0.05,
          bottom: '-10vw',
          left: '-10vw',
          zIndex: -1
        }}
      />
      
      {/* App logo and branding */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          flexDirection: isMobile ? 'column' : 'row',
          gap: 1
        }}
      >
        <FitnessCenterIcon
          sx={{
            fontSize: 40,
            color: theme.palette.primary.main,
            mb: isMobile ? 1 : 0
          }}
        />
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: -0.5
          }}
        >
          FitTrack
        </Typography>
      </Box>

      {/* Main auth card */}
      <Container 
        maxWidth="sm" 
        sx={{ 
          width: '100%',
          mb: isMobile ? 4 : 6
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            borderRadius: 3,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
          }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            {getPageTitle()}
          </Typography>
          
          <Outlet />
        </Paper>
      </Container>
      
      {/* Additional branding or info */}
      <Box sx={{ textAlign: 'center', mt: 'auto', pt: 2 }}>
        <Typography 
          variant="subtitle2" 
          color="text.secondary"
        >
          FitTrack — Your Fitness Journey Partner
        </Typography>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ display: 'block', mt: 1 }}
        >
          © {new Date().getFullYear()} FitTrack. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthLayout;