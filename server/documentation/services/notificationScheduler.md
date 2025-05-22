# Notification Scheduler Service

## Overview

The Notification Scheduler Service is a core component of the fitness application that handles automated notifications for users. It uses `node-cron` to schedule and execute notification tasks at specific times throughout the day, helping users stay engaged with their fitness and nutrition goals.

## Features

- **Workout Reminders**: Daily notifications to encourage workout activity
- **Nutrition Reminders**: Daily prompts for nutrition logging
- **Goal Achievement Notifications**: Automatic detection and celebration of completed goals
- **Smart Scheduling**: Environment-aware scheduling with test mode support

## Dependencies

```javascript
const cron = require('node-cron');
const mongoose = require('mongoose');
const { User, Workout, WorkoutSession, NutritionLog, Profile } = require('../models');
const { 
  createWorkoutReminder, 
  createNutritionReminder, 
  createGoalAchievement, 
  createSystemNotification 
} = require('../controllers/notificationController');
```

## Scheduled Tasks

### 1. Workout Reminders

**Schedule**: Daily at 8:00 AM (`0 8 * * *`)

**Purpose**: Sends personalized workout recommendations to users who have enabled workout reminders.

**Logic**:
1. Queries users with `preferences.notifications.workoutReminders: true`
2. Analyzes user's workout history from the past 7 days
3. Recommends workouts based on:
   - User's fitness level
   - Variety (avoids recently performed workout types)
   - Fallback to any suitable workout if no variety available
4. Creates workout reminder notifications

**Smart Features**:
- Recommends different workout types to maintain variety
- Considers user's fitness level for appropriate recommendations
- Graceful fallback when specific recommendations aren't available

### 2. Nutrition Reminders

**Schedule**: Daily at 11:00 AM (`0 11 * * *`)

**Purpose**: Reminds users to log their nutrition if they haven't already done so today.

**Logic**:
1. Queries users with `preferences.notifications.nutritionReminders: true`
2. Checks if user has logged nutrition for the current day
3. Sends reminder only if no nutrition log exists for today
4. Creates nutrition reminder notifications

**Efficiency Features**:
- Avoids duplicate reminders by checking existing logs
- Targets only users who need the reminder

### 3. Goal Achievement Checker

**Schedule**: Daily at 6:00 PM (`0 18 * * *`)

**Purpose**: Automatically detects completed goals and celebrates achievements.

**Logic**:
1. Queries users with `preferences.notifications.goalMilestones: true`
2. Retrieves user profiles with active goals
3. Checks each goal's progress (`currentValue >= targetValue`)
4. Updates goal status from 'active' to 'completed'
5. Creates goal achievement notifications
6. Saves updated profile data

**Achievement Features**:
- Automatic goal completion detection
- Status update automation
- Celebration notifications for motivation

## API Reference

### Core Functions

#### `initNotificationSchedulers()`
Initializes all notification schedulers with environment checks.

**Parameters**: None

**Returns**: None

**Environment Handling**:
- Respects `NODE_ENV=test` and `DISABLE_SCHEDULERS` flag
- Logs initialization status

#### `scheduleWorkoutReminders()`
Sets up the workout reminder cron job.

**Schedule**: `0 8 * * *` (8:00 AM daily)

**Database Queries**:
- Users with workout reminder preferences
- Recent workout sessions (past 7 days)
- Available workouts by fitness level and type

#### `scheduleNutritionReminders()`
Sets up the nutrition reminder cron job.

**Schedule**: `0 11 * * *` (11:00 AM daily)

**Database Queries**:
- Users with nutrition reminder preferences
- Today's nutrition logs

#### `scheduleGoalChecks()`
Sets up the goal achievement checker cron job.

**Schedule**: `0 18 * * *` (6:00 PM daily)

**Database Operations**:
- Users with goal milestone preferences
- Profile goal updates
- Goal status modifications

#### `startNotificationSchedulers()`
Main entry point to start all notification schedulers with error handling.

**Error Handling**: Comprehensive try-catch with logging

## Database Schema Requirements

### User Model
```javascript
{
  preferences: {
    notifications: {
      workoutReminders: Boolean,
      nutritionReminders: Boolean,
      goalMilestones: Boolean
    }
  },
  fitnessLevel: String
}
```

### Profile Model
```javascript
{
  userId: ObjectId,
  goals: [{
    _id: ObjectId,
    status: String, // 'active', 'completed'
    currentValue: Number,
    targetValue: Number
  }]
}
```

### WorkoutSession Model
```javascript
{
  userId: ObjectId,
  workoutId: ObjectId,
  date: Date
}
```

### NutritionLog Model
```javascript
{
  userId: ObjectId,
  date: Date
}
```

### Workout Model
```javascript
{
  fitnessLevel: String,
  type: String
}
```

## Configuration

### Environment Variables

- `NODE_ENV`: Environment mode ('test', 'development', 'production')
- `DISABLE_SCHEDULERS`: Flag to disable schedulers in test mode

### Cron Schedule Format

The service uses standard cron syntax:
```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of Week   (0 - 7) (Sunday = 0 or 7)
│ │ │ └───── Month         (1 - 12)
│ │ └─────── Day of Month  (1 - 31)
│ └───────── Hour          (0 - 23)
└─────────── Minute        (0 - 59)
```

## Error Handling

Each scheduler includes comprehensive error handling:

- Try-catch blocks around all database operations
- Detailed error logging with context
- Graceful failure without affecting other schedulers
- Console logging for debugging and monitoring

## Usage Example

```javascript
const { startNotificationSchedulers } = require('./services/notificationScheduler');

// In your main application file
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start notification schedulers
  startNotificationSchedulers();
});
```

## Testing Considerations

### Test Environment Setup
```javascript
// Disable schedulers in test environment
process.env.NODE_ENV = 'test';
process.env.DISABLE_SCHEDULERS = 'true';
```

### Manual Testing
Individual scheduler functions can be called directly for testing:

```javascript
const { scheduleWorkoutReminders } = require('./services/notificationScheduler');

// Test workout reminder logic (be careful with database operations)
scheduleWorkoutReminders();
```

## Performance Considerations

### Database Optimization
- Use appropriate indexes on frequently queried fields:
  - `User.preferences.notifications.*`
  - `WorkoutSession.userId` and `WorkoutSession.date`
  - `NutritionLog.userId` and `NutritionLog.date`
  - `Profile.userId`

### Memory Management
- Schedulers run in the background continuously
- Database connections are reused through Mongoose
- Limited memory footprint due to scheduled execution

## Monitoring and Logging

### Success Logs
- Scheduler start/completion messages
- User count and processing status
- Goal achievement counts

### Error Logs
- Database connection issues
- Query failures
- Notification creation errors
- Cron job failures

## Future Enhancements

### Potential Improvements
1. **Timezone Support**: Handle user-specific timezones for scheduling
2. **Batch Processing**: Process notifications in batches for better performance
3. **Retry Logic**: Implement retry mechanisms for failed notifications
4. **Analytics**: Track notification effectiveness and user engagement
5. **Dynamic Scheduling**: Allow users to customize notification times
6. **Rate Limiting**: Prevent notification spam for highly active users

### Scalability Considerations
- Consider moving to a dedicated job queue system (Bull, Agenda) for larger scale
- Implement horizontal scaling with job locks to prevent duplicate processing
- Add health checks and monitoring endpoints