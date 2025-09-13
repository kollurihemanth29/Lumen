const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');

// @desc    Get all available plans
// @route   GET /api/plans
// @access  Public
const getAllPlans = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, region, sortBy = 'popularity' } = req.query;
    
    const query = { 'availability.isActive': true };
    
    if (type) query.type = type;
    if (minPrice || maxPrice) {
      query['pricing.monthlyPrice'] = {};
      if (minPrice) query['pricing.monthlyPrice'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.monthlyPrice'].$lte = Number(maxPrice);
    }
    if (region) query['availability.regions'] = region;

    let sortOptions = {};
    switch (sortBy) {
      case 'price_low':
        sortOptions = { 'pricing.monthlyPrice': 1 };
        break;
      case 'price_high':
        sortOptions = { 'pricing.monthlyPrice': -1 };
        break;
      case 'popularity':
        sortOptions = { 'popularity.subscriptionCount': -1 };
        break;
      case 'rating':
        sortOptions = { 'popularity.rating': -1 };
        break;
      default:
        sortOptions = { 'popularity.subscriptionCount': -1 };
    }

    const plans = await Plan.find(query)
      .sort(sortOptions)
      .populate('createdBy', 'name')
      .select('-__v');

    res.json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching plans',
      error: error.message
    });
  }
};

// @desc    Get single plan by ID
// @route   GET /api/plans/:id
// @access  Public
const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('popularity.reviews.userId', 'name');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching plan',
      error: error.message
    });
  }
};

// @desc    Create new plan
// @route   POST /api/plans
// @access  Private (Admin)
const createPlan = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      pricing,
      features,
      availability,
      targetAudience
    } = req.body;

    const plan = await Plan.create({
      name,
      description,
      type,
      pricing,
      features,
      availability,
      targetAudience,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      data: plan
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
      message: 'Error creating plan',
      error: error.message
    });
  }
};

// @desc    Update plan
// @route   PUT /api/plans/:id
// @access  Private (Admin)
const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // Check if there are active subscriptions before allowing certain changes
    const activeSubscriptions = await Subscription.countDocuments({
      planId: req.params.id,
      status: 'active'
    });

    if (activeSubscriptions > 0 && req.body.pricing) {
      // If there are active subscriptions, create a new version or handle price changes carefully
      return res.status(400).json({
        success: false,
        message: 'Cannot modify pricing for plans with active subscriptions. Consider creating a new plan version.'
      });
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        lastModifiedBy: req.user.id
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      message: 'Plan updated successfully',
      data: updatedPlan
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
      message: 'Error updating plan',
      error: error.message
    });
  }
};

// @desc    Delete plan
// @route   DELETE /api/plans/:id
// @access  Private (Admin)
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // Check for active subscriptions
    const activeSubscriptions = await Subscription.countDocuments({
      planId: req.params.id,
      status: 'active'
    });

    if (activeSubscriptions > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete plan with ${activeSubscriptions} active subscriptions. Deactivate the plan instead.`
      });
    }

    await Plan.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Plan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting plan',
      error: error.message
    });
  }
};

// @desc    Deactivate plan
// @route   PUT /api/plans/:id/deactivate
// @access  Private (Admin)
const deactivatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      {
        'availability.isActive': false,
        lastModifiedBy: req.user.id
      },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Plan deactivated successfully',
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating plan',
      error: error.message
    });
  }
};

// @desc    Add review to plan
// @route   POST /api/plans/:id/reviews
// @access  Private (End-user)
const addPlanReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const planId = req.params.id;
    const userId = req.user.id;

    // Check if user has an active or past subscription to this plan
    const subscription = await Subscription.findOne({
      userId,
      planId,
      status: { $in: ['active', 'cancelled', 'expired'] }
    });

    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: 'You can only review plans you have subscribed to'
      });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // Check if user already reviewed this plan
    const existingReviewIndex = plan.popularity.reviews.findIndex(
      review => review.userId.toString() === userId
    );

    if (existingReviewIndex >= 0) {
      // Update existing review
      plan.popularity.reviews[existingReviewIndex] = {
        userId,
        rating,
        comment,
        createdAt: new Date()
      };
    } else {
      // Add new review
      plan.popularity.reviews.push({
        userId,
        rating,
        comment,
        createdAt: new Date()
      });
    }

    // Recalculate average rating
    const totalRating = plan.popularity.reviews.reduce((sum, review) => sum + review.rating, 0);
    plan.popularity.rating = totalRating / plan.popularity.reviews.length;

    await plan.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      data: plan.popularity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};

// @desc    Get popular plans
// @route   GET /api/plans/popular
// @access  Public
const getPopularPlans = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const popularPlans = await Plan.getPopularPlans(Number(limit));

    res.json({
      success: true,
      count: popularPlans.length,
      data: popularPlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular plans',
      error: error.message
    });
  }
};

// @desc    Get plan analytics
// @route   GET /api/plans/:id/analytics
// @access  Private (Admin)
const getPlanAnalytics = async (req, res) => {
  try {
    const planId = req.params.id;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default 30 days
    const end = endDate ? new Date(endDate) : new Date();

    // Get subscription analytics for this plan
    const subscriptionStats = await Subscription.aggregate([
      {
        $match: {
          planId: require('mongoose').Types.ObjectId(planId),
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalSubscriptions: { $sum: 1 },
          activeSubscriptions: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          cancelledSubscriptions: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$pricing.finalPrice' },
          averagePrice: { $avg: '$pricing.finalPrice' }
        }
      }
    ]);

    // Get monthly trends
    const monthlyTrends = await Subscription.aggregate([
      {
        $match: {
          planId: require('mongoose').Types.ObjectId(planId),
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          subscriptions: { $sum: 1 },
          revenue: { $sum: '$pricing.finalPrice' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const analytics = {
      summary: subscriptionStats[0] || {
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        cancelledSubscriptions: 0,
        totalRevenue: 0,
        averagePrice: 0
      },
      monthlyTrends,
      churnRate: subscriptionStats[0] ? 
        (subscriptionStats[0].cancelledSubscriptions / subscriptionStats[0].totalSubscriptions * 100) : 0
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching plan analytics',
      error: error.message
    });
  }
};

module.exports = {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  deactivatePlan,
  addPlanReview,
  getPopularPlans,
  getPlanAnalytics
};
