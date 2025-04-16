const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler, validationErrorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const goalRoutes = require('./routes/goalRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const workoutSessionRoutes = require('./routes/workoutSessionRoutes');
const nutritionRoutes = require("./routes/nutritionRoutes");

// mounting routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/workout-sessions', workoutSessionRoutes);
app.use('/api/nutrition' , nutritionRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'hahaha' });
});

app.use(validationErrorHandler);
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log("got your server running B");
});