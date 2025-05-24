const mongoose = require('mongoose');

const scheduledWorkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    scheduledFor: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
    },
    notes: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    workoutSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutSession',
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying upcoming workouts
scheduledWorkoutSchema.index({ user: 1, scheduledFor: 1 });

module.exports = mongoose.model('ScheduledWorkout', scheduledWorkoutSchema);
