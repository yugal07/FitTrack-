// src/pages/Login.jsx (Fixed admin login flow)
import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  FormControlLabel,
  Checkbox,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Paper,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMode, setLoginMode] = useState('user'); // 'user' or 'admin' login mode
  
  const theme = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the return path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLoginModeChange = (event) => {
    setLoginMode(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email.trim() || !formData.password) {
      setError('Email and password are required');
      return;
    }
    
    setLoading(true);
    setError('');
  
    try {
      console.log('Attempting login with:', { email: formData.email, mode: loginMode });
      
      // Pass the login mode to the login function
      const result = await login(formData, loginMode);
      
      if (result) {
        console.log('Login result:', result);
        
        // Check if user is an admin
        if (result.role === 'admin') {
          // Admin user - redirect based on selected mode
          if (loginMode === 'admin') {
            console.log('Admin user logging in as admin, redirecting to admin dashboard');
            navigate('/admin/dashboard');
          } else {
            console.log('Admin user logging in as regular user, navigating to user dashboard');
            navigate(from, { replace: true });
          }
        } else {
          // Regular user - always redirect to user dashboard
          console.log('Regular user, navigating to user dashboard');
          navigate(from, { replace: true });
        }
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error in component:', error);
      setError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            '& .MuiAlert-icon': { alignItems: 'center' }
          }}
        >
          {error}
        </Alert>
      )}
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleTogglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              color="primary"
              size="small"
            />
          }
          label={
            <Typography variant="body2">
              Remember me
            </Typography>
          }
        />
        
        <Link 
          component={RouterLink} 
          to="/forgot-password" 
          variant="body2"
          sx={{ 
            color: theme.palette.primary.main,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          Forgot password?
        </Link>
      </Box>
      
      {/* Admin Login Option */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 2
        }}
      >
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ fontSize: '0.875rem', mb: 1 }}>
            Login Mode
          </FormLabel>
          <RadioGroup
            row
            name="login-mode"
            value={loginMode}
            onChange={handleLoginModeChange}
          >
            <FormControlLabel 
              value="user" 
              control={<Radio size="small" />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <UserIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">User Dashboard</Typography>
                </Box>
              }
            />
            <FormControlLabel 
              value="admin" 
              control={<Radio size="small" />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AdminIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">Admin Dashboard</Typography>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Note: Admin Dashboard option is only available for admin accounts
        </Typography>
      </Paper>
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        startIcon={loading ? null : <LoginIcon />}
        sx={{ 
          py: 1.5,
          mb: 3,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
        }}
      >
        {loading ? <CircularProgress size={24} /> : 'Log In'}
      </Button>
      
      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
          or
        </Typography>
      </Divider>
      
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Don't have an account?
        </Typography>
        <Button
          component={RouterLink}
          to="/register"
          variant="outlined"
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1.2,
            textTransform: 'none',
            fontSize: '0.9rem',
          }}
        >
          Create Account
        </Button>
      </Box>
    </Box>
  );
};

export default Login;