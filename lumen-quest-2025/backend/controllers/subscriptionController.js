const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const User = require('../models/User');
const Usage = require('../models/Usage');
const Discount = require('../models/Discount');

// @desc    Get all subscriptions for a user
// @route   GET /api/subscriptions
// @access  Private (End-user)
const getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user.id })
      .populate('planId', 'name description pricing features')
      .populate('discounts.discountId', 'name code type value')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscriptions',
      error: error.message
    });
  }
};

// @desc    Subscribe to a plan
// @route   POST /api/subscriptions/subscribe
// @access  Private (End-user)
const subscribeToPlan = async (req, res) => {
  try {
    const { planId, discountCode, autoRenew = false } = req.body;

    // Check if plan exists and is active
    const plan = await Plan.findById(planId);
    if (!plan || !plan.isCurrentlyAvailable()) {
      return res.status(400).json({
        success: false,
        message: 'Plan not available'
      });
    }

    // Check if user already has an active subscription to this plan
    const existingSubscription = await Subscription.findOne({
      userId: req.user.id,
      planId,
      status: 'active'
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription to this plan'
      });
    }

    let finalPrice = plan.pricing.monthlyPrice;
    let discountApplied = 0;
    let appliedDiscounts = [];

    // Apply discount if provided
    if (discountCode) {
      const discount = await Discount.findOne({ 
        code: discountCode.toUpperCase(),
        'validity.isActive': true 
      });

      if (discount && discount.isCurrentlyValid()) {
        const canUseResult = discount.canUserUse(req.user.id, planId);
        if (canUseResult.canUse) {
          discountApplied = discount.calculateDiscountAmount(finalPrice);
          finalPrice -= discountApplied;
          
          appliedDiscounts.push({
            discountId: discount._id,
            appliedAt: new Date(),
            discountAmount: discountApplied,
            validUntil: discount.validity.endDate
          });

          // Record discount usage
          await discount.applyToUser(req.user.id, null, plan.pricing.monthlyPrice);
        }
      }
    }

    // Calculate billing dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Default to monthly billing

    // Create subscription
    const subscription = await Subscription.create({
      userId: req.user.id,
      planId,
      status: 'active',
      billing: {
        startDate,
        endDate,
        nextBillingDate: endDate,
        autoRenew
      },
      pricing: {
        basePrice: plan.pricing.monthlyPrice,
        discountApplied,
        finalPrice,
        currency: plan.pricing.currency
      },
      discounts: appliedDiscounts,
      history: [{
        action: 'subscribed',
        newPlanId: planId,
        performedBy: req.user.id,
        timestamp: new Date()
      }],
      createdBy: req.user.id
    });

    // Create initial usage record
    await Usage.create({
      subscriptionId: subscription._id,
      userId: req.user.id,
      planId,
      period: {
        startDate,
        endDate,
        billingCycle: 'monthly'
      },
      quotaStatus: {
        allocated: plan.features.dataQuota,
        remaining: plan.features.dataQuota,
        isUnlimited: plan.features.isUnlimited
      },
      alerts: [
        { type: 'quota_warning', threshold: 80 },
        { type: 'quota_exceeded', threshold: 100 }
      ]
    });

    // Update plan subscription count
    await Plan.findByIdAndUpdate(planId, {
      $inc: { 'popularity.subscriptionCount': 1 }
    });

    const populatedSubscription = await Subscription.findById(subscription._id)
      .populate('planId', 'name description pricing features')
      .populate('discounts.discountId', 'name code type value');

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to plan',
      data: populatedSubscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating subscription',
      error: error.message
    });
  }
};

// @desc    Upgrade or downgrade subscription
// @route   PUT /api/subscriptions/:id/change-plan
// @access  Private (End-user)
const changePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPlanId, reason } = req.body;

    const subscription = await Subscription.findOne({
      _id: id,
      userId: req.user.id,
      status: 'active'
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Active subscription not found'
      });
    }

    const newPlan = await Plan.findById(newPlanId);
    if (!newPlan || !newPlan.isCurrentlyAvailable()) {
      return res.status(400).json({
        success: false,
        message: 'New plan not available'
      });
    }

    const oldPlan = await Plan.findById(subscription.planId);
    const isUpgrade = newPlan.pricing.monthlyPrice > oldPlan.pricing.monthlyPrice;

    // Update subscription
    await subscription.changePlan(newPlanId, req.user.id, reason);

    // Update pricing
    subscription.pricing.basePrice = newPlan.pricing.monthlyPrice;
    subscription.pricing.finalPrice = newPlan.pricing.monthlyPrice; // Recalculate with discounts if needed
    await subscription.save();

    // Update usage record
    await Usage.findOneAndUpdate(
      { subscriptionId: subscription._id },
      {
        planId: newPlanId,
        'quotaStatus.allocated': newPlan.features.dataQuota,
        'quotaStatus.isUnlimited': newPlan.features.isUnlimited
      }
    );

    // Update plan subscription counts
    await Plan.findByIdAndUpdate(oldPlan._id, {
      $inc: { 'popularity.subscriptionCount': -1 }
    });
    await Plan.findByIdAndUpdate(newPlanId, {
      $inc: { 'popularity.subscriptionCount': 1 }
    });

    const updatedSubscription = await Subscription.findById(subscription._id)
      .populate('planId', 'name description pricing features');

    res.json({
      success: true,
      message: `Successfully ${isUpgrade ? 'upgraded' : 'downgraded'} subscription`,
      data: updatedSubscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing subscription plan',
      error: error.message
    });
  }
};

// @desc    Cancel subscription
// @route   PUT /api/subscriptions/:id/cancel
// @access  Private (End-user)
const cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const subscription = await Subscription.findOne({
      _id: id,
      userId: req.user.id,
      status: 'active'
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Active subscription not found'
      });
    }

    await subscription.cancel(req.user.id, reason);

    // Update plan subscription count
    await Plan.findByIdAndUpdate(subscription.planId, {
      $inc: { 'popularity.subscriptionCount': -1 }
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription',
      error: error.message
    });
  }
};

// @desc    Renew subscription
// @route   PUT /api/subscriptions/:id/renew
// @access  Private (End-user)
const renewSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { billingCycle = 'monthly' } = req.body;

    const subscription = await Subscription.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    await subscription.renew(req.user.id, billingCycle);

    // Create new usage record for the new period
    await Usage.create({
      subscriptionId: subscription._id,
      userId: req.user.id,
      planId: subscription.planId,
      period: {
        startDate: new Date(),
        endDate: subscription.billing.endDate,
        billingCycle
      },
      quotaStatus: {
        allocated: subscription.planId.features?.dataQuota || 0,
        remaining: subscription.planId.features?.dataQuota || 0,
        isUnlimited: subscription.planId.features?.isUnlimited || false
      }
    });

    const renewedSubscription = await Subscription.findById(subscription._id)
      .populate('planId', 'name description pricing features');

    res.json({
      success: true,
      message: 'Subscription renewed successfully',
      data: renewedSubscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error renewing subscription',
      error: error.message
    });
  }
};

// @desc    Get subscription recommendations
// @route   GET /api/subscriptions/recommendations
// @access  Private (End-user)
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's current subscriptions and usage patterns
    const currentSubscriptions = await Subscription.find({
      userId,
      status: 'active'
    }).populate('planId');

    const usageData = await Usage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);

    // Get user preferences
    const user = await User.findById(userId);
    
    // Simple recommendation logic (can be enhanced with ML)
    const recommendations = [];
    
    if (usageData.length > 0) {
      const latestUsage = usageData[0];
      const avgUsage = usageData.reduce((sum, usage) => sum + usage.dataUsage.totalUsed, 0) / usageData.length;
      
      // If user consistently uses more than 80% of quota, recommend upgrade
      if (latestUsage.quotaStatus.usagePercentage > 80) {
        const higherPlans = await Plan.find({
          'features.dataQuota': { $gt: latestUsage.quotaStatus.allocated },
          'availability.isActive': true
        }).limit(3);
        
        recommendations.push(...higherPlans.map(plan => ({
          type: 'upgrade',
          plan,
          reason: 'Based on your high usage pattern, this plan offers more data',
          confidence: 85
        })));
      }
      
      // If user uses less than 30% consistently, recommend downgrade
      if (latestUsage.quotaStatus.usagePercentage < 30) {
        const lowerPlans = await Plan.find({
          'features.dataQuota': { $lt: latestUsage.quotaStatus.allocated },
          'availability.isActive': true
        }).limit(3);
        
        recommendations.push(...lowerPlans.map(plan => ({
          type: 'downgrade',
          plan,
          reason: 'You could save money with a smaller plan that matches your usage',
          confidence: 75
        })));
      }
    }

    // Get popular plans for new users
    if (currentSubscriptions.length === 0) {
      const popularPlans = await Plan.getPopularPlans(5);
      recommendations.push(...popularPlans.map(plan => ({
        type: 'popular',
        plan,
        reason: 'Popular choice among users with similar preferences',
        confidence: 60
      })));
    }

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating recommendations',
      error: error.message
    });
  }
};

// @desc    Get all subscriptions (Admin only)
// @route   GET /api/subscriptions/admin/all
// @access  Private (Admin)
const getAllSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, planId } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (planId) query.planId = planId;

    const subscriptions = await Subscription.find(query)
      .populate('userId', 'name email')
      .populate('planId', 'name type pricing')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Subscription.countDocuments(query);

    res.json({
      success: true,
      count: subscriptions.length,
      total,
      pages: Math.ceil(total / limit),
      data: subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscriptions',
      error: error.message
    });
  }
};

module.exports = {
  getUserSubscriptions,
  subscribeToPlan,
  changePlan,
  cancelSubscription,
  renewSubscription,
  getRecommendations,
  getAllSubscriptions
};
