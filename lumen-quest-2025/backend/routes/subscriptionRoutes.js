const express = require('express');
const router = express.Router();
const {
  getUserSubscriptions,
  subscribeToPlan,
  changePlan,
  cancelSubscription,
  renewSubscription,
  getRecommendations,
  getAllSubscriptions
} = require('../controllers/subscriptionController');

const { protect, authorize } = require('../middleware/authMiddleware');

// End-user routes
router.use(protect); // All routes require authentication

router.route('/')
  .get(getUserSubscriptions);

router.route('/subscribe')
  .post(subscribeToPlan);

router.route('/recommendations')
  .get(getRecommendations);

router.route('/:id/change-plan')
  .put(changePlan);

router.route('/:id/cancel')
  .put(cancelSubscription);

router.route('/:id/renew')
  .put(renewSubscription);

// Admin routes
router.route('/admin/all')
  .get(authorize('admin'), getAllSubscriptions);

module.exports = router;
