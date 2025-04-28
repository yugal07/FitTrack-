// src/components/progress/PhotoComparison.jsx
import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  useTheme,
} from '@mui/material';
import { 
  PhotoCamera,
  Delete as DeleteIcon,
  CompareArrows as CompareIcon,
  Add as AddIcon,
  PhotoLibrary as PhotoLibraryIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

const PhotoComparison = () => {
  const theme = useTheme();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openComparisonDialog, setOpenComparisonDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [photoCategory, setPhotoCategory] = useState('front');
  const [photoNotes, setPhotoNotes] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [comparisonPhotos, setComparisonPhotos] = useState({
    before: null,
    after: null
  });
  const [selectedCategory, setSelectedCategory] = useState('front');

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/profiles/progress-photos');
      if (response.data.success) {
        // Sort by date (newest first)
        const sortedPhotos = response.data.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setPhotos(sortedPhotos);
      } else {
        throw new Error(response.data.error?.message || 'Failed to fetch photos');
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Failed to load your progress photos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadOpen = () => {
    setOpenUploadDialog(true);
  };

  const handleUploadClose = () => {
    setOpenUploadDialog(false);
    setUploadFile(null);
    setPhotoCategory('front');
    setPhotoNotes('');
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setUploadFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      return;
    }

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('category', photoCategory);
      formData.append('notes', photoNotes);

      const response = await axios.post('/api/uploads/progress-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        fetchPhotos();
        handleUploadClose();
      } else {
        throw new Error(response.data.error?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        const response = await axios.delete(`/api/uploads/progress-photo/${photoId}`);
        if (response.data.success) {
          setPhotos(photos.filter(photo => photo._id !== photoId));
        } else {
          throw new Error(response.data.error?.message || 'Delete failed');
        }
      } catch (err) {
        console.error('Error deleting photo:', err);
        setError('Failed to delete photo. Please try again.');
      }
    }
  };

  const handleComparisonOpen = () => {
    // Initialize comparison with oldest and newest photos of selected category
    const categoryPhotos = photos.filter(photo => photo.category === selectedCategory);
    
    if (categoryPhotos.length >= 2) {
      // Sort by date
      const sortedPhotos = [...categoryPhotos].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      
      setComparisonPhotos({
        before: sortedPhotos[0],
        after: sortedPhotos[sortedPhotos.length - 1]
      });
    } else {
      setComparisonPhotos({
        before: null,
        after: null
      });
    }
    
    setOpenComparisonDialog(true);
  };

  const handleComparisonClose = () => {
    setOpenComparisonDialog(false);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSelectBeforePhoto = (event) => {
    const photoId = event.target.value;
    const photo = photos.find(p => p._id === photoId);
    setComparisonPhotos(prev => ({...prev, before: photo}));
  };

  const handleSelectAfterPhoto = (event) => {
    const photoId = event.target.value;
    const photo = photos.find(p => p._id === photoId);
    setComparisonPhotos(prev => ({...prev, after: photo}));
  };

  // Group photos by category
  const groupPhotosByCategory = () => {
    const grouped = {};
    photos.forEach(photo => {
      if (!grouped[photo.category]) {
        grouped[photo.category] = [];
      }
      grouped[photo.category].push(photo);
    });
    return grouped;
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'front': return 'Front View';
      case 'back': return 'Back View';
      case 'side': return 'Side View';
      case 'custom': return 'Custom';
      default: return category;
    }
  };

  const groupedPhotos = groupPhotosByCategory();
  const categories = Object.keys(groupedPhotos);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Progress Photo Comparison
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<CompareIcon />}
            onClick={handleComparisonOpen}
            sx={{ mr: 2 }}
            disabled={photos.length < 2}
          >
            Compare Photos
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleUploadOpen}
          >
            Upload Photo
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {photos.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <PhotoLibraryIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No progress photos yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Upload your first progress photo to start tracking your transformation
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<PhotoCamera />}
            onClick={handleUploadOpen}
          >
            Upload First Photo
          </Button>
        </Paper>
      ) : (
        <Box>
          {categories.map(category => (
            <Box key={category} sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {getCategoryLabel(category)}
              </Typography>
              <Grid container spacing={2}>
                {groupedPhotos[category].map(photo => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={photo._id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={`${process.env.VITE_API_URL || 'http://localhost:8001'}/${photo.photoUrl}`}
                        alt={`Progress photo from ${format(new Date(photo.date), 'MMM d, yyyy')}`}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="subtitle1">
                          {format(new Date(photo.date), 'MMMM d, yyyy')}
                        </Typography>
                        {photo.notes && (
                          <Typography variant="body2" color="text.secondary">
                            {photo.notes}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeletePhoto(photo._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={handleUploadClose}>
        <DialogTitle>Upload Progress Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              fullWidth
              sx={{ height: 100, borderStyle: 'dashed' }}
            >
              {uploadFile ? 'Change Photo' : 'Select Photo'}
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleFileChange}
              />
            </Button>
            {uploadFile && (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                Selected: {uploadFile.name}
              </Typography>
            )}
          </Box>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={photoCategory}
              label="Category"
              onChange={(e) => setPhotoCategory(e.target.value)}
            >
              <MenuItem value="front">Front View</MenuItem>
              <MenuItem value="back">Back View</MenuItem>
              <MenuItem value="side">Side View</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            fullWidth
            label="Notes (optional)"
            multiline
            rows={2}
            value={photoNotes}
            onChange={(e) => setPhotoNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadClose}>Cancel</Button>
          <Button 
            onClick={handleUpload} 
            variant="contained"
            disabled={!uploadFile || uploadLoading}
          >
            {uploadLoading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comparison Dialog */}
      <Dialog
        open={openComparisonDialog}
        onClose={handleComparisonClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Photo Comparison</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Photo Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Photo Category"
                onChange={handleCategoryChange}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {getCategoryLabel(category)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom align="center">
                Before
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Before Photo</InputLabel>
                <Select
                  value={comparisonPhotos.before?._id || ''}
                  label="Select Before Photo"
                  onChange={handleSelectBeforePhoto}
                >
                  {photos
                    .filter(photo => photo.category === selectedCategory)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(photo => (
                      <MenuItem key={photo._id} value={photo._id}>
                        {format(new Date(photo.date), 'MMMM d, yyyy')}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              {comparisonPhotos.before ? (
                <Box>
                  <Box
                    component="img"
                    src={`${process.env.VITE_API_URL || 'http://localhost:8001'}/${comparisonPhotos.before.photoUrl}`}
                    alt="Before photo"
                    sx={{
                      width: '100%',
                      height: 300,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                  <Typography variant="subtitle1" align="center" sx={{ mt: 1 }}>
                    {format(new Date(comparisonPhotos.before.date), 'MMMM d, yyyy')}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    bgcolor: 'action.disabledBackground',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1
                  }}
                >
                  <Typography color="text.secondary">
                    No photo selected
                  </Typography>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom align="center">
                After
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select After Photo</InputLabel>
                <Select
                  value={comparisonPhotos.after?._id || ''}
                  label="Select After Photo"
                  onChange={handleSelectAfterPhoto}
                >
                  {photos
                    .filter(photo => photo.category === selectedCategory)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(photo => (
                      <MenuItem key={photo._id} value={photo._id}>
                        {format(new Date(photo.date), 'MMMM d, yyyy')}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              {comparisonPhotos.after ? (
                <Box>
                  <Box
                    component="img"
                    src={`${process.env.VITE_API_URL || 'http://localhost:8001'}/${comparisonPhotos.after.photoUrl}`}
                    alt="After photo"
                    sx={{
                      width: '100%',
                      height: 300,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                  <Typography variant="subtitle1" align="center" sx={{ mt: 1 }}>
                    {format(new Date(comparisonPhotos.after.date), 'MMMM d, yyyy')}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    bgcolor: 'action.disabledBackground',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1
                  }}
                >
                  <Typography color="text.secondary">
                    No photo selected
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>

          {comparisonPhotos.before && comparisonPhotos.after && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Days Between Photos: {
                  Math.floor((new Date(comparisonPhotos.after.date) - new Date(comparisonPhotos.before.date)) / (1000 * 60 * 60 * 24))
                }
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Continue your fitness journey and keep documenting your progress regularly for the best results.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleComparisonClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PhotoComparison;