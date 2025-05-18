# Fitness Application Database Models Documentation

This document provides comprehensive information about the database models used in the fitness application. The application uses MongoDB with Mongoose as the ODM (Object Document Mapper).

## Table of Contents

1. [User Model](#user-model)
2. [Profile Model](#profile-model)
3. [Exercise Model](#exercise-model)
4. [Workout Model](#workout-model)
5. [Workout Session Model](#workout-session-model)
6. [Nutrition Item Model](#nutrition-item-model)
7. [Nutrition Log Model](#nutrition-log-model)
8. [Notification Model](#notification-model)
9. [Model Relationships](#model-relationships)

---

## User Model

The User model stores basic user information and authentication details.

### Schema Definition

```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer not to say']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  preferences: {
    darkMode: {
      type: Boolean,
      default: false
    },
    notifications: {
      workoutReminders: {
        type: Boolean,
        default: true
      },
      goalMilestones: {
        type: Boolean,
        default: true
      },
      nutritionReminders: {
        type: Boolean,
        default: true
      }
    },
    measurementUnit: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric'
    }
  }
}, {
  timestamps: true
});
```

### Key Features

- **Password Security**: Passwords are automatically hashed using bcrypt before saving to the database.
- **Authentication Helper**: Includes `matchPassword` method to compare entered passwords with stored hashed passwords.
- **Email Validation**: Validates email format using regex pattern.
- **User Preferences**: Stores user preferences for app appearance, notifications, and measurement units.

### Middleware

- **Pre-save Hook**: Automatically hashes passwords when they are modified.

### Methods

- **matchPassword(enteredPassword)**: Compares an entered password with the stored hashed password.

---

## Profile Model

The Profile model extends user information with fitness-specific data like measurements, goals, and progress photos.

### Schema Definition

**Measurement Schema**:
```javascript
const measurementSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  weight: {
    type: Number
  },
  height: {
    type: Number
  },
  bodyFat: {
    type: Number
  },
  chest: {
    type: Number
  },
  waist: {
    type: Number
  },
  hips: {
    type: Number
  },
  arms: {
    type: Number
  },
  thighs: {
    type: Number
  },
  notes: {
    type: String
  }
});
```

**Goal Schema**:
```javascript
const goalSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Goal type is required'],
    enum: ['weight', 'strength', 'endurance', 'habit', 'nutrition', 'custom']
  },
  targetValue: {
    type: Number
  },
  currentValue: {
    type: Number
  },
  unit: {
    type: String
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  }
});
```

**Progress Photo Schema**:
```javascript
const progressPhotoSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  photoUrl: {
    type: String,
    required: [true, 'Photo URL is required']
  },
  category: {
    type: String,
    enum: ['front', 'side', 'back', 'custom'],
    default: 'front'
  },
  notes: {
    type: String
  }
});
```

**Profile Schema**:
```javascript
const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  goals: [goalSchema],
  measurements: [measurementSchema],
  progressPhotos: [progressPhotoSchema]
}, {
  timestamps: true
});
```

### Key Features

- **One-to-One Relationship**: Each profile is linked to exactly one user through `userId`.
- **Historical Data**: Stores measurement history as a time series.
- **Goal Tracking**: Supports various fitness goals with progress tracking.
- **Progress Photos**: Organizes progress photos by d