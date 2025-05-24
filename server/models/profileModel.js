const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  weight: {
    type: Number,
  },
  height: {
    type: Number,
  },
  bodyFat: {
    type: Number,
  },
  chest: {
    type: Number,
  },
  waist: {
    type: Number,
  },
  hips: {
    type: Number,
  },
  arms: {
    type: Number,
  },
  thighs: {
    type: Number,
  },
  notes: {
    type: String,
  },
});

const goalSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Goal type is required'],
    enum: ['weight', 'strength', 'endurance', 'habit', 'nutrition', 'custom'],
  },
  targetValue: {
    type: Number,
  },
  currentValue: {
    type: Number,
  },
  unit: {
    type: String,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required'],
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active',
  },
});

const progressPhotoSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  photoUrl: {
    type: String,
    required: [true, 'Photo URL is required'],
  },
  category: {
    type: String,
    enum: ['front', 'side', 'back', 'custom'],
    default: 'front',
  },
  notes: {
    type: String,
  },
});

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    goals: [goalSchema],
    measurements: [measurementSchema],
    progressPhotos: [progressPhotoSchema],
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
