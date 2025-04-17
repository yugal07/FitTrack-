const cron = require('node-cron');
const mongoose = require('mongoose');
const { 
  User, 
  Workout, 
  WorkoutSession, 
  NutritionLog, 
  Profile 
} = require('../models');
const { 
  createWorkoutReminder, 
  createNutritionReminder, 
  createGoalAchievement, 
  createSystemNotification 
} = require('../controllers/notificationController');

/**
 * Scheduler for workout reminders
 * Runs every day at 8:00 AM
 */
const scheduleWorkoutReminders = () => {
  cron.schedule('0 8 * * *', async () => {
    try {
      console.log('Running workout reminder scheduler...');
      
      // Get users who have enabled workout reminders
      const users = await User.find({
        'preferences.notifications.workoutReminders': true
      });
      
      // Get today's date (start of day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get tomorrow's date (end of day)
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);
      
      // Create reminders for each user
      for (const user of users) {
        // Check if user has logged any workout sessions in the past 7 days
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const recentSessions = await WorkoutSession.find({
          userId: user._id,
          date: { $gte: lastWeek }
        });
        
        // Find a workout appropriate for the user
        let workoutToRecommend;
        
        if (recentSessions.length > 0) {
          // Get the most recent workout type they did
          const recentWorkoutIds = recentSessions.map(session => session.workoutId);
          const recentWorkouts = await Workout.find({
            _id: { $in: recentWorkoutIds }
          });
          
          // Try to recommend a different workout type
          const workoutTypes = [...new Set(recentWorkouts.map(w => w.type))];
          
          workoutToRecommend = await Workout.findOne({
            fitnessLevel: user.fitnessLevel,
            type: { $nin: workoutTypes }
          });
        }
        
        // Fallback if no suitable workout found
        if (!workoutToRecommend) {
          workoutToRecommend = await Workout.findOne({
            fitnessLevel: user.fitnessLevel
          });
        }
        
        if (workoutToRecommend) {
          await createWorkoutReminder(user._id, workoutToRecommend._id);
        }
      }
      
      console.log('Workout reminder scheduler completed');
    } catch (error) {
      console.error('Error in workout reminder scheduler:', error);
    }
  });
};

/**
 * Scheduler for nutrition reminders
 * Runs every day at 11:00 AM
 */
const scheduleNutritionReminders = () => {
  cron.schedule('0 11 * * *', async () => {
    try {
      console.log('Running nutrition reminder scheduler...');
      
      // Get users who have enabled nutrition reminders
      const users = await User.find({
        'preferences.notifications.nutritionReminders': true
      });
      
      // Get today's date (start of day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Create reminders for each user
      for (const user of users) {
        // Check if user has already logged nutrition today
        const todayLog = await NutritionLog.findOne({
          userId: user._id,
          date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        });
        
        // Only send reminder if they haven't logged nutrition today
        if (!todayLog) {
          await createNutritionReminder(user._id);
        }
      }
      
      console.log('Nutrition reminder scheduler completed');
    } catch (error) {
      console.error('Error in nutrition reminder scheduler:', error);
    }
  });
};

/**
 * Scheduler to check goal achievements
 * Runs every day at 6:00 PM
 */
const scheduleGoalChecks = () => {
  cron.schedule('0 18 * * *', async () => {
    try {
      console.log('Running goal achievement checker...');
      
      // Get users who have enabled goal milestone notifications
      const users = await User.find({
        'preferences.notifications.goalMilestones': true
      });
      
      // Check goals for each user
      for (const user of users) {
        const profile = await Profile.findOne({ userId: user._id });
        
        if (profile && profile.goals.length > 0) {
          // Find active goals that are completed but not marked as such
          profile.goals.forEach(async (goal) => {
            if (goal.status === 'active' && goal.currentValue >= goal.targetValue) {
              // Update goal status
              goal.status = 'completed';
              
              // Create achievement notification
              await createGoalAchievement(user._id, goal._id);
            }
          });
          
          // Save updated profile if any goals were updated
          await profile.save();
        }
      }
      
      console.log('Goal achievement checker completed');
    } catch (error) {
      console.error('Error in goal achievement checker:', error);
    }
  });
};

/**
 * Initialize all notification schedulers
 */
const initNotificationSchedulers = () => {
  scheduleWorkoutReminders();
  scheduleNutritionReminders();
  scheduleGoalChecks();
  
  console.log('All notification schedulers initialized');
};

module.exports = {
  initNotificationSchedulers,
  scheduleWorkoutReminders,
  scheduleNutritionReminders,
  scheduleGoalChecks
};