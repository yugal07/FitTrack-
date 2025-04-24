// src/pages/ForgotPassword.jsx (continued)
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // This would be replaced with actual API call
      console.log('Requesting password reset for:', email);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Handle successful request
      setSuccess(true);
    } catch (error) {
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Reset Password
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {success ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          If an account exists with the email {email}, we've sent instructions to reset your password.
        </Alert>
      ) : (
        <>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
          </Button>
        </>
      )}
      
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2">
          Remember your password?{' '}
          <Link component={RouterLink} to="/login">
            Back to Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPassword;