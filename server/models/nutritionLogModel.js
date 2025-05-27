const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  unit: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    default: 0,
  },
  carbs: {
    type: Number,
    default: 0,
  },
  fat: {
    type: Number,
    default: 0,
  },
  // Additional nutrients for goals tracking
  fiber: {
    type: Number,
    default: 0,
  },
  sugar: {
    type: Number,
    default: 0,
  },
  sodium: {
    type: Number,
    default: 0,
  },
  vitaminC: {
    type: Number,
    default: 0,
  },
  calcium: {
    type: Number,
    default: 0,
  },
  iron: {
    type: Number,
    default: 0,
  },
});

const mealSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
  },
  time: {
    type: Date,
    default: Date.now,
  },
  foods: [foodSchema],
  notes: {
    type: String,
  },
});

const nutritionLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    meals: [mealSchema],
    waterIntake: {
      type: Number, // in ml
      default: 0,
    },
    // Main macronutrients totals
    totalCalories: {
      type: Number,
      default: 0,
    },
    totalProtein: {
      type: Number,
      default: 0,
    },
    totalCarbs: {
      type: Number,
      default: 0,
    },
    totalFat: {
      type: Number,
      default: 0,
    },
    // Additional nutrients totals
    totalFiber: {
      type: Number,
      default: 0,
    },
    totalSugar: {
      type: Number,
      default: 0,
    },
    totalSodium: {
      type: Number,
      default: 0,
    },
    totalVitaminC: {
      type: Number,
      default: 0,
    },
    totalCalcium: {
      type: Number,
      default: 0,
    },
    totalIron: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate totals before saving
nutritionLogSchema.pre('save', function (next) {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;
  let sugar = 0;
  let sodium = 0;
  let vitaminC = 0;
  let calcium = 0;
  let iron = 0;

  this.meals.forEach(meal => {
    meal.foods.forEach(food => {
      const quantity = food.quantity || 1;
      calories += (food.calories || 0) * quantity;
      protein += (food.protein || 0) * quantity;
      carbs += (food.carbs || 0) * quantity;
      fat += (food.fat || 0) * quantity;
      fiber += (food.fiber || 0) * quantity;
      sugar += (food.sugar || 0) * quantity;
      sodium += (food.sodium || 0) * quantity;
      vitaminC += (food.vitaminC || 0) * quantity;
      calcium += (food.calcium || 0) * quantity;
      iron += (food.iron || 0) * quantity;
    });
  });

  // Set calculated totals
  this.totalCalories = Math.round(calories);
  this.totalProtein = Math.round(protein * 10) / 10;
  this.totalCarbs = Math.round(carbs * 10) / 10;
  this.totalFat = Math.round(fat * 10) / 10;
  this.totalFiber = Math.round(fiber * 10) / 10;
  this.totalSugar = Math.round(sugar * 10) / 10;
  this.totalSodium = Math.round(sodium);
  this.totalVitaminC = Math.round(vitaminC * 10) / 10;
  this.totalCalcium = Math.round(calcium);
  this.totalIron = Math.round(iron * 10) / 10;

  next();
});

// Add index for efficient queries
nutritionLogSchema.index({ userId: 1, date: 1 });

const NutritionLog = mongoose.model('NutritionLog', nutritionLogSchema);

module.exports = NutritionLog;
