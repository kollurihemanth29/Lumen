const Discount = require('../models/Discount');
const Plan = require('../models/Plan');

// @desc    Get all active discounts
// @route   GET /api/discounts
// @access  Public
const getActiveDiscounts = async (req, res) => {
  try {
    const { planId, planType, userSegment } = req.query;
    
    const now = new Date();
    const query = {
      'validity.isActive': true,
      'validity.startDate': { $lte: now },
      'validity.endDate': { $gte: now }
    };

    // Filter by plan or plan type if specified
    if (planId || planType) {
      const orConditions = [];
      
      if (planId) {
        orConditions.push({ 'conditions.applicablePlans': planId });
      }
      
      if (planType) {
        orConditions.push({ 'conditions.planTypes': planType });
      }
      
      // Include discounts that apply to all plans
      orConditions.push({ 
        'conditions.applicablePlans': { $size: 0 }, 
        'conditions.planTypes': { $size: 0 } 
      });
      
      query.$or = orConditions;
    }

    const discounts = await Discount.find(query)
      .populate('conditions.applicablePlans', 'name type pricing')
      .select('-usage.usedBy')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: discounts.length,
      data: discounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching discounts',
      error: error.message
    });
  }
};

// @desc    Get discount by code
// @route   GET /api/discounts/code/:code
// @access  Public
const getDiscountByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const { planId } = req.query;

    const discount = await Discount.findOne({ 
      code: code.toUpperCase(),
      'validity.isActive': true 
    }).populate('conditions.applicablePlans', 'name type pricing');

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount code not found or expired'
      });
    }

    if (!discount.isCurrentlyValid()) {
      return res.status(400).json({
        success: false,
        message: 'Discount code is not currently valid'
      });
    }

    // Check if discount is applicable to the specified plan
    if (planId) {
      const canUse = discount.canUserUse(req.user?.id || 'anonymous', planId);
      if (!canUse.canUse) {
        return res.status(400).json({
          success: false,
          message: canUse.reason
        });
      }
    }

    res.json({
      success: true,
      data: discount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching discount',
      error: error.message
    });
  }
};

// @desc    Create new discount
// @route   POST /api/discounts
// @access  Private (Admin)
const createDiscount = async (req, res) => {
  try {
    const {
      name,
      description,
      code,
      type,
      value,
      conditions,
      validity,
      targeting
    } = req.body;

    // Check if discount code already exists
    if (code) {
      const existingDiscount = await Discount.findOne({ code: code.toUpperCase() });
      if (existingDiscount) {
        return res.status(400).json({
          success: false,
          message: 'Discount code already exists'
        });
      }
    }

    const discount = await Discount.create({
      name,
      description,
      code: code?.toUpperCase(),
      type,
      value,
      conditions,
      validity,
      targeting,
      createdBy: req.user.id
    });

    await discount.populate('conditions.applicablePlans', 'name type pricing');

    res.status(201).json({
      success: true,
      message: 'Discount created successfully',
      data: discount
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating discount',
      error: error.message
    });
  }
};

// @desc    Update discount
// @route   PUT /api/discounts/:id
// @access  Private (Admin)
const updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    // Check if discount code is being changed and if it already exists
    if (req.body.code && req.body.code.toUpperCase() !== discount.code) {
      const existingDiscount = await Discount.findOne({ 
        code: req.body.code.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      
      if (existingDiscount) {
        return res.status(400).json({
          success: false,
          message: 'Discount code already exists'
        });
      }
    }

    const updatedDiscount = await Discount.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        code: req.body.code?.toUpperCase(),
        lastModifiedBy: req.user.id
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('conditions.applicablePlans', 'name type pricing');

    res.json({
      success: true,
      message: 'Discount updated successfully',
      data: updatedDiscount
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating discount',
      error: error.message
    });
  }
};

// @desc    Delete discount
// @route   DELETE /api/discounts/:id
// @access  Private (Admin)
const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    // Check if discount has been used
    if (discount.usage.totalUsageCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete discount that has been used. Deactivate it instead.'
      });
    }

    await Discount.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Discount deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting discount',
      error: error.message
    });
  }
};

// @desc    Deactivate discount
// @route   PUT /api/discounts/:id/deactivate
// @access  Private (Admin)
const deactivateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      {
        'validity.isActive': false,
        lastModifiedBy: req.user.id
      },
      { new: true }
    );

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    res.json({
      success: true,
      message: 'Discount deactivated successfully',
      data: discount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating discount',
      error: error.message
    });
  }
};

// @desc    Validate discount for user and plan
// @route   POST /api/discounts/validate
// @access  Private (End-user)
const validateDiscount = async (req, res) => {
  try {
    const { code, planId } = req.body;
    const userId = req.user.id;

    const discount = await Discount.findOne({ 
      code: code.toUpperCase(),
      'validity.isActive': true 
    });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Invalid discount code'
      });
    }

    if (!discount.isCurrentlyValid()) {
      return res.status(400).json({
        success: false,
        message: 'Discount code has expired'
      });
    }

    const canUseResult = discount.canUserUse(userId, planId);
    if (!canUseResult.canUse) {
      return res.status(400).json({
        success: false,
        message: canUseResult.reason
      });
    }

    // Get plan to calculate discount amount
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    const discountAmount = discount.calculateDiscountAmount(plan.pricing.monthlyPrice);
    const finalPrice = plan.pricing.monthlyPrice - discountAmount;

    res.json({
      success: true,
      message: 'Discount is valid',
      data: {
        discount: {
          id: discount._id,
          name: discount.name,
          code: discount.code,
          type: discount.type,
          value: discount.value
        },
        originalPrice: plan.pricing.monthlyPrice,
        discountAmount,
        finalPrice,
        savings: discountAmount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating discount',
      error: error.message
    });
  }
};

// @desc    Get discount analytics
// @route   GET /api/discounts/:id/analytics
// @access  Private (Admin)
const getDiscountAnalytics = async (req, res) => {
  try {
    const discountId = req.params.id;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const discount = await Discount.findById(discountId);
    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    // Filter usage by date range
    const filteredUsage = discount.usage.usedBy.filter(usage => 
      usage.usedAt >= start && usage.usedAt <= end
    );

    const analytics = {
      summary: {
        totalUsage: filteredUsage.length,
        totalDiscountAmount: filteredUsage.reduce((sum, usage) => sum + usage.discountAmount, 0),
        averageDiscountAmount: filteredUsage.length > 0 ? 
          filteredUsage.reduce((sum, usage) => sum + usage.discountAmount, 0) / filteredUsage.length : 0,
        conversionRate: discount.performance.conversionRate,
        remainingUsage: discount.usage.maxUsageLimit ? 
          discount.usage.maxUsageLimit - discount.usage.totalUsageCount : 'Unlimited'
      },
      dailyUsage: {},
      userSegments: {}
    };

    // Group usage by day
    filteredUsage.forEach(usage => {
      const date = usage.usedAt.toISOString().split('T')[0];
      if (!analytics.dailyUsage[date]) {
        analytics.dailyUsage[date] = { count: 0, amount: 0 };
      }
      analytics.dailyUsage[date].count++;
      analytics.dailyUsage[date].amount += usage.discountAmount;
    });

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching discount analytics',
      error: error.message
    });
  }
};

// @desc    Get all discounts for admin
// @route   GET /api/discounts/admin/all
// @access  Private (Admin)
const getAllDiscountsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    
    const query = {};
    if (status) {
      switch (status) {
        case 'active':
          const now = new Date();
          query['validity.isActive'] = true;
          query['validity.startDate'] = { $lte: now };
          query['validity.endDate'] = { $gte: now };
          break;
        case 'inactive':
          query['validity.isActive'] = false;
          break;
        case 'expired':
          query['validity.endDate'] = { $lt: new Date() };
          break;
      }
    }
    
    if (type) query.type = type;

    const discounts = await Discount.find(query)
      .populate('createdBy', 'name email')
      .populate('conditions.applicablePlans', 'name type')
      .select('-usage.usedBy')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Discount.countDocuments(query);

    res.json({
      success: true,
      count: discounts.length,
      total,
      pages: Math.ceil(total / limit),
      data: discounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching discounts',
      error: error.message
    });
  }
};

module.exports = {
  getActiveDiscounts,
  getDiscountByCode,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  deactivateDiscount,
  validateDiscount,
  getDiscountAnalytics,
  getAllDiscountsAdmin
};
