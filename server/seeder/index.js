const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const {
  User,
  Profile,
  Exercise,
  Workout,
  WorkoutSession,
  NutritionLog,
  Notification,
  NutritionItem,
} = require('../models');

// Load env vars
dotenv.config();

// Connect to DB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

// Helper functions
const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const randomChoice = array => array[Math.floor(Math.random() * array.length)];

const userPassword = 'password';

// Sample Users Data
const users = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    fitnessLevel: 'advanced',
    gender: 'male',
    dateOfBirth: new Date('1985-06-15'),
    preferences: {
      darkMode: true,
      notifications: {
        workoutReminders: true,
        goalMilestones: true,
        nutritionReminders: true,
      },
      measurementUnit: 'metric',
    },
  },
  {
    email: 'user1@example.com',
    password: userPassword,
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    fitnessLevel: 'intermediate',
    gender: 'male',
    dateOfBirth: new Date('1990-03-20'),
    preferences: {
      darkMode: false,
      notifications: {
        workoutReminders: true,
        goalMilestones: true,
        nutritionReminders: false,
      },
      measurementUnit: 'metric',
    },
  },
  {
    email: 'user2@example.com',
    password: userPassword,
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user',
    fitnessLevel: 'beginner',
    gender: 'female',
    dateOfBirth: new Date('1992-08-10'),
    preferences: {
      darkMode: true,
      notifications: {
        workoutReminders: true,
        goalMilestones: true,
        nutritionReminders: true,
      },
      measurementUnit: 'imperial',
    },
  },
  {
    email: 'user3@example.com',
    password: userPassword,
    firstName: 'Mike',
    lastName: 'Wilson',
    role: 'user',
    fitnessLevel: 'advanced',
    gender: 'male',
    dateOfBirth: new Date('1988-12-05'),
    preferences: {
      darkMode: false,
      notifications: {
        workoutReminders: false,
        goalMilestones: true,
        nutritionReminders: true,
      },
      measurementUnit: 'metric',
    },
  },
  {
    email: 'user4@example.com',
    password: userPassword,
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'user',
    fitnessLevel: 'intermediate',
    gender: 'female',
    dateOfBirth: new Date('1995-04-18'),
    preferences: {
      darkMode: true,
      notifications: {
        workoutReminders: true,
        goalMilestones: false,
        nutritionReminders: true,
      },
      measurementUnit: 'imperial',
    },
  },
  {
    email: 'user5@example.com',
    password: userPassword,
    firstName: 'Alex',
    lastName: 'Brown',
    role: 'user',
    fitnessLevel: 'beginner',
    gender: 'other',
    dateOfBirth: new Date('1993-11-22'),
    preferences: {
      darkMode: false,
      notifications: {
        workoutReminders: true,
        goalMilestones: true,
        nutritionReminders: false,
      },
      measurementUnit: 'metric',
    },
  },
  {
    email: 'user6@example.com',
    password: userPassword,
    firstName: 'Emma',
    lastName: 'Davis',
    role: 'user',
    fitnessLevel: 'advanced',
    gender: 'female',
    dateOfBirth: new Date('1989-07-30'),
    preferences: {
      darkMode: true,
      notifications: {
        workoutReminders: true,
        goalMilestones: true,
        nutritionReminders: true,
      },
      measurementUnit: 'metric',
    },
  },
  {
    email: 'user7@example.com',
    password: userPassword,
    firstName: 'Chris',
    lastName: 'Garcia',
    role: 'user',
    fitnessLevel: 'intermediate',
    gender: 'male',
    dateOfBirth: new Date('1991-01-12'),
    preferences: {
      darkMode: false,
      notifications: {
        workoutReminders: false,
        goalMilestones: true,
        nutritionReminders: true,
      },
      measurementUnit: 'imperial',
    },
  },
];

// Sample Exercises Data
const exercises = [
  {
    name: 'Push-ups',
    description:
      'A classic upper body exercise that targets chest, shoulders, and triceps.',
    muscleGroups: ['chest', 'shoulders', 'arms'],
    difficulty: 'beginner',
    instructions:
      '1. Start in plank position with hands shoulder-width apart\n2. Lower body until chest nearly touches floor\n3. Push back up to starting position\n4. Keep core tight throughout movement\n5. Repeat for desired reps',
    equipment: [],
    averageRating: 4.5,
  },
  {
    name: 'Squats',
    description:
      'Fundamental lower body exercise targeting quads, glutes, and hamstrings.',
    muscleGroups: ['legs'],
    difficulty: 'beginner',
    instructions:
      '1. Stand with feet shoulder-width apart\n2. Lower body by bending knees and pushing hips back\n3. Keep chest up and back straight\n4. Lower until thighs parallel to floor\n5. Drive through heels to return to standing',
    equipment: [],
    averageRating: 4.7,
  },
  {
    name: 'Deadlifts',
    description:
      'Compound exercise working posterior chain muscles including hamstrings, glutes, and back.',
    muscleGroups: ['back', 'legs'],
    difficulty: 'intermediate',
    instructions:
      '1. Stand with feet hip-width apart, bar over mid-foot\n2. Bend at hips and knees to grip bar\n3. Keep back straight and chest up\n4. Lift by extending hips and knees simultaneously\n5. Lower bar with controlled motion',
    equipment: ['barbell', 'weights'],
    averageRating: 4.8,
  },
  {
    name: 'Pull-ups',
    description:
      'Upper body pulling exercise targeting back muscles and biceps.',
    muscleGroups: ['back', 'arms'],
    difficulty: 'intermediate',
    instructions:
      '1. Hang from pull-up bar with overhand grip\n2. Pull body up until chin clears bar\n3. Lower with control to full arm extension\n4. Engage core throughout movement\n5. Avoid swinging or kipping',
    equipment: ['pull-up bar'],
    averageRating: 4.6,
  },
  {
    name: 'Planks',
    description:
      'Isometric core strengthening exercise that also engages shoulders and glutes.',
    muscleGroups: ['core'],
    difficulty: 'beginner',
    instructions:
      '1. Start in push-up position\n2. Lower to forearms, elbows under shoulders\n3. Keep body straight from head to heels\n4. Engage core and glutes\n5. Hold position for desired time',
    equipment: [],
    averageRating: 4.3,
  },
  {
    name: 'Burpees',
    description:
      'Full body exercise combining squat, plank, push-up, and jump movements.',
    muscleGroups: ['full body', 'cardio'],
    difficulty: 'intermediate',
    instructions:
      '1. Start standing with feet shoulder-width apart\n2. Drop to squat position, hands on floor\n3. Jump feet back to plank position\n4. Perform push-up (optional)\n5. Jump feet forward to squat\n6. Jump up with arms overhead',
    equipment: [],
    averageRating: 3.9,
  },
  {
    name: 'Bench Press',
    description:
      'Primary chest exercise performed on bench with barbell or dumbbells.',
    muscleGroups: ['chest', 'shoulders', 'arms'],
    difficulty: 'intermediate',
    instructions:
      '1. Lie on bench with feet flat on floor\n2. Grip bar with hands wider than shoulders\n3. Lower bar to chest with control\n4. Press bar back up to starting position\n5. Keep core engaged and shoulder blades retracted',
    equipment: ['bench', 'barbell', 'weights'],
    averageRating: 4.7,
  },
  {
    name: 'Lunges',
    description:
      'Single-leg exercise targeting quadriceps, glutes, and improving balance.',
    muscleGroups: ['legs'],
    difficulty: 'beginner',
    instructions:
      '1. Step forward with one leg into lunge position\n2. Lower hips until both knees at 90-degree angles\n3. Keep front knee over ankle\n4. Push back to starting position\n5. Alternate legs or complete one side first',
    equipment: [],
    averageRating: 4.4,
  },
  {
    name: 'Mountain Climbers',
    description:
      'Dynamic cardio exercise that mimics climbing motion while in plank position.',
    muscleGroups: ['cardio', 'core'],
    difficulty: 'beginner',
    instructions:
      '1. Start in plank position with hands under shoulders\n2. Bring one knee toward chest\n3. Quickly switch legs in running motion\n4. Keep hips level and core engaged\n5. Continue alternating rapidly',
    equipment: [],
    averageRating: 4.2,
  },
  {
    name: 'Bicep Curls',
    description:
      'Isolation exercise specifically targeting the bicep muscles of the upper arm.',
    muscleGroups: ['arms'],
    difficulty: 'beginner',
    instructions:
      '1. Hold dumbbells at sides with palms facing forward\n2. Keep elbows close to body\n3. Curl weights toward shoulders\n4. Squeeze biceps at top\n5. Lower with control to starting position',
    equipment: ['dumbbells'],
    averageRating: 4.1,
  },
  {
    name: 'Tricep Dips',
    description:
      'Bodyweight exercise targeting the tricep muscles using chair or bench.',
    muscleGroups: ['arms'],
    difficulty: 'intermediate',
    instructions:
      '1. Sit on edge of chair or bench with hands beside hips\n2. Walk feet forward and support body weight on arms\n3. Lower body by bending elbows\n4. Push back up to starting position\n5. Keep elbows close to body',
    equipment: ['chair', 'bench'],
    averageRating: 4.3,
  },
  {
    name: 'Shoulder Press',
    description:
      'Overhead pressing exercise for developing shoulder strength and stability.',
    muscleGroups: ['shoulders'],
    difficulty: 'beginner',
    instructions:
      '1. Hold weights at shoulder height with palms forward\n2. Press weights directly overhead\n3. Extend arms fully without locking elbows\n4. Lower with control to starting position\n5. Keep core engaged throughout',
    equipment: ['dumbbells'],
    averageRating: 4.5,
  },
  {
    name: 'Russian Twists',
    description:
      'Rotational core exercise that targets obliques and improves rotational strength.',
    muscleGroups: ['core'],
    difficulty: 'beginner',
    instructions:
      '1. Sit with knees bent and feet slightly off ground\n2. Lean back to create V-shape with torso and thighs\n3. Rotate torso side to side\n4. Keep core engaged throughout\n5. Add weight for increased difficulty',
    equipment: [],
    averageRating: 4.0,
  },
  {
    name: 'Jumping Jacks',
    description:
      'Basic cardiovascular exercise that elevates heart rate and works full body.',
    muscleGroups: ['cardio', 'full body'],
    difficulty: 'beginner',
    instructions:
      '1. Start with feet together and arms at sides\n2. Jump while spreading legs shoulder-width apart\n3. Simultaneously raise arms overhead\n4. Jump back to starting position\n5. Maintain steady rhythm',
    equipment: [],
    averageRating: 3.8,
  },
  {
    name: 'Hip Thrusts',
    description:
      'Glute-focused exercise that builds posterior chain strength and power.',
    muscleGroups: ['legs'],
    difficulty: 'intermediate',
    instructions:
      '1. Sit with upper back against bench\n2. Place barbell or weight over hips\n3. Drive hips up by squeezing glutes\n4. Create straight line from knees to shoulders\n5. Lower with control and repeat',
    equipment: ['bench', 'barbell'],
    averageRating: 4.6,
  },
  {
    name: 'Rows',
    description:
      'Back exercise that can be performed with various equipment to build pulling strength.',
    muscleGroups: ['back', 'arms'],
    difficulty: 'intermediate',
    instructions:
      '1. Hinge at hips with slight knee bend\n2. Pull weight toward lower chest/upper abdomen\n3. Squeeze shoulder blades together\n4. Lower with control\n5. Keep core engaged throughout',
    equipment: ['dumbbells', 'barbell', 'resistance bands'],
    averageRating: 4.4,
  },
  {
    name: 'High Knees',
    description:
      'Cardio exercise that improves running form and elevates heart rate.',
    muscleGroups: ['cardio', 'legs'],
    difficulty: 'beginner',
    instructions:
      '1. Stand with feet hip-width apart\n2. Run in place lifting knees to hip height\n3. Pump arms as if running\n4. Land on balls of feet\n5. Maintain quick cadence',
    equipment: [],
    averageRating: 3.9,
  },
  {
    name: 'Side Planks',
    description:
      'Core exercise that specifically targets obliques and lateral core stability.',
    muscleGroups: ['core'],
    difficulty: 'intermediate',
    instructions:
      '1. Lie on side with elbow under shoulder\n2. Stack feet and lift hips off ground\n3. Create straight line from head to feet\n4. Hold position engaging core\n5. Switch sides and repeat',
    equipment: [],
    averageRating: 4.2,
  },
  {
    name: 'Wall Sits',
    description:
      'Isometric leg exercise that builds endurance in quadriceps and glutes.',
    muscleGroups: ['legs'],
    difficulty: 'beginner',
    instructions:
      '1. Stand with back against wall\n2. Slide down until thighs parallel to floor\n3. Keep knees at 90-degree angle\n4. Hold position with weight in heels\n5. Keep back flat against wall',
    equipment: [],
    averageRating: 4.0,
  },
  {
    name: 'Leg Raises',
    description: 'Core exercise that targets lower abdominals and hip flexors.',
    muscleGroups: ['core'],
    difficulty: 'intermediate',
    instructions:
      '1. Lie on back with hands at sides\n2. Keep legs straight or slightly bent\n3. Lift legs until perpendicular to floor\n4. Lower with control without touching ground\n5. Keep lower back pressed to floor',
    equipment: [],
    averageRating: 4.1,
  },
];
// Sample Nutrition Items Data
const nutritionItems = [
  {
    name: 'Chicken Breast',
    category: 'protein',
    servingSize: 100,
    servingUnit: 'g',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
  },
  {
    name: 'Brown Rice',
    category: 'carbs',
    servingSize: 100,
    servingUnit: 'g',
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
  },
  {
    name: 'Broccoli',
    category: 'vegetable',
    servingSize: 100,
    servingUnit: 'g',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
  },
  {
    name: 'Banana',
    category: 'fruit',
    servingSize: 1,
    servingUnit: 'piece',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
  },
  {
    name: 'Greek Yogurt',
    category: 'dairy',
    servingSize: 100,
    servingUnit: 'g',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
  },
  {
    name: 'Oatmeal',
    category: 'carbs',
    servingSize: 100,
    servingUnit: 'g',
    calories: 68,
    protein: 2.4,
    carbs: 12,
    fat: 1.4,
  },
  {
    name: 'Salmon',
    category: 'protein',
    servingSize: 100,
    servingUnit: 'g',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
  },
  {
    name: 'Spinach',
    category: 'vegetable',
    servingSize: 100,
    servingUnit: 'g',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
  },
  {
    name: 'Apple',
    category: 'fruit',
    servingSize: 1,
    servingUnit: 'piece',
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
  },
  {
    name: 'Almonds',
    category: 'fat',
    servingSize: 28,
    servingUnit: 'g',
    calories: 161,
    protein: 6,
    carbs: 6,
    fat: 14,
  },
  {
    name: 'Sweet Potato',
    category: 'carbs',
    servingSize: 100,
    servingUnit: 'g',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
  },
  {
    name: 'Tuna',
    category: 'protein',
    servingSize: 100,
    servingUnit: 'g',
    calories: 144,
    protein: 30,
    carbs: 0,
    fat: 1,
  },
  {
    name: 'Avocado',
    category: 'fat',
    servingSize: 100,
    servingUnit: 'g',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
  },
  {
    name: 'Quinoa',
    category: 'carbs',
    servingSize: 100,
    servingUnit: 'g',
    calories: 120,
    protein: 4.4,
    carbs: 22,
    fat: 1.9,
  },
  {
    name: 'Eggs',
    category: 'protein',
    servingSize: 1,
    servingUnit: 'piece',
    calories: 70,
    protein: 6,
    carbs: 1,
    fat: 5,
  },
  {
    name: 'Cottage Cheese',
    category: 'dairy',
    servingSize: 100,
    servingUnit: 'g',
    calories: 98,
    protein: 11,
    carbs: 3.4,
    fat: 4.3,
  },
  {
    name: 'Bell Peppers',
    category: 'vegetable',
    servingSize: 100,
    servingUnit: 'g',
    calories: 31,
    protein: 1,
    carbs: 7,
    fat: 0.3,
  },
  {
    name: 'Blueberries',
    category: 'fruit',
    servingSize: 100,
    servingUnit: 'g',
    calories: 57,
    protein: 0.7,
    carbs: 14,
    fat: 0.3,
  },
  {
    name: 'Olive Oil',
    category: 'fat',
    servingSize: 1,
    servingUnit: 'tbsp',
    calories: 119,
    protein: 0,
    carbs: 0,
    fat: 13.5,
  },
  {
    name: 'Turkey Breast',
    category: 'protein',
    servingSize: 100,
    servingUnit: 'g',
    calories: 135,
    protein: 30,
    carbs: 0,
    fat: 1,
  },
];

// Function to generate sample workouts
const generateWorkouts = (users, exercises) => {
  const workoutTypes = ['strength', 'cardio', 'flexibility', 'hybrid', 'hiit'];
  const fitnessLevels = ['beginner', 'intermediate', 'advanced'];

  const workouts = [];

  // Pre-defined workouts
  const predefinedWorkouts = [
    {
      name: 'Upper Body Strength',
      description:
        'A comprehensive upper body workout focusing on chest, back, shoulders, and arms.',
      type: 'strength',
      fitnessLevel: 'intermediate',
      isCustom: false,
      duration: 45,
      exercises: [
        { exerciseId: null, sets: 3, reps: 12, restTime: 60, order: 1 }, // Push-ups
        { exerciseId: null, sets: 3, reps: 8, restTime: 90, order: 2 }, // Pull-ups
        { exerciseId: null, sets: 3, reps: 10, restTime: 60, order: 3 }, // Bench Press
        { exerciseId: null, sets: 3, reps: 12, restTime: 60, order: 4 }, // Shoulder Press
        { exerciseId: null, sets: 3, reps: 15, restTime: 45, order: 5 }, // Bicep Curls
        { exerciseId: null, sets: 3, reps: 12, restTime: 45, order: 6 }, // Tricep Dips
      ],
      tags: ['upper body', 'strength', 'muscle building'],
      averageRating: 4.5,
    },
    {
      name: 'Lower Body Power',
      description:
        'Intense lower body workout targeting legs and glutes for strength and power.',
      type: 'strength',
      fitnessLevel: 'advanced',
      isCustom: false,
      duration: 50,
      exercises: [
        { exerciseId: null, sets: 4, reps: 8, restTime: 120, order: 1 }, // Squats
        { exerciseId: null, sets: 4, reps: 6, restTime: 150, order: 2 }, // Deadlifts
        { exerciseId: null, sets: 3, reps: 12, restTime: 90, order: 3 }, // Lunges
        { exerciseId: null, sets: 3, reps: 15, restTime: 60, order: 4 }, // Hip Thrusts
        { exerciseId: null, sets: 3, reps: 45, restTime: 60, order: 5 }, // Wall Sits
      ],
      tags: ['lower body', 'legs', 'glutes', 'power'],
      averageRating: 4.7,
    },
    {
      name: 'HIIT Cardio Blast',
      description:
        'High-intensity interval training for maximum calorie burn and cardiovascular fitness.',
      type: 'hiit',
      fitnessLevel: 'intermediate',
      isCustom: false,
      duration: 25,
      exercises: [
        { exerciseId: null, sets: 4, duration: 30, restTime: 30, order: 1 }, // Burpees
        { exerciseId: null, sets: 4, duration: 45, restTime: 15, order: 2 }, // Mountain Climbers
        { exerciseId: null, sets: 4, duration: 30, restTime: 30, order: 3 }, // Jumping Jacks
        { exerciseId: null, sets: 4, duration: 30, restTime: 30, order: 4 }, // High Knees
      ],
      tags: ['hiit', 'cardio', 'fat burn', 'quick'],
      averageRating: 4.3,
    },
    {
      name: 'Beginner Full Body',
      description:
        'Perfect starter workout for beginners covering all major muscle groups.',
      type: 'strength',
      fitnessLevel: 'beginner',
      isCustom: false,
      duration: 30,
      exercises: [
        { exerciseId: null, sets: 2, reps: 8, restTime: 60, order: 1 }, // Push-ups
        { exerciseId: null, sets: 2, reps: 10, restTime: 60, order: 2 }, // Squats
        { exerciseId: null, sets: 2, duration: 30, restTime: 60, order: 3 }, // Planks
        { exerciseId: null, sets: 2, reps: 8, restTime: 60, order: 4 }, // Lunges
        { exerciseId: null, sets: 2, reps: 10, restTime: 45, order: 5 }, // Bicep Curls
      ],
      tags: ['beginner', 'full body', 'starter'],
      averageRating: 4.2,
    },
    {
      name: 'Core Crusher',
      description:
        'Intense core workout targeting all abdominal muscles and core stability.',
      type: 'strength',
      fitnessLevel: 'intermediate',
      isCustom: false,
      duration: 20,
      exercises: [
        { exerciseId: null, sets: 3, duration: 45, restTime: 30, order: 1 }, // Planks
        { exerciseId: null, sets: 3, reps: 20, restTime: 45, order: 2 }, // Russian Twists
        { exerciseId: null, sets: 3, duration: 30, restTime: 30, order: 3 }, // Side Planks
        { exerciseId: null, sets: 3, reps: 15, restTime: 45, order: 4 }, // Leg Raises
        { exerciseId: null, sets: 3, duration: 30, restTime: 30, order: 5 }, // Mountain Climbers
      ],
      tags: ['core', 'abs', 'stability'],
      averageRating: 4.4,
    },
    {
      name: 'Quick Morning Energy',
      description:
        'Energizing morning routine to start your day with movement and energy.',
      type: 'cardio',
      fitnessLevel: 'beginner',
      isCustom: false,
      duration: 15,
      exercises: [
        { exerciseId: null, sets: 2, duration: 30, restTime: 30, order: 1 }, // Jumping Jacks
        { exerciseId: null, sets: 2, reps: 10, restTime: 30, order: 2 }, // Squats
        { exerciseId: null, sets: 2, duration: 20, restTime: 30, order: 3 }, // High Knees
        { exerciseId: null, sets: 1, duration: 30, restTime: 0, order: 4 }, // Planks
      ],
      tags: ['morning', 'energy', 'quick', 'cardio'],
      averageRating: 4.0,
    },
  ];

  // Add pre-defined workouts with admin as creator
  predefinedWorkouts.forEach(workout => {
    workouts.push({
      ...workout,
      createdBy: users[0]._id, // Admin user
    });
  });

  // Generate custom workouts for users
  users.slice(1).forEach((user, userIndex) => {
    const numWorkouts = randomBetween(2, 4);

    for (let i = 0; i < numWorkouts; i++) {
      const exerciseCount = randomBetween(3, 6);
      const selectedExercises = [];

      // Randomly select exercises
      for (let j = 0; j < exerciseCount; j++) {
        const randomExercise = randomChoice(exercises);
        if (
          !selectedExercises.find(ex =>
            ex.exerciseId.equals(randomExercise._id)
          )
        ) {
          selectedExercises.push({
            exerciseId: randomExercise._id,
            sets: randomBetween(2, 4),
            reps: randomBetween(8, 15),
            duration: randomExercise.name.includes('Plank')
              ? randomBetween(20, 60)
              : undefined,
            restTime: randomBetween(30, 90),
            order: j + 1,
          });
        }
      }

      workouts.push({
        name: `${user.firstName}'s Custom Workout ${i + 1}`,
        description: `Custom workout created by ${user.firstName} ${user.lastName}`,
        createdBy: user._id,
        type: randomChoice(workoutTypes),
        fitnessLevel: user.fitnessLevel,
        isCustom: true,
        duration: randomBetween(20, 60),
        exercises: selectedExercises,
        tags: ['custom', user.fitnessLevel],
        averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
      });
    }
  });

  return workouts;
};

// Function to generate profiles with goals, measurements, and progress photos
const generateProfiles = users => {
  const profiles = [];
  const goalTypes = ['weight', 'strength', 'endurance', 'habit', 'nutrition'];
  const goalStatuses = ['active', 'completed', 'abandoned'];

  users.forEach((user, index) => {
    if (index === 0) return; // Skip admin user

    const profile = {
      userId: user._id,
      goals: [],
      measurements: [],
      progressPhotos: [],
    };

    // Generate goals (2-4 per user)
    const numGoals = randomBetween(2, 4);
    for (let i = 0; i < numGoals; i++) {
      const goalType = randomChoice(goalTypes);
      let targetValue, currentValue, unit;

      switch (goalType) {
        case 'weight':
          targetValue = randomBetween(60, 90);
          currentValue = randomBetween(65, 95);
          unit = user.preferences.measurementUnit === 'metric' ? 'kg' : 'lbs';
          break;
        case 'strength':
          targetValue = randomBetween(50, 150);
          currentValue = randomBetween(30, 120);
          unit = user.preferences.measurementUnit === 'metric' ? 'kg' : 'lbs';
          break;
        case 'endurance':
          targetValue = randomBetween(5, 20);
          currentValue = randomBetween(2, 15);
          unit = 'km';
          break;
        case 'habit':
          targetValue = randomBetween(20, 100);
          currentValue = randomBetween(5, 80);
          unit = 'days';
          break;
        case 'nutrition':
          targetValue = randomBetween(1500, 3000);
          currentValue = randomBetween(1200, 2800);
          unit = 'calories';
          break;
      }

      const startDate = randomDate(new Date(2024, 0, 1), new Date(2024, 6, 1));
      const targetDate = new Date(startDate);
      targetDate.setMonth(targetDate.getMonth() + randomBetween(3, 12));

      let status = 'active';
      if (currentValue >= targetValue) {
        status = 'completed';
      } else if (Math.random() < 0.1) {
        status = 'abandoned';
      }

      profile.goals.push({
        type: goalType,
        targetValue,
        currentValue,
        unit,
        startDate,
        targetDate,
        status,
      });
    }

    // Generate measurements (3-8 entries over time)
    const numMeasurements = randomBetween(3, 8);
    for (let i = 0; i < numMeasurements; i++) {
      const measurementDate = randomDate(new Date(2024, 0, 1), new Date());

      profile.measurements.push({
        date: measurementDate,
        weight:
          user.preferences.measurementUnit === 'metric'
            ? randomBetween(60, 100)
            : randomBetween(130, 220),
        height:
          user.preferences.measurementUnit === 'metric'
            ? randomBetween(160, 190)
            : randomBetween(63, 75),
        bodyFat: randomBetween(10, 30),
        chest:
          user.preferences.measurementUnit === 'metric'
            ? randomBetween(85, 110)
            : randomBetween(34, 44),
        waist:
          user.preferences.measurementUnit === 'metric'
            ? randomBetween(70, 95)
            : randomBetween(28, 38),
        hips:
          user.preferences.measurementUnit === 'metric'
            ? randomBetween(85, 105)
            : randomBetween(34, 42),
        arms:
          user.preferences.measurementUnit === 'metric'
            ? randomBetween(25, 40)
            : randomBetween(10, 16),
        thighs:
          user.preferences.measurementUnit === 'metric'
            ? randomBetween(45, 65)
            : randomBetween(18, 26),
        notes: i === 0 ? 'Initial measurements' : `Progress check ${i}`,
      });
    }

    // Generate progress photos (1-4 entries)
    const numPhotos = randomBetween(1, 4);
    const photoCategories = ['front', 'side', 'back'];

    for (let i = 0; i < numPhotos; i++) {
      profile.progressPhotos.push({
        date: randomDate(new Date(2024, 0, 1), new Date()),
        photoUrl: `uploads/progress-photos/sample-${user._id}-${i + 1}.jpg`,
        category: randomChoice(photoCategories),
        notes: `Progress photo ${i + 1}`,
      });
    }

    profiles.push(profile);
  });

  return profiles;
};

// Function to generate workout sessions
const generateWorkoutSessions = (users, workouts) => {
  const sessions = [];
  const moods = [
    'energized',
    'tired',
    'strong',
    'weak',
    'neutral',
    'sore',
    'proud',
    'disappointed',
  ];

  users.forEach((user, userIndex) => {
    if (userIndex === 0) return; // Skip admin user

    const numSessions = randomBetween(15, 30); // 15-30 workout sessions per user

    for (let i = 0; i < numSessions; i++) {
      const randomWorkout = randomChoice(workouts);
      const sessionDate = randomDate(new Date(2024, 0, 1), new Date());

      // Generate completed exercises based on workout
      const completedExercises = randomWorkout.exercises.map(
        workoutExercise => {
          const numSets = randomBetween(
            Math.max(1, workoutExercise.sets - 1),
            workoutExercise.sets + 1
          );
          const sets = [];

          for (let setIndex = 0; setIndex < numSets; setIndex++) {
            const set = {
              completed: Math.random() > 0.1, // 90% completion rate
            };

            if (workoutExercise.reps) {
              set.reps = randomBetween(
                Math.max(1, workoutExercise.reps - 3),
                workoutExercise.reps + 2
              );
            }

            if (workoutExercise.duration) {
              set.duration = randomBetween(
                Math.max(10, workoutExercise.duration - 10),
                workoutExercise.duration + 15
              );
            }

            // Add weight for strength exercises
            if (
              ['strength', 'hybrid'].includes(randomWorkout.type) &&
              Math.random() > 0.3
            ) {
              set.weight = randomBetween(5, 100);
            }

            sets.push(set);
          }

          return {
            exerciseId: workoutExercise.exerciseId,
            sets,
            notes: Math.random() > 0.7 ? 'Felt good' : '',
          };
        }
      );

      sessions.push({
        userId: user._id,
        workoutId: randomWorkout._id,
        date: sessionDate,
        duration: randomBetween(
          Math.max(10, randomWorkout.duration - 10),
          randomWorkout.duration + 15
        ),
        completedExercises,
        caloriesBurned: randomBetween(100, 600),
        rating: randomBetween(3, 5),
        difficulty: randomBetween(2, 5),
        notes:
          Math.random() > 0.6
            ? randomChoice([
                'Great workout!',
                'Felt challenging but good',
                'Need to increase weights next time',
                'Good session overall',
                'Felt tired but pushed through',
              ])
            : '',
        mood: randomChoice(moods),
      });
    }
  });

  return sessions;
};

// Function to generate nutrition logs
const generateNutritionLogs = (users, nutritionItems) => {
  const logs = [];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  users.forEach((user, userIndex) => {
    if (userIndex === 0) return; // Skip admin user

    const numDays = randomBetween(20, 45); // 20-45 days of nutrition logs

    for (let day = 0; day < numDays; day++) {
      const logDate = new Date();
      logDate.setDate(logDate.getDate() - day);
      logDate.setHours(0, 0, 0, 0);

      const meals = [];
      const numMeals = randomBetween(3, 5); // 3-5 meals per day

      for (let mealIndex = 0; mealIndex < numMeals; mealIndex++) {
        const mealType =
          mealIndex < 3 ? ['breakfast', 'lunch', 'dinner'][mealIndex] : 'snack';

        const numFoods = randomBetween(2, 5); // 2-5 foods per meal
        const foods = [];

        for (let foodIndex = 0; foodIndex < numFoods; foodIndex++) {
          const randomFood = randomChoice(nutritionItems);
          const quantity = Math.round((Math.random() * 2 + 0.5) * 10) / 10; // 0.5 to 2.5

          foods.push({
            name: randomFood.name,
            quantity,
            unit: randomFood.servingUnit,
            calories: Math.round(randomFood.calories * quantity),
            protein: Math.round(randomFood.protein * quantity * 10) / 10,
            carbs: Math.round(randomFood.carbs * quantity * 10) / 10,
            fat: Math.round(randomFood.fat * quantity * 10) / 10,
          });
        }

        // Set meal time based on type
        const mealTime = new Date(logDate);
        switch (mealType) {
          case 'breakfast':
            mealTime.setHours(randomBetween(7, 9), randomBetween(0, 59));
            break;
          case 'lunch':
            mealTime.setHours(randomBetween(12, 14), randomBetween(0, 59));
            break;
          case 'dinner':
            mealTime.setHours(randomBetween(18, 20), randomBetween(0, 59));
            break;
          case 'snack':
            mealTime.setHours(randomBetween(15, 17), randomBetween(0, 59));
            break;
        }

        meals.push({
          type: mealType,
          time: mealTime,
          foods,
          notes:
            Math.random() > 0.8
              ? randomChoice([
                  'Delicious!',
                  'Felt satisfied',
                  'Could use more protein',
                  'Perfect portion size',
                  'Craving something sweet',
                ])
              : '',
        });
      }

      logs.push({
        userId: user._id,
        date: logDate,
        meals,
        waterIntake: randomBetween(1500, 3500), // ml
        notes:
          Math.random() > 0.7
            ? randomChoice([
                'Good eating day',
                'Stayed on track',
                'Could drink more water',
                'Felt energized',
                'Need more vegetables tomorrow',
              ])
            : '',
      });
    }
  });

  return logs;
};

// Function to generate notifications
const generateNotifications = (users, workouts, profiles) => {
  const notifications = [];
  const notificationTypes = ['workout', 'goal', 'nutrition', 'system'];

  users.forEach((user, userIndex) => {
    if (userIndex === 0) return; // Skip admin user

    const numNotifications = randomBetween(5, 15);

    for (let i = 0; i < numNotifications; i++) {
      const type = randomChoice(notificationTypes);
      let title, message, actionLink, relatedId;

      switch (type) {
        case 'workout':
          const randomWorkout = randomChoice(workouts);
          title = 'Workout Reminder';
          message = `Time for your ${randomWorkout.name} workout!`;
          actionLink = `/workouts/${randomWorkout._id}`;
          relatedId = randomWorkout._id;
          break;

        case 'goal':
          const userProfile = profiles.find(p => p.userId.equals(user._id));
          if (userProfile && userProfile.goals.length > 0) {
            const randomGoal = randomChoice(userProfile.goals);
            title = 'Goal Achievement!';
            message = `Congratulations! You've reached your ${randomGoal.type} goal!`;
            actionLink = `/goals/${randomGoal._id}`;
            relatedId = randomGoal._id;
          } else {
            title = 'Set Your Goals';
            message = 'Set your fitness goals to track your progress!';
            actionLink = '/goals';
            relatedId = null;
          }
          break;

        case 'nutrition':
          title = 'Nutrition Reminder';
          message = "Don't forget to log your meals for today!";
          actionLink = '/nutrition';
          relatedId = null;
          break;

        case 'system':
          title = randomChoice([
            'Welcome!',
            'New Features Available',
            'Maintenance Notice',
            'Health Tips',
          ]);
          message = randomChoice([
            'Welcome to our fitness app! Start your journey today.',
            'Check out our new workout templates!',
            'System maintenance scheduled for tonight.',
            'Remember to stay hydrated during workouts!',
          ]);
          actionLink = null;
          relatedId = null;
          break;
      }

      notifications.push({
        userId: user._id,
        type,
        title,
        message,
        read: Math.random() > 0.3, // 70% read rate
        actionLink,
        relatedId,
        createdAt: randomDate(new Date(2024, 0, 1), new Date()),
      });
    }
  });

  return notifications;
};
// Function to add ratings to exercises and workouts
const addRatingsToExercisesAndWorkouts = async (users, exercises, workouts) => {
  console.log('Adding ratings to exercises and workouts...'.yellow);

  // Add ratings to exercises
  for (const exercise of exercises) {
    const numRatings = randomBetween(3, 8);
    const ratings = [];

    for (let i = 0; i < numRatings; i++) {
      const randomUser = randomChoice(users.slice(1)); // Exclude admin
      const rating = randomBetween(3, 5);
      const reviews = [
        'Great exercise!',
        'Really effective',
        'Love this one',
        'Good for building strength',
        'Challenging but worth it',
        'Perfect form cues',
        'Saw results quickly',
        'Easy to follow',
        '',
        '',
        '', // More empty reviews for realism
      ];

      ratings.push({
        userId: randomUser._id,
        rating,
        review: randomChoice(reviews),
        date: randomDate(new Date(2024, 0, 1), new Date()),
      });
    }

    exercise.ratings = ratings;
    exercise.averageRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  }

  // Add ratings to workouts
  for (const workout of workouts) {
    const numRatings = randomBetween(2, 6);
    const ratings = [];

    for (let i = 0; i < numRatings; i++) {
      const randomUser = randomChoice(users.slice(1)); // Exclude admin
      const rating = randomBetween(3, 5);
      const reviews = [
        'Awesome workout!',
        'Perfect difficulty level',
        'Great variety of exercises',
        'Really enjoyed this one',
        'Good progression',
        'Well structured',
        'Felt the burn!',
        'Will do again',
        '',
        '',
      ];

      ratings.push({
        userId: randomUser._id,
        rating,
        review: randomChoice(reviews),
        date: randomDate(new Date(2024, 0, 1), new Date()),
      });
    }

    workout.ratings = ratings;
    workout.averageRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  }
};

// Main import function
const importData = async () => {
  try {
    await connectDB();

    console.log('Starting database seeding process...'.cyan.bold);

    // Clear existing data
    console.log('Clearing existing data...'.yellow);
    await User.deleteMany();
    await Profile.deleteMany();
    await Exercise.deleteMany();
    await Workout.deleteMany();
    await WorkoutSession.deleteMany();
    await NutritionLog.deleteMany();
    await Notification.deleteMany();
    await NutritionItem.deleteMany();
    console.log('Existing data cleared!'.red);

    // 1. Create users first
    console.log('Creating users...'.yellow);
    const createdUsers = await User.create(users);
    console.log(`✓ ${createdUsers.length} users created`.green);

    // 2. Create exercises
    console.log('Creating exercises...'.yellow);
    const createdExercises = await Exercise.create(exercises);
    console.log(`✓ ${createdExercises.length} exercises created`.green);

    // 3. Create nutrition items
    console.log('Creating nutrition items...'.yellow);
    const nutritionItemsWithCreator = nutritionItems.map(item => ({
      ...item,
      createdBy: createdUsers[0]._id, // Admin user as creator
    }));
    const createdNutritionItems = await NutritionItem.create(
      nutritionItemsWithCreator
    );
    console.log(
      `✓ ${createdNutritionItems.length} nutrition items created`.green
    );

    // 4. Generate and create workouts
    console.log('Generating workouts...'.yellow);
    const workoutsData = generateWorkouts(createdUsers, createdExercises);

    // Map exercise names to IDs for predefined workouts
    const exerciseMap = {};
    createdExercises.forEach(ex => {
      exerciseMap[ex.name] = ex._id;
    });

    // Update predefined workouts with actual exercise IDs
    workoutsData.forEach(workout => {
      if (!workout.isCustom) {
        workout.exercises.forEach((exercise, index) => {
          switch (workout.name) {
            case 'Upper Body Strength':
              const upperBodyExercises = [
                'Push-ups',
                'Pull-ups',
                'Bench Press',
                'Shoulder Press',
                'Bicep Curls',
                'Tricep Dips',
              ];
              exercise.exerciseId = exerciseMap[upperBodyExercises[index]];
              break;
            case 'Lower Body Power':
              const lowerBodyExercises = [
                'Squats',
                'Deadlifts',
                'Lunges',
                'Hip Thrusts',
                'Wall Sits',
              ];
              exercise.exerciseId = exerciseMap[lowerBodyExercises[index]];
              break;
            case 'HIIT Cardio Blast':
              const hiitExercises = [
                'Burpees',
                'Mountain Climbers',
                'Jumping Jacks',
                'High Knees',
              ];
              exercise.exerciseId = exerciseMap[hiitExercises[index]];
              break;
            case 'Beginner Full Body':
              const beginnerExercises = [
                'Push-ups',
                'Squats',
                'Planks',
                'Lunges',
                'Bicep Curls',
              ];
              exercise.exerciseId = exerciseMap[beginnerExercises[index]];
              break;
            case 'Core Crusher':
              const coreExercises = [
                'Planks',
                'Russian Twists',
                'Side Planks',
                'Leg Raises',
                'Mountain Climbers',
              ];
              exercise.exerciseId = exerciseMap[coreExercises[index]];
              break;
            case 'Quick Morning Energy':
              const morningExercises = [
                'Jumping Jacks',
                'Squats',
                'High Knees',
                'Planks',
              ];
              exercise.exerciseId = exerciseMap[morningExercises[index]];
              break;
          }
        });
      }
    });

    const createdWorkouts = await Workout.create(workoutsData);
    console.log(`✓ ${createdWorkouts.length} workouts created`.green);

    // 5. Generate and create profiles
    console.log('Generating user profiles...'.yellow);
    const profilesData = generateProfiles(createdUsers);
    const createdProfiles = await Profile.create(profilesData);
    console.log(`✓ ${createdProfiles.length} profiles created`.green);

    // 6. Generate and create workout sessions
    console.log('Generating workout sessions...'.yellow);
    const workoutSessionsData = generateWorkoutSessions(
      createdUsers,
      createdWorkouts
    );
    const createdWorkoutSessions =
      await WorkoutSession.create(workoutSessionsData);
    console.log(
      `✓ ${createdWorkoutSessions.length} workout sessions created`.green
    );

    // 7. Generate and create nutrition logs
    console.log('Generating nutrition logs...'.yellow);
    const nutritionLogsData = generateNutritionLogs(
      createdUsers,
      createdNutritionItems
    );
    const createdNutritionLogs = await NutritionLog.create(nutritionLogsData);
    console.log(
      `✓ ${createdNutritionLogs.length} nutrition logs created`.green
    );

    // 8. Generate and create notifications
    console.log('Generating notifications...'.yellow);
    const notificationsData = generateNotifications(
      createdUsers,
      createdWorkouts,
      createdProfiles
    );
    const createdNotifications = await Notification.create(notificationsData);
    console.log(`✓ ${createdNotifications.length} notifications created`.green);

    // 9. Add ratings to exercises and workouts
    await addRatingsToExercisesAndWorkouts(
      createdUsers,
      createdExercises,
      createdWorkouts
    );

    // Update exercises with ratings
    for (const exercise of createdExercises) {
      await Exercise.findByIdAndUpdate(exercise._id, {
        ratings: exercise.ratings,
        averageRating: exercise.averageRating,
      });
    }

    // Update workouts with ratings
    for (const workout of createdWorkouts) {
      await Workout.findByIdAndUpdate(workout._id, {
        ratings: workout.ratings,
        averageRating: workout.averageRating,
      });
    }
    console.log('✓ Ratings added to exercises and workouts'.green);

    // Display summary
    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY! 🎉'.green.bold);
    console.log('='.repeat(50).cyan);
    console.log(`👥 Users: ${createdUsers.length}`.white);
    console.log(`💪 Exercises: ${createdExercises.length}`.white);
    console.log(`🏋️  Workouts: ${createdWorkouts.length}`.white);
    console.log(`📊 User Profiles: ${createdProfiles.length}`.white);
    console.log(`📝 Workout Sessions: ${createdWorkoutSessions.length}`.white);
    console.log(`🍎 Nutrition Items: ${createdNutritionItems.length}`.white);
    console.log(`📋 Nutrition Logs: ${createdNutritionLogs.length}`.white);
    console.log(`🔔 Notifications: ${createdNotifications.length}`.white);
    console.log('='.repeat(50).cyan);
    console.log('\n📋 Sample Login Credentials:'.yellow.bold);
    console.log('Admin User:'.cyan);
    console.log('  Email: admin@example.com'.white);
    console.log('  Password: admin123'.white);
    console.log('Regular Users:'.cyan);
    console.log('  Email: user1@example.com'.white);
    console.log('  Email: user2@example.com'.white);
    console.log('  Email: user3@example.com'.white);
    console.log('  Email: user4@example.com'.white);
    console.log('  Email: user5@example.com'.white);
    console.log('  Email: user6@example.com'.white);
    console.log('  Email: user7@example.com'.white);
    console.log(`  Password: ${userPassword} (for all users)`.white);
    console.log('\n🚀 Your fitness app database is ready to use!'.green.bold);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error during seeding: ${error.message}`.red.bold);
    console.error(error.stack);
    process.exit(1);
  }
};

// Function to delete all data
const deleteData = async () => {
  try {
    await connectDB();

    console.log('🗑️  Starting data deletion...'.yellow.bold);

    await User.deleteMany();
    await Profile.deleteMany();
    await Exercise.deleteMany();
    await Workout.deleteMany();
    await WorkoutSession.deleteMany();
    await NutritionLog.deleteMany();
    await Notification.deleteMany();
    await NutritionItem.deleteMany();

    console.log('✅ All data has been deleted successfully!'.red.bold);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error during deletion: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Process command line arguments
if (process.argv[2] === '-d') {
  deleteData();
} else if (process.argv[2] === '--help' || process.argv[2] === '-h') {
  console.log('🏋️  Fitness App Database Seeder'.cyan.bold);
  console.log('='.repeat(40));
  console.log('Usage:'.yellow);
  console.log('  node seeder.js          Seed the database with sample data');
  console.log('  node seeder.js -d       Delete all data from database');
  console.log('  node seeder.js --help   Show this help message');
  console.log(
    '\nNote: Make sure your MongoDB connection is configured in .env file'.gray
  );
  process.exit(0);
} else {
  importData();
}
