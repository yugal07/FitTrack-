const NutritionGoals = require('../models/NutritionGoals.js');

// @desc    Get user's nutrition goals
// @route   GET /api/nutrition/goals
// @access  Private
exports.getNutritionGoals = async (req, res) => {
  try {
    let nutritionGoals = await NutritionGoals.findOne({ userId: req.user._id });

    // If no goals exist, create default goals
    if (!nutritionGoals) {
      nutritionGoals = await NutritionGoals.create({
        userId: req.user._id,
        calories: 2000,
        protein: 120,
        carbs: 250,
        fat: 65,
        fiber: 30,
        sugar: 50,
        sodium: 2300,
        water: 2500,
        vitaminC: 75,
        calcium: 1000,
        iron: 18,
        goalType: 'maintenance',
        activityLevel: 'moderately_active',
      });
    }

    res.json({
      success: true,
      data: nutritionGoals,
    });
  } catch (error) {
    console.error('Error in getNutritionGoals:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Create or update user's nutrition goals
// @route   POST /api/nutrition/goals
// @access  Private
exports.setNutritionGoals = async (req, res) => {
  try {
    const {
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      sodium,
      water,
      vitaminC,
      calcium,
      iron,
      goalType,
      activityLevel,
      age,
      gender,
      height,
      currentWeight,
      targetWeight,
      autoCalculate,
    } = req.body;

    // Validation
    if (calories && calories < 1200) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATA',
          message: 'Daily calorie goal should be at least 1200',
        },
      });
    }

    // Check if goals already exist
    let nutritionGoals = await NutritionGoals.findOne({ userId: req.user._id });

    const goalData = {
      userId: req.user._id,
      ...(calories !== undefined && { calories }),
      ...(protein !== undefined && { protein }),
      ...(carbs !== undefined && { carbs }),
      ...(fat !== undefined && { fat }),
      ...(fiber !== undefined && { fiber }),
      ...(sugar !== undefined && { sugar }),
      ...(sodium !== undefined && { sodium }),
      ...(water !== undefined && { water }),
      ...(vitaminC !== undefined && { vitaminC }),
      ...(calcium !== undefined && { calcium }),
      ...(iron !== undefined && { iron }),
      ...(goalType && { goalType }),
      ...(activityLevel && { activityLevel }),
      ...(age !== undefined && { age }),
      ...(gender && { gender }),
      ...(height !== undefined && { height }),
      ...(currentWeight !== undefined && { currentWeight }),
      ...(targetWeight !== undefined && { targetWeight }),
      ...(autoCalculate !== undefined && { autoCalculate }),
    };

    if (nutritionGoals) {
      // Update existing goals
      Object.assign(nutritionGoals, goalData);
      await nutritionGoals.save();
    } else {
      // Create new goals
      nutritionGoals = await NutritionGoals.create(goalData);
    }

    res.json({
      success: true,
      data: nutritionGoals,
      message: 'Nutrition goals updated successfully',
    });
  } catch (error) {
    console.error('Error in setNutritionGoals:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: messages.join(', '),
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Auto-calculate nutrition goals based on user stats
// @route   POST /api/nutrition/goals/calculate
// @access  Private
exports.calculateNutritionGoals = async (req, res) => {
  try {
    const {
      age,
      gender,
      height,
      currentWeight,
      targetWeight,
      activityLevel,
      goalType,
    } = req.body;

    // Validation for required fields
    if (
      !age ||
      !gender ||
      !height ||
      !currentWeight ||
      !activityLevel ||
      !goalType
    ) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATA',
          message:
            'Age, gender, height, current weight, activity level, and goal type are required for calculation',
        },
      });
    }

    // Find or create nutrition goals
    let nutritionGoals = await NutritionGoals.findOne({ userId: req.user._id });

    if (!nutritionGoals) {
      nutritionGoals = new NutritionGoals({ userId: req.user._id });
    }

    // Update user stats
    nutritionGoals.age = age;
    nutritionGoals.gender = gender;
    nutritionGoals.height = height;
    nutritionGoals.currentWeight = currentWeight;
    nutritionGoals.targetWeight = targetWeight;
    nutritionGoals.activityLevel = activityLevel;
    nutritionGoals.goalType = goalType;
    nutritionGoals.autoCalculate = true;

    // Calculate goals
    const calculated = nutritionGoals.autoCalculateGoals();

    if (!calculated) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CALCULATION_ERROR',
          message: 'Unable to calculate goals with provided information',
        },
      });
    }

    // Save the calculated goals
    await nutritionGoals.save();

    // Calculate additional info to return
    const bmr = nutritionGoals.calculateBMR();
    const tdee = nutritionGoals.calculateTDEE();

    res.json({
      success: true,
      data: nutritionGoals,
      calculationInfo: {
        bmr,
        tdee,
        calculatedAt: new Date(),
      },
      message: 'Nutrition goals calculated and updated successfully',
    });
  } catch (error) {
    console.error('Error in calculateNutritionGoals:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Get goal recommendations based on user stats
// @route   GET /api/nutrition/goals/recommendations
// @access  Private
exports.getGoalRecommendations = async (req, res) => {
  try {
    const { age, gender, height, currentWeight, activityLevel } = req.query;

    if (!age || !gender || !height || !currentWeight || !activityLevel) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATA',
          message:
            'Age, gender, height, current weight, and activity level are required',
        },
      });
    }

    // Create temporary goals object for calculations
    const tempGoals = new NutritionGoals({
      userId: req.user._id,
      age: parseInt(age),
      gender,
      height: parseFloat(height),
      currentWeight: parseFloat(currentWeight),
      activityLevel,
    });

    const bmr = tempGoals.calculateBMR();
    const tdee = tempGoals.calculateTDEE();

    if (!bmr || !tdee) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CALCULATION_ERROR',
          message:
            'Unable to calculate recommendations with provided information',
        },
      });
    }

    // Generate recommendations for different goal types
    const recommendations = {
      weightLoss: {
        calories: Math.max(1200, tdee - 500),
        protein: Math.round(parseFloat(currentWeight) * 2.0),
        description: 'For healthy weight loss of 0.5-1 kg per week',
      },
      maintenance: {
        calories: tdee,
        protein: Math.round(parseFloat(currentWeight) * 1.6),
        description: 'To maintain current weight and body composition',
      },
      muscleGain: {
        calories: tdee + 300,
        protein: Math.round(parseFloat(currentWeight) * 2.2),
        description: 'For lean muscle gain with minimal fat gain',
      },
      ketogenic: {
        calories: tdee,
        protein: Math.round(parseFloat(currentWeight) * 1.8),
        description: 'For ketosis and fat burning',
      },
      lowCarb: {
        calories: tdee,
        protein: Math.round(parseFloat(currentWeight) * 2.0),
        description: 'For reduced carbohydrate intake',
      },
    };

    // Calculate macros for each recommendation
    Object.keys(recommendations).forEach(goalType => {
      const rec = recommendations[goalType];
      const proteinCalories = rec.protein * 4;
      const remainingCalories = rec.calories - proteinCalories;

      switch (goalType) {
        case 'ketogenic':
          rec.carbs = Math.round((rec.calories * 0.05) / 4); // 5% carbs
          rec.fat = Math.round((rec.calories * 0.75 - proteinCalories) / 9); // 75% fat
          break;
        case 'lowCarb':
          rec.carbs = Math.round((rec.calories * 0.2) / 4); // 20% carbs
          rec.fat = Math.round((remainingCalories * 0.35) / 9); // 35% fat
          break;
        default:
          rec.carbs = Math.round((remainingCalories * 0.5) / 4); // 50% carbs
          rec.fat = Math.round((remainingCalories * 0.25) / 9); // 25% fat
      }
    });

    res.json({
      success: true,
      data: {
        userStats: {
          bmr,
          tdee,
          age: parseInt(age),
          gender,
          height: parseFloat(height),
          currentWeight: parseFloat(currentWeight),
          activityLevel,
        },
        recommendations,
      },
    });
  } catch (error) {
    console.error('Error in getGoalRecommendations:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Reset nutrition goals to defaults
// @route   DELETE /api/nutrition/goals
// @access  Private
exports.resetNutritionGoals = async (req, res) => {
  try {
    const nutritionGoals = await NutritionGoals.findOne({
      userId: req.user._id,
    });

    if (!nutritionGoals) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'GOALS_NOT_FOUND',
          message: 'No nutrition goals found to reset',
        },
      });
    }

    // Reset to defaults
    nutritionGoals.calories = 2000;
    nutritionGoals.protein = 120;
    nutritionGoals.carbs = 250;
    nutritionGoals.fat = 65;
    nutritionGoals.fiber = 30;
    nutritionGoals.sugar = 50;
    nutritionGoals.sodium = 2300;
    nutritionGoals.water = 2500;
    nutritionGoals.vitaminC = 75;
    nutritionGoals.calcium = 1000;
    nutritionGoals.iron = 18;
    nutritionGoals.goalType = 'maintenance';
    nutritionGoals.activityLevel = 'moderately_active';
    nutritionGoals.autoCalculate = false;

    await nutritionGoals.save();

    res.json({
      success: true,
      data: nutritionGoals,
      message: 'Nutrition goals reset to defaults',
    });
  } catch (error) {
    console.error('Error in resetNutritionGoals:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};
