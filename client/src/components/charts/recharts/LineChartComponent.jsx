// src/components/charts/recharts/LineChartComponent.jsx
import { useTheme } from '@mui/material/styles';
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
import { Paper, Typography, Box } from '@mui/material';

const LineChartComponent = ({ 
  data = [], 
  title = 'Workout Progress',
  xDataKey = 'name',
  lineDataKey = 'value',
  lineColor = null, // If null, will use theme primary color
  height = 400
}) => {
  const theme = useTheme();
  
  // Use theme colors if custom color not provided
  const chartLineColor = lineColor || theme.palette.primary.main;
  
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
          <LineChart
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
            <Line
              type="monotone"
              dataKey={lineDataKey}
              stroke={chartLineColor}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default LineChartComponent;