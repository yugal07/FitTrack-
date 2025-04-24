const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Exercise, Workout, User } = require('../models');
const exerciseData = require('./data/exercises');
const workoutData = require('./data/workouts');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import all data
const importData = async () => {
  try {
    // Clear existing data
    await Exercise.deleteMany();
    await Workout.deleteMany({isCustom: false}); // Only delete preset workouts
    
    console.log('Data cleared...');

    // Create admin user if not exists
    let adminUser = await User.findOne({ email: 'admin@fittrack.com' });
    
    if (!adminUser) {
      adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@fittrack.com',
        password: 'admin123',
        role: 'admin',
        fitnessLevel: 'advanced'
      });
      console.log('Admin user created...');
    }

    // Add exercises
    const createdExercises = await Exercise.insertMany(exerciseData);
    console.log(`${createdExercises.length} exercises imported`);
    
    // Add exercise IDs to workout data and set admin as creator
    const workouts = workoutData.map(workout => {
      // Map exercise names to actual exercise IDs
      const updatedExercises = workout.exercises.map((ex, index) => {
        const exercise = createdExercises.find(e => e.name === ex.exerciseName);
        return {
          exerciseId: exercise._id,
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          restTime: ex.restTime,
          order: index + 1
        };
      });
      
      return {
        ...workout,
        exercises: updatedExercises,
        createdBy: adminUser._id
      };
    });
    
    // Add workouts
    const createdWorkouts = await Workout.insertMany(workouts);
    console.log(`${createdWorkouts.length} workouts imported`);

    console.log('Data import complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data
const destroyData = async () => {
  try {
    await Exercise.deleteMany();
    await Workout.deleteMany({isCustom: false}); // Only delete preset workouts
    
    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Execute based on command argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}