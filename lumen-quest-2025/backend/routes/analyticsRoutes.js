const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const {
  getDashboardAnalytics,
  getSubscriptionTrends,
  getPlanPerformance,
  getUsageAnalytics,
  getRevenueAnalytics,
  generateInsights,
  getAnalyticsHistory,
  getDiscountAnalytics
} = require('../controllers/analyticsController');

const { protect, authorize } = require('../middleware/authMiddleware');

// All analytics routes require admin access
router.use(protect);
router.use(authorize('admin'));

router.route('/dashboard')
  .get(getDashboardAnalytics);

router.route('/subscription-trends')
  .get(getSubscriptionTrends);

router.route('/plan-performance')
  .get(getPlanPerformance);

router.route('/usage-patterns')
  .get(getUsageAnalytics);

router.route('/revenue')
  .get(getRevenueAnalytics);

router.route('/insights')
  .get(generateInsights);

router.route('/history')
  .get(getAnalyticsHistory);

router.route('/discount-performance')
  .get(getDiscountAnalytics);
=======
const { protect, adminOnly } = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

// Analytics routes - require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Revenue analytics
router.get('/revenue/monthly', analyticsController.getMonthlyRevenue);
router.get('/revenue/yearly', analyticsController.getYearlyRevenue);
router.get('/revenue/trends', analyticsController.getRevenueTrends);

// Subscription analytics
router.get('/subscriptions/growth', analyticsController.getSubscriptionGrowth);
router.get('/subscriptions/churn', analyticsController.getChurnRate);
router.get('/subscriptions/retention', analyticsController.getRetentionRate);
router.get('/subscriptions/conversion', analyticsController.getConversionRate);

// Plan analytics
router.get('/plans/popularity', analyticsController.getPlanPopularity);
router.get('/plans/performance', analyticsController.getPlanPerformance);

// User analytics
router.get('/users/acquisition', analyticsController.getUserAcquisition);
router.get('/users/lifetime-value', analyticsController.getLifetimeValue);
router.get('/users/engagement', analyticsController.getUserEngagement);

// Payment analytics
router.get('/payments/success-rate', analyticsController.getPaymentSuccessRate);
router.get('/payments/failed', analyticsController.getFailedPayments);
router.get('/payments/methods', analyticsController.getPaymentMethodStats);

// Custom reports
router.post('/reports/custom', analyticsController.generateCustomReport);
router.get('/reports/export/:reportId', analyticsController.exportReport);
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59

module.exports = router;
