<<<<<<< HEAD
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
=======
const User = require('../models/User');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const Billing = require('../models/Billing');
const SubscriptionLog = require('../models/SubscriptionLog');

// Revenue analytics
const getMonthlyRevenue = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Monthly revenue endpoint - implementation needed'
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
    });
  } catch (error) {
    res.status(500).json({
      success: false,
<<<<<<< HEAD
      message: 'Error fetching dashboard analytics',
=======
      message: 'Error fetching monthly revenue',
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
      error: error.message
    });
  }
};

<<<<<<< HEAD
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
=======
const getYearlyRevenue = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Yearly revenue endpoint - implementation needed'
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
    });
  } catch (error) {
    res.status(500).json({
      success: false,
<<<<<<< HEAD
      message: 'Error generating subscription trends',
=======
      message: 'Error fetching yearly revenue',
      error: error.message
    });
  }
};

const getRevenueTrends = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Revenue trends endpoint - implementation needed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue trends',
      error: error.message
    });
  }
};

// Subscription analytics
const getSubscriptionGrowth = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Subscription growth endpoint - implementation needed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription growth',
      error: error.message
    });
  }
};

const getChurnRate = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Churn rate endpoint - implementation needed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching churn rate',
      error: error.message
    });
  }
};

const getRetentionRate = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Retention rate endpoint - implementation needed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching retention rate',
      error: error.message
    });
  }
};

const getConversionRate = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Conversion rate endpoint - implementation needed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversion rate',
      error: error.message
    });
  }
};

// Plan analytics
const getPlanPopularity = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Plan popularity endpoint - implementation needed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching plan popularity',
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
      error: error.message
    });
  }
};

<<<<<<< HEAD
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
=======
const getPlanPerformance = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Plan performance endpoint - implementation needed'
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
    });
  } catch (error) {
    res.status(500).json({
      success: false,
<<<<<<< HEAD
      message: 'Error generating plan performance analytics',
=======
      message: 'Error fetching plan performance',
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
      error: error.message
    });
  }
};

<<<<<<< HEAD
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
=======
// User analytics
const getUserAcquisition = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'User acquisition endpoint - implementation needed'
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
    });
  } catch (error) {
    res.status(500).json({
      success: false,
<<<<<<< HEAD
      message: 'Error generating usage analytics',
=======
      message: 'Error fetching user acquisition',
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
      error: error.message
    });
  }
};

<<<<<<< HEAD
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
=======
const getLifetimeValue = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Lifetime value endpoint - implementation needed'
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
    });
  } catch (error) {
    res.status(500).json({
      success: false,
<<<<<<< HEAD
      message: 'Error generating revenue analytics',
=======
      message: 'Error fetching lifetime value',
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
      error: error.message
    });
  }
};

<<<<<<< HEAD
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
=======
const getUserEngagement = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'User engagement endpoint - implementation needed'
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
    });
  } catch (error) {
    res.status(500).json({
      success: false,
<<<<<<< HEAD
      message: 'Error generating insights',
=======
      message: 'Error fetching user engagement',
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
      error: error.message
    });
  }
};

<<<<<<< HEAD
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
=======
// Payment analytics
const getPaymentSuccessRate = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Payment success rate endpoint - implementation needed'
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
    });
  } catch (error) {
    res.status(500).json({
      success: false,
<<<<<<< HEAD
      message: 'Error fetching analytics history',
=======
      message: 'Error fetching payment success rate',
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
      error: error.message
    });
  }
};

<<<<<<< HEAD
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
=======
const getFailedPayments = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Failed payments endpoint - implementation needed'
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
    });
  } catch (error) {
    res.status(500).json({
      success: false,
<<<<<<< HEAD
      message: 'Error generating discount analytics',
=======
      message: 'Error fetching failed payments',
      error: error.message
    });
  }
};

const getPaymentMethodStats = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Payment method stats endpoint - implementation needed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment method stats',
      error: error.message
    });
  }
};

// Custom reports
const generateCustomReport = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Generate custom report endpoint - implementation needed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating custom report',
      error: error.message
    });
  }
};

const exportReport = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Export report endpoint - implementation needed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting report',
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
      error: error.message
    });
  }
};

module.exports = {
<<<<<<< HEAD
  getDashboardAnalytics,
  getSubscriptionTrends,
  getPlanPerformance,
  getUsageAnalytics,
  getRevenueAnalytics,
  generateInsights,
  getAnalyticsHistory,
  getDiscountAnalytics
=======
  getMonthlyRevenue,
  getYearlyRevenue,
  getRevenueTrends,
  getSubscriptionGrowth,
  getChurnRate,
  getRetentionRate,
  getConversionRate,
  getPlanPopularity,
  getPlanPerformance,
  getUserAcquisition,
  getLifetimeValue,
  getUserEngagement,
  getPaymentSuccessRate,
  getFailedPayments,
  getPaymentMethodStats,
  generateCustomReport,
  exportReport
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
};
