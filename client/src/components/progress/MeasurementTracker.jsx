// src/components/progress/MeasurementsTracker.jsx
import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Timeline as TimelineIcon,
  MonitorWeight as WeightIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const MeasurementsTracker = () => {
  const theme = useTheme();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
    notes: ''
  });
  const [chartMetric, setChartMetric] = useState('weight');

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/profiles/measurements');
      if (response.data.success) {
        // Sort by date (newest first)
        const sortedMeasurements = response.data.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setMeasurements(sortedMeasurements);
      } else {
        throw new Error(response.data.error?.message || 'Failed to fetch measurements');
      }
    } catch (err) {
      console.error('Error fetching measurements:', err);
      setError('Failed to load your measurements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (measurement = null) => {
    if (measurement) {
      // For editing, convert date to YYYY-MM-DD format for date input
      const date = new Date(measurement.date);
      const formattedDate = date.toISOString().split('T')[0];
      
      setFormData({
        date: formattedDate,
        weight: measurement.weight || '',
        height: measurement.height || '',
        bodyFat: measurement.bodyFat || '',
        chest: measurement.chest || '',
        waist: measurement.waist || '',
        hips: measurement.hips || '',
        arms: measurement.arms || '',
        thighs: measurement.thighs || '',
        notes: measurement.notes || ''
      });
      setSelectedMeasurement(measurement);
    } else {
      // For adding new, reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        height: '',
        bodyFat: '',
        chest: '',
        waist: '',
        hips: '',
        arms: '',
        thighs: '',
        notes: ''
      });
      setSelectedMeasurement(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Filter out empty values
      const dataToSubmit = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== '')
      );

      let response;
      if (selectedMeasurement) {
        // Update existing measurement
        response = await axios.put(
          `/api/profiles/measurements/${selectedMeasurement._id}`,
          dataToSubmit
        );
      } else {
        // Add new measurement
        response = await axios.post('/api/profiles/measurements', dataToSubmit);
      }

      if (response.data.success) {
        fetchMeasurements();
        handleCloseDialog();
      } else {
        throw new Error(response.data.error?.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Error saving measurement:', err);
      setError('Failed to save measurement data. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this measurement?')) {
      try {
        const response = await axios.delete(`/api/profiles/measurements/${id}`);
        if (response.data.success) {
          setMeasurements(measurements.filter(m => m._id !== id));
        } else {
          throw new Error(response.data.error?.message || 'Delete failed');
        }
      } catch (err) {
        console.error('Error deleting measurement:', err);
        setError('Failed to delete measurement. Please try again.');
      }
    }
  };

  const prepareChartData = () => {
    if (!measurements.length) return [];
    
    // Sort by date (oldest first for charts)
    const sortedData = [...measurements].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    return sortedData.map(m => ({
      date: format(new Date(m.date), 'MMM dd'),
      [chartMetric]: m[chartMetric] || null
    }));
  };

  const getMetricLabel = () => {
    switch (chartMetric) {
      case 'weight': return 'Weight';
      case 'bodyFat': return 'Body Fat %';
      case 'chest': return 'Chest';
      case 'waist': return 'Waist';
      case 'hips': return 'Hips';
      case 'arms': return 'Arms';
      case 'thighs': return 'Thighs';
      default: return chartMetric;
    }
  };

  const getMetricUnit = () => {
    // You can customize units based on user preferences in the future
    switch (chartMetric) {
      case 'weight': return 'kg';
      case 'bodyFat': return '%';
      case 'height': return 'cm';
      default: return 'cm';
    }
  };

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
          Body Measurements Tracker
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Measurement
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Measurements Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <TimelineIcon sx={{ mr: 1 }} />
                {getMetricLabel()} Trend
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant={chartMetric === 'weight' ? 'contained' : 'outlined'}
                  onClick={() => setChartMetric('weight')}
                  size="small"
                >
                  Weight
                </Button>
                <Button 
                  variant={chartMetric === 'bodyFat' ? 'contained' : 'outlined'}
                  onClick={() => setChartMetric('bodyFat')}
                  size="small"
                >
                  Body Fat
                </Button>
                <Button 
                  variant={chartMetric === 'waist' ? 'contained' : 'outlined'}
                  onClick={() => setChartMetric('waist')}
                  size="small"
                >
                  Waist
                </Button>
                <Button 
                  variant={chartMetric === 'chest' ? 'contained' : 'outlined'}
                  onClick={() => setChartMetric('chest')}
                  size="small"
                >
                  Chest
                </Button>
              </Box>
            </Box>
            
            {measurements.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={prepareChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    label={{ 
                      value: `${getMetricLabel()} (${getMetricUnit()})`, 
                      angle: -90, 
                      position: 'insideLeft' 
                    }} 
                  />
                  <Tooltip formatter={(value) => [`${value} ${getMetricUnit()}`, getMetricLabel()]} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={chartMetric} 
                    name={getMetricLabel()} 
                    stroke={theme.palette.primary.main} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <WeightIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  No measurement data yet. Add your first measurement to see the chart.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Measurements Table */}
        <Grid item xs={12}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell>Body Fat %</TableCell>
                    <TableCell>Chest</TableCell>
                    <TableCell>Waist</TableCell>
                    <TableCell>Hips</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {measurements.length > 0 ? (
                    measurements.map((m) => (
                      <TableRow key={m._id}>
                        <TableCell>
                          {format(new Date(m.date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>{m.weight ? `${m.weight} kg` : '-'}</TableCell>
                        <TableCell>{m.bodyFat ? `${m.bodyFat}%` : '-'}</TableCell>
                        <TableCell>{m.chest ? `${m.chest} cm` : '-'}</TableCell>
                        <TableCell>{m.waist ? `${m.waist} cm` : '-'}</TableCell>
                        <TableCell>{m.hips ? `${m.hips} cm` : '-'}</TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenDialog(m)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDelete(m._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No measurements recorded yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Add/Edit Measurement Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedMeasurement ? 'Edit Measurement' : 'Add New Measurement'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                name="weight"
                type="number"
                inputProps={{ step: 0.1 }}
                value={formData.weight}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Body Fat %"
                name="bodyFat"
                type="number"
                inputProps={{ step: 0.1 }}
                value={formData.bodyFat}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Height (cm)"
                name="height"
                type="number"
                inputProps={{ step: 0.1 }}
                value={formData.height}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Chest (cm)"
                name="chest"
                type="number"
                inputProps={{ step: 0.1 }}
                value={formData.chest}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Waist (cm)"
                name="waist"
                type="number"
                inputProps={{ step: 0.1 }}
                value={formData.waist}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hips (cm)"
                name="hips"
                type="number"
                inputProps={{ step: 0.1 }}
                value={formData.hips}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Arms (cm)"
                name="arms"
                type="number"
                inputProps={{ step: 0.1 }}
                value={formData.arms}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Thighs (cm)"
                name="thighs"
                type="number"
                inputProps={{ step: 0.1 }}
                value={formData.thighs}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={2}
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedMeasurement ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MeasurementsTracker;