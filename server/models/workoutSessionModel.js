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
  restTime: {
    type: Number, // rest time in seconds - added for WorkoutLogger
  },
  timestamp: {
    type: Date,
    default: Date.now, // added for WorkoutLogger
  }
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
  // Added fields for WorkoutLogger compatibility
  isCompleted: {
    type: Boolean,
    default: false,
  },
  targetSets: {
    type: Number,
    default: 0,
  },
  targetReps: {
    type: Number,
    default: 0,
  },
  targetWeight: {
    type: Number,
    default: 0,
  }
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
      required: false, // Changed from true to false
      default: null,   // Added default null
    },
    // Added fields for WorkoutLogger
    name: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['strength', 'cardio', 'hiit', 'flexibility', 'hybrid', 'custom'],
      default: 'custom',
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
    // Added for WorkoutLogger compatibility
    feeling: {
      type: Number, // 1-5 scale, maps to difficulty
      min: 1,
      max: 5,
    },
    // Metadata for scheduled workouts
    scheduledWorkoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ScheduledWorkout',
      default: null,
    },
    source: {
      type: String,
      enum: ['manual', 'scheduled', 'logger', 'imported'],
      default: 'manual',
    }
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
workoutSessionSchema.index({ userId: 1, date: -1 });
workoutSessionSchema.index({ userId: 1, workoutId: 1 });

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);

module.exports = WorkoutSession;