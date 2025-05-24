const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { Exercise, Workout, User, Profile } = require('../models');
const exerciseData = require('./data/exercises');
const workoutData = require('./data/workouts');
const userData = require('./data/users');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Hash password helper function
const hashPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Import all data
const importData = async () => {
  try {
    // Clear existing data
    console.log('Clearing previous seed data...');
    await Exercise.deleteMany();
    await Workout.deleteMany({ isCustom: false }); // Only delete preset workouts

    // Check if we should reset users
    const resetUsers = process.argv.includes('--reset-users');
    if (resetUsers) {
      console.log('Resetting users and profiles...');
      await User.deleteMany();
      await Profile.deleteMany();
    }

    // Create seed users
    console.log('Creating seed users...');

    // Get existing emails to avoid duplicates
    const existingEmails = resetUsers
      ? []
      : (await User.find({}).select('email')).map(user => user.email);

    // Filter out users that already exist
    const newUsers = userData.filter(
      user => !existingEmails.includes(user.email)
    );

    // Hash passwords for all new users
    const usersWithHashedPasswords = await Promise.all(
      newUsers.map(async user => {
        const hashedPassword = await hashPassword(user.password);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    let adminUser;
    if (usersWithHashedPasswords.length > 0) {
      // Create users with hashed passwords
      const createdUsers = await User.insertMany(usersWithHashedPasswords);
      console.log(`${createdUsers.length} users created successfully`);

      // Create profiles for the new users
      const profiles = createdUsers.map(user => ({
        userId: user._id,
        goals: [],
        measurements: [],
        progressPhotos: [],
      }));

      await Profile.insertMany(profiles);
      console.log(`${profiles.length} user profiles created`);

      // Find admin user from created users
      adminUser = createdUsers.find(
        user => user.email === 'admin@fittrack.com'
      );
    }

    // If admin user wasn't created now, try to find existing admin
    if (!adminUser) {
      adminUser = await User.findOne({ email: 'admin@fittrack.com' });
      if (!adminUser) {
        throw new Error(
          'Admin user not found! Make sure admin@fittrack.com exists in the seed data'
        );
      }
    }

    // Seed exercises
    console.log('Creating exercises...');
    const createdExercises = await Exercise.insertMany(exerciseData);
    console.log(`${createdExercises.length} exercises created`);

    // Add exercise IDs to workout data and set admin as creator
    const workouts = workoutData.map(workout => {
      // Map exercise names to actual exercise IDs
      const updatedExercises = workout.exercises.map((ex, index) => {
        const exercise = createdExercises.find(e => e.name === ex.exerciseName);
        if (!exercise) {
          throw new Error(
            `Exercise ${ex.exerciseName} not found in created exercises`
          );
        }
        return {
          exerciseId: exercise._id,
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          restTime: ex.restTime,
          order: index + 1,
        };
      });

      return {
        ...workout,
        exercises: updatedExercises,
        createdBy: adminUser._id,
      };
    });

    // Add workouts
    console.log('Creating workouts...');
    const createdWorkouts = await Workout.insertMany(workouts);
    console.log(`${createdWorkouts.length} workouts created`);

    console.log('Seed data import complete!');

    // Provide login info for created users if any new users were created
    if (usersWithHashedPasswords.length > 0) {
      console.log('\nSeed users created with the following credentials:');
      userData.forEach(user => {
        if (newUsers.some(newUser => newUser.email === user.email)) {
          console.log(
            `- ${user.firstName} ${user.lastName} (${user.email}): password123`
          );
        }
      });
    }

    process.exit();
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

// Delete all data
const destroyData = async () => {
  try {
    await Exercise.deleteMany();
    await Workout.deleteMany({ isCustom: false }); // Only delete preset workouts

    // Only delete users if flag is provided
    if (process.argv.includes('--reset-users')) {
      await User.deleteMany();
      await Profile.deleteMany();
      console.log('Users and profiles destroyed!');
    }

    console.log('Seed data destroyed!');
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
