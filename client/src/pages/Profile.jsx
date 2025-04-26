// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

const Profile = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    fitnessLevel: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        if (currentUser) {
          console.log('Setting profile data from currentUser:', currentUser);
          setFormData({
            firstName: currentUser.firstName || '',
            lastName: currentUser.lastName || '',
            email: currentUser.email || '',
            gender: currentUser.gender || '',
            fitnessLevel: currentUser.fitnessLevel || 'beginner',
          });
        } else {
          // Fallback: If currentUser is not available, fetch from API
          console.log('CurrentUser not available, fetching profile data from API');
          const response = await userService.getProfile();
          if (response.success) {
            const userData = response.data.user;
            console.log('Fetched user data:', userData);
            setFormData({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: userData.email || '',
              gender: userData.gender || '',
              fitnessLevel: userData.fitnessLevel || 'beginner',
            });
          } else {
            setError('Failed to load profile data');
          }
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('Updating profile with:', formData);
      const response = await userService.updateProfile(formData);
      if (response.success) {
        console.log('Profile updated successfully:', response.data);
        setSuccess(true);
        // Set timeout to hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.error?.message || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('An error occurred while updating your profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const response = await userService.uploadProfilePicture(file);
      
      if (response.success) {
        console.log('Profile picture uploaded successfully:', response.data);
        setSuccess(true);
        // You'd typically update the user state here with the new profile picture
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.error?.message || 'Failed to upload profile picture.');
      }
    } catch (error) {
      console.error('Profile picture upload error:', error);
      setError('An error occurred while uploading your profile picture.');
    } finally {
      setLoading(false);
    }
  };

  const fitnessLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer not to say', label: 'Prefer not to say' },
  ];

  // Get user's initials for avatar when no profile picture
  const getUserInitials = () => {
    return `${formData.firstName?.charAt(0) || ''}${formData.lastName?.charAt(0) || ''}`;
  };

  // Avatar src or empty string if no profile picture
  const avatarSrc = currentUser?.profilePicture || '';

  if (loading && !formData.firstName) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{ 
              width: 100, 
              height: 100, 
              mr: 3,
              bgcolor: !avatarSrc ? 'primary.main' : undefined 
            }}
            alt={`${formData.firstName} ${formData.lastName}`}
            src={avatarSrc || undefined}
          >
            {!avatarSrc && getUserInitials()}
          </Avatar>
          <Box>
            <Typography variant="h5" gutterBottom>
              {formData.firstName} {formData.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {formData.email}
            </Typography>
            <Button
              component="label"
              startIcon={<PhotoCamera />}
              sx={{ mt: 1 }}
            >
              Change Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handlePhotoUpload}
              />
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Profile updated successfully!</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Gender"
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Fitness Level"
                name="fitnessLevel"
                value={formData.fitnessLevel || 'beginner'}
                onChange={handleChange}
              >
                {fitnessLevels.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;