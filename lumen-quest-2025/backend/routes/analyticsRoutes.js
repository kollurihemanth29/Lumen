const express = require('express');
const router = express.Router();
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

module.exports = router;
