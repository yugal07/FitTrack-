const mongoose = require('mongoose');

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

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  muscleGroups: {
    type: [String],
    required: [true, 'At least one muscle group is required'],
    enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'full body', 'cardio']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  instructions: {
    type: String,
    required: [true, 'Instructions are required']
  },
  videoUrl: {
    type: String
  },
  imageUrl: {
    type: String
  },
  equipment: {
    type: [String],
    default: []
  },
  averageRating: {
    type: Number,
    default: 0
  },
  ratings: [ratingSchema]
}, {
  timestamps: true
});

// Calculate average rating before saving
exerciseSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((acc, item) => acc + item.rating, 0) / this.ratings.length;
  }
  next();
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;