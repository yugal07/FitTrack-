const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const {
  notFound,
  errorHandler,
  validationErrorHandler,
} = require('./middleware/errorMiddleware');
const path = require('path');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Only use morgan in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Email configuration logging (for debugging)
if (process.env.EMAIL_FROM) {
  console.log('🔧 Setting up Gmail transporter...');
  console.log('📧 Email From:', process.env.EMAIL_FROM);
}

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const goalRoutes = require('./routes/goalRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const workoutSessionRoutes = require('./routes/workoutSessionRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminNutritionRoutes = require('./routes/adminNutritionRoutes');

// Mount routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/profiles', profileRoutes);
app.use('/goals', goalRoutes);
app.use('/exercises', exerciseRoutes);
app.use('/workouts', workoutRoutes);
app.use('/workout-sessions', workoutSessionRoutes);
app.use('/nutrition', nutritionRoutes);
app.use('/uploads', uploadRoutes);
app.use('/notifications', notificationRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/nutrition', adminNutritionRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Fitness API is running',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(validationErrorHandler);
app.use(notFound);
app.use(errorHandler);

// Start notification schedulers only in non-test environment
if (process.env.NODE_ENV !== 'test') {
  try {
    const {
      startNotificationSchedulers,
    } = require('./services/notificationScheduler');
    startNotificationSchedulers();
  } catch (error) {
    console.error('Error starting notification schedulers:', error);
  }
}

// Export the Express app for Vercel
module.exports = app;
