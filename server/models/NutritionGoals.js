const mongoose = require('mongoose');

const nutritionGoalsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One goals document per user
    },
    // Main macronutrients (daily targets)
    calories: {
      type: Number,
      required: true,
      min: 1200,
      default: 2000,
    },
    protein: {
      type: Number,
      required: true,
      min: 0,
      default: 120,
    },
    carbs: {
      type: Number,
      required: true,
      min: 0,
      default: 250,
    },
    fat: {
      type: Number,
      required: true,
      min: 0,
      default: 65,
    },
    // Other nutrients (daily targets)
    fiber: {
      type: Number,
      min: 0,
      default: 30,
    },
    sugar: {
      type: Number,
      min: 0,
      default: 50,
    },
    sodium: {
      type: Number,
      min: 0,
      default: 2300,
    },
    water: {
      type: Number,
      min: 0,
      default: 2500,
    },
    // Vitamins & Minerals (daily targets)
    vitaminC: {
      type: Number,
      min: 0,
      default: 75,
    },
    calcium: {
      type: Number,
      min: 0,
      default: 1000,
    },
    iron: {
      type: Number,
      min: 0,
      default: 18,
    },
    // Goal type/plan for reference
    goalType: {
      type: String,
      enum: [
        'weightLoss',
        'maintenance',
        'muscleGain',
        'ketogenic',
        'lowCarb',
        'custom',
      ],
      default: 'maintenance',
    },
    // User's activity level
    activityLevel: {
      type: String,
      enum: [
        'sedentary',
        'lightly_active',
        'moderately_active',
        'very_active',
        'extra_active',
      ],
      default: 'moderately_active',
    },
    // User stats for goal calculation
    age: {
      type: Number,
      min: 1,
      max: 150,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    height: {
      type: Number, // in cm
      min: 50,
      max: 300,
    },
    currentWeight: {
      type: Number, // in kg
      min: 20,
      max: 500,
    },
    targetWeight: {
      type: Number, // in kg
      min: 20,
      max: 500,
    },
    // Auto-update preferences
    autoCalculate: {
      type: Boolean,
      default: false, // Whether to auto-calculate goals based on user stats
    },
    lastCalculated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user lookups
nutritionGoalsSchema.index({ userId: 1 });

// Virtual for weekly goals
nutritionGoalsSchema.virtual('weeklyGoals').get(function () {
  return {
    calories: this.calories * 7,
    protein: this.protein * 7,
    carbs: this.carbs * 7,
    fat: this.fat * 7,
    fiber: this.fiber * 7,
    sugar: this.sugar * 7,
    sodium: this.sodium * 7,
    water: this.water * 7,
    vitaminC: this.vitaminC * 7,
    calcium: this.calcium * 7,
    iron: this.iron * 7,
  };
});

// Method to calculate BMR (Basal Metabolic Rate)
nutritionGoalsSchema.methods.calculateBMR = function () {
  if (!this.age || !this.gender || !this.height || !this.currentWeight) {
    return null;
  }

  let bmr;

  // Mifflin-St Jeor Equation
  if (this.gender === 'male') {
    bmr = 10 * this.currentWeight + 6.25 * this.height - 5 * this.age + 5;
  } else {
    bmr = 10 * this.currentWeight + 6.25 * this.height - 5 * this.age - 161;
  }

  return Math.round(bmr);
};

// Method to calculate TDEE (Total Daily Energy Expenditure)
nutritionGoalsSchema.methods.calculateTDEE = function () {
  const bmr = this.calculateBMR();
  if (!bmr) return null;

  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };

  const multiplier = activityMultipliers[this.activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
};

// Method to auto-calculate goals based on user stats and goal type
nutritionGoalsSchema.methods.autoCalculateGoals = function () {
  const tdee = this.calculateTDEE();
  if (!tdee) return false;

  let calorieAdjustment = 0;
  let proteinPerKg = 1.6; // default protein per kg body weight
  let carbPercent = 50; // default carb percentage
  let fatPercent = 25; // default fat percentage

  // Adjust based on goal type
  switch (this.goalType) {
    case 'weightLoss':
      calorieAdjustment = -500; // 500 calorie deficit
      proteinPerKg = 2.0; // Higher protein for muscle preservation
      carbPercent = 40;
      fatPercent = 30;
      break;
    case 'muscleGain':
      calorieAdjustment = 300; // 300 calorie surplus
      proteinPerKg = 2.2; // Higher protein for muscle building
      carbPercent = 45;
      fatPercent = 25;
      break;
    case 'ketogenic':
      calorieAdjustment = 0;
      proteinPerKg = 1.8;
      carbPercent = 5; // Very low carbs
      fatPercent = 75; // High fat
      break;
    case 'lowCarb':
      calorieAdjustment = 0;
      proteinPerKg = 2.0;
      carbPercent = 20; // Low carbs
      fatPercent = 35;
      break;
    default: // maintenance
      calorieAdjustment = 0;
      proteinPerKg = 1.6;
      carbPercent = 50;
      fatPercent = 25;
  }

  // Calculate macros
  this.calories = Math.max(1200, tdee + calorieAdjustment);
  this.protein = Math.round(this.currentWeight * proteinPerKg);

  const proteinCalories = this.protein * 4;
  const remainingCalories = this.calories - proteinCalories;
  const carbCalories = (remainingCalories * carbPercent) / 100;
  const fatCalories = (remainingCalories * fatPercent) / 100;

  this.carbs = Math.round(carbCalories / 4);
  this.fat = Math.round(fatCalories / 9);

  // Set other nutrient goals based on standard recommendations
  this.fiber = Math.max(25, Math.round(this.calories / 100));
  this.sugar = Math.round((this.calories * 0.1) / 4);
  this.sodium = 2300;
  this.water = Math.max(2000, this.currentWeight * 35);
  this.lastCalculated = new Date();
  return true;
};

// Pre-save middleware to auto-calculate if enabled
nutritionGoalsSchema.pre('save', function (next) {
  if (
    this.autoCalculate &&
    this.isModified([
      'age',
      'gender',
      'height',
      'currentWeight',
      'goalType',
      'activityLevel',
    ])
  ) {
    this.autoCalculateGoals();
  }
  next();
});

const NutritionGoals = mongoose.model('NutritionGoals', nutritionGoalsSchema);

module.exports = NutritionGoals;
