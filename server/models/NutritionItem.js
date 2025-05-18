const mongoose = require('mongoose');

// Create a schema for nutrition items
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

// Create model
const NutritionItem = mongoose.model('NutritionItem', nutritionItemSchema);

module.exports = NutritionItem;