const mongoose = require('mongoose');

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

// Calculate totals before saving
nutritionLogSchema.pre('save', function(next) {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  this.meals.forEach(meal => {
    meal.foods.forEach(food => {
      calories += food.calories * food.quantity;
      protein += food.protein * food.quantity;
      carbs += food.carbs * food.quantity;
      fat += food.fat * food.quantity;
    });
  });

  this.totalCalories = calories;
  this.totalProtein = protein;
  this.totalCarbs = carbs;
  this.totalFat = fat;

  next();
});

const NutritionLog = mongoose.model('NutritionLog', nutritionLogSchema);

module.exports = NutritionLog;