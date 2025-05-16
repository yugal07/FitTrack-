const users = [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@fittrack.com',
      password: 'password123', // Will be hashed during seeding
      role: 'admin',
      fitnessLevel: 'advanced',
      gender: 'prefer not to say',
      profilePicture: '',
      preferences: {
        darkMode: false,
        notifications: {
          workoutReminders: true,
          goalMilestones: true,
          nutritionReminders: true
        },
        measurementUnit: 'metric'
      }
    },
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
      fitnessLevel: 'intermediate',
      gender: 'male',
      profilePicture: '',
      preferences: {
        darkMode: true,
        notifications: {
          workoutReminders: true,
          goalMilestones: true,
          nutritionReminders: false
        },
        measurementUnit: 'imperial'
      }
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'password123', 
      role: 'user',
      fitnessLevel: 'beginner',
      gender: 'female',
      profilePicture: '',
      preferences: {
        darkMode: false,
        notifications: {
          workoutReminders: true,
          goalMilestones: false,
          nutritionReminders: true
        },
        measurementUnit: 'metric'
      }
    },
    {
      firstName: 'Alex',
      lastName: 'Johnson',
      email: 'alex@example.com',
      password: 'password123',
      role: 'user',
      fitnessLevel: 'advanced',
      gender: 'other',
      profilePicture: '',
      preferences: {
        darkMode: true,
        notifications: {
          workoutReminders: false,
          goalMilestones: true,
          nutritionReminders: true
        },
        measurementUnit: 'metric'
      }
    },
    {
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah@example.com',
      password: 'password123', 
      role: 'user',
      fitnessLevel: 'intermediate',
      gender: 'female',
      profilePicture: '',
      preferences: {
        darkMode: false,
        notifications: {
          workoutReminders: true,
          goalMilestones: true,
          nutritionReminders: true
        },
        measurementUnit: 'imperial'
      }
    }
  ];
  
  module.exports = users;