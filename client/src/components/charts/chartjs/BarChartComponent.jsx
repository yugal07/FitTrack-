// src/components/charts/chartjs/BarChartComponent.jsx
import { useTheme } from '@mui/material/styles';
import { Paper, Typography, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChartComponent = ({
  data = [],
  title = 'Weekly Activity',
  xAxisLabel = 'Categories',
  yAxisLabel = 'Value',
  barColor = null, // If null, will use theme secondary color
  height = 400
}) => {
  const theme = useTheme();
  
  // Use theme colors if custom color not provided
  const chartBarColor = barColor || theme.palette.secondary.main;
  const gridColor = theme.palette.divider;
  const textColor = theme.palette.text.secondary;
  
  // Empty state handling
  if (!data || data.length === 0) {
    return (
      <Paper 
        sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No data available to display
        </Typography>
      </Paper>
    );
  }

  // Extract labels and values from data
  const labels = data.map(item => item.name || '');
  const values = data.map(item => item.value || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: yAxisLabel,
        data: values,
        backgroundColor: chartBarColor,
        borderColor: `${chartBarColor}80`, // 80% opacity
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisLabel,
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
    },
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default BarChartComponent;