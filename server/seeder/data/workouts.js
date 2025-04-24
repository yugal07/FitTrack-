// server/seeder/data/workouts.js
const workouts = [
          {
            name: 'Beginner Full Body Workout',
            description: 'A simple full body workout routine perfect for beginners.',
            type: 'strength',
            fitnessLevel: 'beginner',
            isCustom: false,
            duration: 30,
            exercises: [
              { exerciseName: 'Push-up', sets: 3, reps: 10, restTime: 60 },
              { exerciseName: 'Squat', sets: 3, reps: 12, restTime: 60 },
              { exerciseName: 'Plank', sets: 3, duration: 30, restTime: 60 },
              { exerciseName: 'Mountain Climber', sets: 3, duration: 45, restTime: 60 }
            ],
            tags: ['beginner', 'full body', 'no equipment']
          },
          {
            name: 'Quick Core Crusher',
            description: 'A focused core workout that can be completed in under 20 minutes.',
            type: 'strength',
            fitnessLevel: 'beginner',
            isCustom: false,
            duration: 20,
            exercises: [
              { exerciseName: 'Plank', sets: 3, duration: 45, restTime: 45 },
              { exerciseName: 'Russian Twist', sets: 3, reps: 15, restTime: 45 },
              { exerciseName: 'Mountain Climber', sets: 3, duration: 45, restTime: 45 }
            ],
            tags: ['core', 'quick', 'beginner']
          },
          {
            name: 'Intermediate Strength Builder',
            description: 'A comprehensive strength workout for those with some fitness experience.',
            type: 'strength',
            fitnessLevel: 'intermediate',
            isCustom: false,
            duration: 45,
            exercises: [
              { exerciseName: 'Pull-up', sets: 4, reps: 8, restTime: 90 },
              { exerciseName: 'Dumbbell Bench Press', sets: 4, reps: 10, restTime: 90 },
              { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: 12, restTime: 90 },
              { exerciseName: 'Deadlift', sets: 4, reps: 8, restTime: 120 }
            ],
            tags: ['intermediate', 'strength', 'equipment required']
          },
          {
            name: 'HIIT Cardio Blast',
            description: 'A high-intensity interval training workout to boost cardio fitness and burn calories.',
            type: 'hiit',
            fitnessLevel: 'intermediate',
            isCustom: false,
            duration: 25,
            exercises: [
              { exerciseName: 'Burpee', sets: 5, reps: 10, restTime: 30 },
              { exerciseName: 'Mountain Climber', sets: 5, duration: 40, restTime: 30 },
              { exerciseName: 'Squat', sets: 5, reps: 15, restTime: 30 }
            ],
            tags: ['hiit', 'cardio', 'fat burning']
          },
          {
            name: 'Lower Body Focus',
            description: 'A targeted workout for strengthening and toning the lower body.',
            type: 'strength',
            fitnessLevel: 'beginner',
            isCustom: false,
            duration: 35,
            exercises: [
              { exerciseName: 'Squat', sets: 4, reps: 15, restTime: 60 },
              { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: 10, restTime: 60 },
              { exerciseName: 'Deadlift', sets: 3, reps: 12, restTime: 90 }
            ],
            tags: ['lower body', 'legs', 'strength']
          }
        ];
        
        module.exports = workouts;