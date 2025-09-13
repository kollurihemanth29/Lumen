const express = require('express');
const router = express.Router();
const {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  deactivatePlan,
  addPlanReview,
  getPopularPlans,
  getPlanAnalytics
} = require('../controllers/planController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.route('/')
  .get(getAllPlans);

router.route('/popular')
  .get(getPopularPlans);

router.route('/:id')
  .get(getPlanById);

// Protected routes
router.use(protect);

// End-user routes
router.route('/:id/reviews')
  .post(addPlanReview);

// Admin routes
router.route('/')
  .post(authorize('admin'), createPlan);

router.route('/:id')
  .put(authorize('admin'), updatePlan)
  .delete(authorize('admin'), deletePlan);

router.route('/:id/deactivate')
  .put(authorize('admin'), deactivatePlan);

router.route('/:id/analytics')
  .get(authorize('admin'), getPlanAnalytics);

module.exports = router;
