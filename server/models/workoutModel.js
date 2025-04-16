// Schema for workout
const mongoose = require('mongoose');

const workoutExerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  sets: {
    type: Number,
    default: 3
  },
  reps: {
    type: Number,
    default: 10
  },
  duration: {
    type: Number // in seconds, for time-based exercises
  },
  restTime: {
    type: Number, // in seconds
    default: 60
  },
  order: {
    type: Number,
    required: true
  }
});

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['strength', 'cardio', 'flexibility', 'hybrid', 'hiit', 'custom']
  },
  fitnessLevel: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  exercises: [workoutExerciseSchema],
  averageRating: {
    type: Number,
    default: 0
  },
  ratings: [ratingSchema],
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Calculate average rating before saving
workoutSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((acc, item) => acc + item.rating, 0) / this.ratings.length;
  }
  next();
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;