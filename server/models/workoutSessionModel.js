const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  weight: {
    type: Number,
  },
  reps: {
    type: Number,
  },
  duration: {
    type: Number, // for time-based exercises
  },
  completed: {
    type: Boolean,
    default: true,
  },
});

const completedExerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
  },
  sets: [setSchema],
  notes: {
    type: String,
  },
});

const workoutSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    duration: {
      type: Number, // actual duration in minutes
      required: true,
    },
    completedExercises: [completedExerciseSchema],
    caloriesBurned: {
      type: Number,
    },
    rating: {
      type: Number, // User rating of the workout session (1-5)
      min: 1,
      max: 5,
    },
    difficulty: {
      type: Number, // User rating of difficulty (1-5)
      min: 1,
      max: 5,
    },
    notes: {
      type: String,
    },
    mood: {
      type: String,
      enum: [
        'energized',
        'tired',
        'strong',
        'weak',
        'neutral',
        'sore',
        'proud',
        'disappointed',
      ],
    },
  },
  {
    timestamps: true,
  }
);

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);

module.exports = WorkoutSession;
