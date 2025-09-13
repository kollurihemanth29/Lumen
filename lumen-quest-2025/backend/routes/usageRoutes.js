const express = require('express');
const router = express.Router();
const {
  getUserUsage,
  addUsageData,
  getUsageRecommendations,
  getUsageAlerts,
  getUsageAnalytics,
  updateUsagePatterns
} = require('../controllers/usageController');

const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// End-user routes
router.route('/')
  .get(getUserUsage);

router.route('/recommendations')
  .get(getUsageRecommendations);

router.route('/alerts')
  .get(getUsageAlerts);

// System/Admin routes
router.route('/add')
  .post(authorize('admin'), addUsageData);

router.route('/analytics')
  .get(authorize('admin'), getUsageAnalytics);

router.route('/:id/patterns')
  .put(authorize('admin'), updateUsagePatterns);

module.exports = router;
