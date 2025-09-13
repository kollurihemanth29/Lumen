const Analytics = require('../models/Analytics');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const Usage = require('../models/Usage');
const Discount = require('../models/Discount');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
const getDashboardAnalytics = async (req, res) => {
  try {
    const { period = 'monthly', startDate, endDate } = req.query;
    
    const now = new Date();
    let start, end;
    
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default periods
      switch (period) {
        case 'daily':
          start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'weekly':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'yearly':
          start = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          start = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      end = now;
    }

    // Get subscription metrics
    const subscriptionMetrics = await Subscription.aggregate([
      {
        $facet: {
          total: [
            { $match: { createdAt: { $gte: start, $lte: end } } },
            { $count: "count" }
          ],
          active: [
            { $match: { status: 'active', createdAt: { $gte: start, $lte: end } } },
            { $count: "count" }
          ],
          cancelled: [
            { $match: { status: 'cancelled', createdAt: { $gte: start, $lte: end } } },
            { $count: "count" }
          ],
          revenue: [
            { $match: { createdAt: { $gte: start, $lte: end } } },
            { $group: { _id: null, total: { $sum: '$pricing.finalPrice' } } }
          ]
        }
      }
    ]);

    // Get top performing plans
    const topPlans = await Subscription.aggregate([
      {
        $match: { createdAt: { $gte: start, $lte: end } }
      },
      {
        $group: {
          _id: '$planId',
          subscriptionCount: { $sum: 1 },
          revenue: { $sum: '$pricing.finalPrice' }
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
        $sort: { subscriptionCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Get monthly trends
    const monthlyTrends = await Subscription.aggregate([
      {
        $match: { createdAt: { $gte: start, $lte: end } }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          newSubscriptions: { $sum: 1 },
          revenue: { $sum: '$pricing.finalPrice' },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const metrics = subscriptionMetrics[0];
    const dashboard = {
      summary: {
        totalSubscriptions: metrics.total[0]?.count || 0,
        activeSubscriptions: metrics.active[0]?.count || 0,
        cancelledSubscriptions: metrics.cancelled[0]?.count || 0,
        totalRevenue: metrics.revenue[0]?.total || 0,
        churnRate: metrics.total[0]?.count ? 
          ((metrics.cancelled[0]?.count || 0) / metrics.total[0].count * 100) : 0
      },
      topPlans,
      monthlyTrends,
      period: { start, end, granularity: period }
    };

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard analytics',
      error: error.message
    });
  }
};

// @desc    Get subscription trends
// @route   GET /api/analytics/subscription-trends
// @access  Private (Admin)
const getSubscriptionTrends = async (req, res) => {
  try {
    const { startDate, endDate, granularity = 'monthly' } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const analytics = await Analytics.generateSubscriptionTrends(start, end);
    await analytics.save();

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating subscription trends',
      error: error.message
    });
  }
};

// @desc    Get plan performance analytics
// @route   GET /api/analytics/plan-performance
// @access  Private (Admin)
const getPlanPerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const analytics = await Analytics.generatePlanPerformance(start, end);
    await analytics.save();

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating plan performance analytics',
      error: error.message
    });
  }
};

// @desc    Get usage analytics
// @route   GET /api/analytics/usage-patterns
// @access  Private (Admin)
const getUsageAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const usageAnalytics = await Usage.getUsageAnalytics(start, end);

    // Calculate usage patterns
    const usagePatterns = await Usage.aggregate([
      {
        $match: {
          'period.startDate': { $gte: start },
          'period.endDate': { $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          averageUsage: { $avg: '$dataUsage.totalUsed' },
          totalUsers: { $sum: 1 },
          highUsageUsers: {
            $sum: { $cond: [{ $gt: ['$quotaStatus.usagePercentage', 80] }, 1, 0] }
          },
          lowUsageUsers: {
            $sum: { $cond: [{ $lt: ['$quotaStatus.usagePercentage', 30] }, 1, 0] }
          }
        }
      }
    ]);

    const analytics = new Analytics({
      type: 'usage_patterns',
      period: { startDate: start, endDate: end, granularity: 'monthly' },
      data: {
        usagePatterns: {
          averageMonthlyUsage: usagePatterns[0]?.averageUsage || 0,
          usageDistribution: [
            {
              range: 'Low Usage (0-30%)',
              userCount: usagePatterns[0]?.lowUsageUsers || 0,
              percentage: usagePatterns[0]?.totalUsers ? 
                (usagePatterns[0].lowUsageUsers / usagePatterns[0].totalUsers * 100) : 0
            },
            {
              range: 'High Usage (80%+)',
              userCount: usagePatterns[0]?.highUsageUsers || 0,
              percentage: usagePatterns[0]?.totalUsers ? 
                (usagePatterns[0].highUsageUsers / usagePatterns[0].totalUsers * 100) : 0
            }
          ]
        }
      },
      metadata: { generatedBy: 'system' }
    });

    await analytics.save();

    res.json({
      success: true,
      data: {
        analytics,
        planBreakdown: usageAnalytics
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating usage analytics',
      error: error.message
    });
  }
};

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private (Admin)
const getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, granularity = 'monthly' } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Revenue by period
    const revenueByPeriod = await Subscription.aggregate([
      {
        $match: { createdAt: { $gte: start, $lte: end } }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$pricing.finalPrice' },
          subscriptions: { $sum: 1 },
          discountImpact: { $sum: '$pricing.discountApplied' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Revenue by plan
    const revenueByPlan = await Subscription.aggregate([
      {
        $match: { createdAt: { $gte: start, $lte: end } }
      },
      {
        $group: {
          _id: '$planId',
          revenue: { $sum: '$pricing.finalPrice' },
          subscriptions: { $sum: 1 }
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
        $sort: { revenue: -1 }
      }
    ]);

    const totalRevenue = revenueByPeriod.reduce((sum, period) => sum + period.revenue, 0);
    const totalSubscriptions = revenueByPeriod.reduce((sum, period) => sum + period.subscriptions, 0);
    const totalDiscountImpact = revenueByPeriod.reduce((sum, period) => sum + period.discountImpact, 0);

    const analytics = new Analytics({
      type: 'revenue_analytics',
      period: { startDate: start, endDate: end, granularity },
      data: {
        revenueMetrics: {
          totalRevenue,
          recurringRevenue: totalRevenue * 0.8, // Estimate
          averageRevenuePerUser: totalSubscriptions ? totalRevenue / totalSubscriptions : 0,
          discountImpact: totalDiscountImpact
        }
      },
      metadata: { generatedBy: 'system' }
    });

    await analytics.save();

    res.json({
      success: true,
      data: {
        analytics,
        revenueByPeriod,
        revenueByPlan
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating revenue analytics',
      error: error.message
    });
  }
};

// @desc    Generate AI insights and recommendations
// @route   GET /api/analytics/insights
// @access  Private (Admin)
const generateInsights = async (req, res) => {
  try {
    const { type = 'subscription_trends' } = req.query;
    
    // Get the latest analytics of the specified type
    const latestAnalytics = await Analytics.findOne({ type })
      .sort({ createdAt: -1 });

    if (!latestAnalytics) {
      return res.status(404).json({
        success: false,
        message: 'No analytics data found. Generate analytics first.'
      });
    }

    // Generate insights and recommendations
    const insights = latestAnalytics.generateInsights();
    const recommendations = latestAnalytics.generateRecommendations();

    await latestAnalytics.save();

    res.json({
      success: true,
      data: {
        insights,
        recommendations,
        generatedAt: new Date(),
        basedOn: {
          analyticsType: type,
          period: latestAnalytics.period
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating insights',
      error: error.message
    });
  }
};

// @desc    Get historical analytics
// @route   GET /api/analytics/history
// @access  Private (Admin)
const getAnalyticsHistory = async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;
    
    const query = type ? { type } : {};
    
    const analytics = await Analytics.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select('-insights -recommendations');

    res.json({
      success: true,
      count: analytics.length,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics history',
      error: error.message
    });
  }
};

// @desc    Get discount performance analytics
// @route   GET /api/analytics/discount-performance
// @access  Private (Admin)
const getDiscountAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const discountAnalytics = await Discount.getDiscountAnalytics(start, end);

    res.json({
      success: true,
      data: discountAnalytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating discount analytics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getSubscriptionTrends,
  getPlanPerformance,
  getUsageAnalytics,
  getRevenueAnalytics,
  generateInsights,
  getAnalyticsHistory,
  getDiscountAnalytics
};
