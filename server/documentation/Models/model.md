# Fitness Application Database Models Documentation

This document provides comprehensive documentation for the MongoDB database models used in the fitness application. The application uses Mongoose as the Object Document Mapper (ODM).

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

- **Password Security**: Passwords are automatically hashed using bcrypt before saving to the database
- **Authentication Helper**: Includes `matchPassword` method to compare entered passwords with stored hashed passwords
- **Email Validation**: Validates email format using regex pattern
- **User Preferences**: Stores user preferences for app appearance, notifications, and measurement units

### Middleware

- **Pre-save Hook**: Automatically hashes passwords when they are modified

### Methods

- **matchPassword(enteredPassword)**: Compares an entered password with the stored hashed password

---

## Profile Model

The Profile model extends user information with fitness-specific data like measurements, goals, and progress photos.

### Schema Definition

#### Measurement Schema:
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

#### Goal Schema:
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

#### Progress Photo Schema:
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

#### Profile Schema:
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

- **One-to-One Relationship**: Each profile is linked to exactly one user through `userId`
- **Historical Data**: Stores measurement history as a time series
- **Goal Tracking**: Supports various fitness goals with progress tracking
- **Progress Photos**: Organizes progress photos by date and category

---

## Exercise Model

The Exercise model stores information about individual exercises that can be added to workouts.

### Schema Definition

#### Rating Schema:
```javascript
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
```

#### Exercise Schema:
```javascript
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
```

### Key Features

- **Media Support**: Stores URLs for instructional videos and images
- **Rating System**: Users can rate and review exercises
- **Equipment Tracking**: Lists required equipment for each exercise
- **Muscle Group Categorization**: Associates exercises with specific muscle groups

### Middleware

- **Pre-save Hook**: Automatically calculates average rating from user ratings

---

## Workout Model

The Workout model defines structured workout routines composed of multiple exercises.

### Schema Definition

#### Workout Exercise Schema:
```javascript
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
```

#### Rating Schema:
```javascript
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
```

#### Workout Schema:
```javascript
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
```

### Key Features

- **Exercise Sequencing**: Orders exercises in a specific sequence with the `order` field
- **Workout Types**: Categorizes workouts by type (strength, cardio, etc.)
- **Difficulty Levels**: Assigns fitness levels to workouts
- **Rating System**: Users can rate and review workouts
- **Custom Workouts**: Supports both system-defined and user-created custom workouts
- **Exercise Configuration**: Defines sets, reps, and rest times for each exercise

### Middleware

- **Pre-save Hook**: Automatically calculates average rating from user ratings

---

## Workout Session Model

The Workout Session model tracks individual workout performances completed by users.

### Schema Definition

#### Set Schema:
```javascript
const setSchema = new mongoose.Schema({
  weight: {
    type: Number
  },
  reps: {
    type: Number
  },
  duration: {
    type: Number // for time-based exercises
  },
  completed: {
    type: Boolean,
    default: true
  }
});
```

#### Completed Exercise Schema:
```javascript
const completedExerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  sets: [setSchema],
  notes: {
    type: String
  }
});
```

#### Workout Session Schema:
```javascript
const workoutSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  duration: {
    type: Number, // actual duration in minutes
    required: true
  },
  completedExercises: [completedExerciseSchema],
  caloriesBurned: {
    type: Number
  },
  rating: {
    type: Number, // User rating of the workout session (1-5)
    min: 1,
    max: 5
  },
  difficulty: {
    type: Number, // User rating of difficulty (1-5)
    min: 1,
    max: 5
  },
  notes: {
    type: String
  },
  mood: {
    type: String,
    enum: ['energized', 'tired', 'strong', 'weak', 'neutral', 'sore', 'proud', 'disappointed']
  }
}, {
  timestamps: true
});
```

### Key Features

- **Performance Tracking**: Records actual performance (weights, reps, duration) for each set
- **Subjective Feedback**: Captures user rating, perceived difficulty, and mood
- **Exercise Completion**: Tracks which exercises and sets were completed
- **Calorie Estimation**: Records estimated calories burned during the workout
- **Workout Journal**: Supports user notes for each session

---

## Nutrition Item Model

The Nutrition Item model stores information about food items that can be added to nutrition logs.

### Schema Definition

```javascript
const nutritionItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['protein', 'carbs', 'fat', 'fruit', 'vegetable', 'dairy', 'other']
  },
  servingSize: {
    type: Number,
    required: true
  },
  servingUnit: {
    type: String,
    required: true,
    enum: ['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece']
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});
```

### Key Features

- **Food Categories**: Organizes foods by category
- **Nutritional Data**: Stores calorie and macronutrient information
- **Serving Information**: Defines serving sizes and units
- **User-Created Items**: Tracks which user created each food item

---

## Nutrition Log Model

The Nutrition Log model tracks daily food intake and nutritional statistics.

### Schema Definition

#### Food Schema:
```javascript
const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  unit: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    default: 0
  },
  carbs: {
    type: Number,
    default: 0
  },
  fat: {
    type: Number,
    default: 0
  }
});
```

#### Meal Schema:
```javascript
const mealSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  time: {
    type: Date,
    default: Date.now
  },
  foods: [foodSchema],
  notes: {
    type: String
  }
});
```

#### Nutrition Log Schema:
```javascript
const nutritionLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  meals: [mealSchema],
  waterIntake: {
    type: Number, // in ml
    default: 0
  },
  totalCalories: {
    type: Number,
    default: 0
  },
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFat: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});
```

### Key Features

- **Meal Organization**: Groups foods into meals by type (breakfast, lunch, dinner, snack)
- **Hydration Tracking**: Records water intake
- **Nutritional Totals**: Automatically calculates daily totals for calories and macronutrients
- **Daily Journal**: Supports user notes for each day's nutrition

### Middleware

- **Pre-save Hook**: Automatically calculates total calories and macronutrients from meals

---

## Notification Model

The Notification model manages system and user-generated notifications.

### Schema Definition

```javascript
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['workout', 'goal', 'nutrition', 'system']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  actionLink: {
    type: String
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  }
}, {
  timestamps: true
});
```

### Key Features

- **Notification Types**: Categorizes notifications by type (workout, goal, nutrition, system)
- **Read Status**: Tracks whether notifications have been read
- **Action Links**: Supports deep linking to relevant app sections
- **Related Items**: Links notifications to related database objects via `relatedId`

---

## Model Relationships

The fitness application's data model maintains the following relationships between collections:

### One-to-One Relationships

- **User ↔ Profile**: Each user has exactly one profile (1:1)

### One-to-Many Relationships

- **User → Notifications**: A user can have multiple notifications (1:N)
- **User → Workout Sessions**: A user can complete multiple workout sessions (1:N)
- **User → Nutrition Logs**: A user can have multiple nutrition logs (1:N)
- **User → Nutrition Items**: A user can create multiple nutrition items (1:N)
- **User → Workouts**: A user can create multiple workouts (1:N)
- **Workout → Workout Sessions**: A workout template can be used in multiple workout sessions (1:N)
- **Exercise → Workout Exercise**: An exercise can be included in multiple workout exercises (1:N)

### Many-to-Many Relationships

- **Exercise ↔ Workout**: Exercises can be part of multiple workouts, and workouts contain multiple exercises (M:N)
- **User ↔ Exercise Ratings**: Users can rate multiple exercises, and exercises can be rated by multiple users (M:N)
- **User ↔ Workout Ratings**: Users can rate multiple workouts, and workouts can be rated by multiple users (M:N)

### Nested Document Relationships

- **Profile → Goals**: Goals are stored as nested documents within a profile
- **Profile → Measurements**: Measurements are stored as nested documents within a profile
- **Profile → Progress Photos**: Progress photos are stored as nested documents within a profile
- **Nutrition Log → Meals → Foods**: Foods are nested within meals, which are nested within nutrition logs
- **Workout Session → Completed Exercises → Sets**: Sets are nested within completed exercises, which are nested within workout sessions
