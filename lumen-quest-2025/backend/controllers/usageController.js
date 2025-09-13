const Usage = require('../models/Usage');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');

// @desc    Get user's usage data
// @route   GET /api/usage
// @access  Private (End-user)
const getUserUsage = async (req, res) => {
  try {
    const { subscriptionId, period = 'current' } = req.query;
    
    let query = { userId: req.user.id };
    
    if (subscriptionId) {
      query.subscriptionId = subscriptionId;
    }
    
    if (period === 'current') {
      const now = new Date();
      query['period.startDate'] = { $lte: now };
      query['period.endDate'] = { $gte: now };
    }

    const usage = await Usage.find(query)
      .populate('subscriptionId', 'status billing')
      .populate('planId', 'name features')
      .sort({ 'period.startDate': -1 });

    res.json({
      success: true,
      count: usage.length,
      data: usage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching usage data',
      error: error.message
    });
  }
};

// @desc    Add usage data
// @route   POST /api/usage/add
// @access  Private (System/Admin)
const addUsageData = async (req, res) => {
  try {
    const { subscriptionId, date, usage: usageAmount, hourlyBreakdown } = req.body;

    const subscription = await Subscription.findById(subscriptionId)
      .populate('planId');

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    // Find current usage record
    let usageRecord = await Usage.findOne({
      subscriptionId,
      'period.startDate': { $lte: new Date(date) },
      'period.endDate': { $gte: new Date(date) }
    });

    if (!usageRecord) {
      return res.status(404).json({
        success: false,
        message: 'No usage record found for this period'
      });
    }

    await usageRecord.addDailyUsage(date, usageAmount, hourlyBreakdown);

    // Generate recommendations if needed
    await usageRecord.generateRecommendations();

    res.json({
      success: true,
      message: 'Usage data added successfully',
      data: usageRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding usage data',
      error: error.message
    });
  }
};

// @desc    Get usage recommendations
// @route   GET /api/usage/recommendations
// @access  Private (End-user)
const getUsageRecommendations = async (req, res) => {
  try {
    const { subscriptionId } = req.query;
    
    let query = { userId: req.user.id };
    if (subscriptionId) {
      query.subscriptionId = subscriptionId;
    }

    const usageRecords = await Usage.find(query)
      .populate('recommendations.suggestedPlanId', 'name pricing features')
      .sort({ createdAt: -1 })
      .limit(5);

    const allRecommendations = [];
    
    for (const record of usageRecords) {
      const activeRecommendations = record.recommendations.filter(rec => rec.isActive);
      allRecommendations.push(...activeRecommendations);
    }

    res.json({
      success: true,
      count: allRecommendations.length,
      data: allRecommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching usage recommendations',
      error: error.message
    });
  }
};

// @desc    Get usage alerts
// @route   GET /api/usage/alerts
// @access  Private (End-user)
const getUsageAlerts = async (req, res) => {
  try {
    const usageRecords = await Usage.find({ 
      userId: req.user.id,
      'alerts.triggered': true
    })
    .populate('subscriptionId', 'status')
    .populate('planId', 'name')
    .sort({ 'alerts.triggeredAt': -1 });

    const alerts = [];
    
    usageRecords.forEach(record => {
      const triggeredAlerts = record.alerts.filter(alert => alert.triggered);
      triggeredAlerts.forEach(alert => {
        alerts.push({
          ...alert.toObject(),
          subscription: record.subscriptionId,
          plan: record.planId,
          currentUsage: record.dataUsage.totalUsed,
          quotaStatus: record.quotaStatus
        });
      });
    });

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching usage alerts',
      error: error.message
    });
  }
};

// @desc    Get usage analytics for admin
// @route   GET /api/usage/analytics
// @access  Private (Admin)
const getUsageAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, planId } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    let matchQuery = {
      'period.startDate': { $gte: start },
      'period.endDate': { $lte: end }
    };

    if (planId) {
      matchQuery.planId = require('mongoose').Types.ObjectId(planId);
    }

    const analytics = await Usage.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$planId',
          totalUsers: { $sum: 1 },
          averageUsage: { $avg: '$dataUsage.totalUsed' },
          totalUsage: { $sum: '$dataUsage.totalUsage' },
          highUsageUsers: {
            $sum: { $cond: [{ $gt: ['$quotaStatus.usagePercentage', 80] }, 1, 0] }
          },
          lowUsageUsers: {
            $sum: { $cond: [{ $lt: ['$quotaStatus.usagePercentage', 30] }, 1, 0] }
          },
          averageEfficiency: { $avg: '$quotaStatus.usagePercentage' }
        }
      },
      {
        $lookup: {
          from: 'plans',
          localField: '_id',
          foreignField: '_id',
          as: 'planDetails'
        }
      },
      {
        $unwind: '$planDetails'
      },
      {
        $sort: { totalUsers: -1 }
      }
    ]);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching usage analytics',
      error: error.message
    });
  }
};

// @desc    Update usage patterns
// @route   PUT /api/usage/:id/patterns
// @access  Private (System/Admin)
const updateUsagePatterns = async (req, res) => {
  try {
    const { id } = req.params;
    const { usagePatterns } = req.body;

    const usage = await Usage.findByIdAndUpdate(
      id,
      { 
        usagePatterns,
        'metadata.lastCalculated': new Date()
      },
      { new: true }
    );

    if (!usage) {
      return res.status(404).json({
        success: false,
        message: 'Usage record not found'
      });
    }

    res.json({
      success: true,
      message: 'Usage patterns updated successfully',
      data: usage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating usage patterns',
      error: error.message
    });
  }
};

module.exports = {
  getUserUsage,
  addUsageData,
  getUsageRecommendations,
  getUsageAlerts,
  getUsageAnalytics,
  updateUsagePatterns
};
