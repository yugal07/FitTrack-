// src/components/charts/recharts/BarChartComponent.jsx
import { useTheme } from '@mui/material/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const BarChartComponent = ({
  data = [],
  title = 'Workout Volume',
  xDataKey = 'name',
  barDataKey = 'value',
  barColor = null, // If null, will use theme secondary color
  height = 400
}) => {
  const theme = useTheme();
  
  // Use theme colors if custom color not provided
  const chartBarColor = barColor || theme.palette.secondary.main;
  
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

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.palette.divider}
            />
            <XAxis 
              dataKey={xDataKey} 
              stroke={theme.palette.text.secondary}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary,
              }}
            />
            <Legend />
            <Bar 
              dataKey={barDataKey} 
              fill={chartBarColor} 
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default BarChartComponent;