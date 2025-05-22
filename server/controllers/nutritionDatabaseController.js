const NutritionItem = require('../models/NutritionItem');

// @desc    Get all nutrition items
// @route   GET /api/admin/nutrition
// @access  Private/Admin
exports.getNutritionItems = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Count total documents
    const total = await NutritionItem.countDocuments(query);

    // Get nutrition items
    const nutritionItems = await NutritionItem.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ name: 1 });

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.json({
      success: true,
      count: nutritionItems.length,
      pagination: {
        ...pagination,
        total,
        pages: Math.ceil(total / limit),
        page: parseInt(page),
        limit: parseInt(limit),
      },
      data: nutritionItems,
    });
  } catch (error) {
    console.error('Error in getNutritionItems:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Get single nutrition item
// @route   GET /api/admin/nutrition/:id
// @access  Private/Admin
exports.getNutritionItem = async (req, res) => {
  try {
    const nutritionItem = await NutritionItem.findById(req.params.id);

    if (!nutritionItem) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Nutrition item not found',
        },
      });
    }

    res.json({
      success: true,
      data: nutritionItem,
    });
  } catch (error) {
    console.error('Error in getNutritionItem:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Create nutrition item
// @route   POST /api/admin/nutrition
// @access  Private/Admin
exports.createNutritionItem = async (req, res) => {
  try {
    const {
      name,
      category,
      servingSize,
      servingUnit,
      calories,
      protein,
      carbs,
      fat,
    } = req.body;

    // Create nutrition item
    const nutritionItem = await NutritionItem.create({
      name,
      category,
      servingSize,
      servingUnit,
      calories,
      protein,
      carbs,
      fat,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: nutritionItem,
      message: 'Nutrition item created successfully',
    });
  } catch (error) {
    console.error('Error in createNutritionItem:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Update nutrition item
// @route   PUT /api/admin/nutrition/:id
// @access  Private/Admin
exports.updateNutritionItem = async (req, res) => {
  try {
    const {
      name,
      category,
      servingSize,
      servingUnit,
      calories,
      protein,
      carbs,
      fat,
    } = req.body;

    const nutritionItem = await NutritionItem.findById(req.params.id);

    if (!nutritionItem) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Nutrition item not found',
        },
      });
    }

    // Update fields
    if (name) {
      nutritionItem.name = name;
    }
    if (category) {
      nutritionItem.category = category;
    }
    if (servingSize) {
      nutritionItem.servingSize = servingSize;
    }
    if (servingUnit) {
      nutritionItem.servingUnit = servingUnit;
    }
    if (calories !== undefined) {
      nutritionItem.calories = calories;
    }
    if (protein !== undefined) {
      nutritionItem.protein = protein;
    }
    if (carbs !== undefined) {
      nutritionItem.carbs = carbs;
    }
    if (fat !== undefined) {
      nutritionItem.fat = fat;
    }

    // Save nutrition item
    await nutritionItem.save();

    res.json({
      success: true,
      data: nutritionItem,
      message: 'Nutrition item updated successfully',
    });
  } catch (error) {
    console.error('Error in updateNutritionItem:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};

// @desc    Delete nutrition item
// @route   DELETE /api/admin/nutrition/:id
// @access  Private/Admin
exports.deleteNutritionItem = async (req, res) => {
  try {
    const nutritionItem = await NutritionItem.findById(req.params.id);

    if (!nutritionItem) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Nutrition item not found',
        },
      });
    }

    await nutritionItem.deleteOne();

    res.json({
      success: true,
      message: 'Nutrition item deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteNutritionItem:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error',
      },
    });
  }
};
