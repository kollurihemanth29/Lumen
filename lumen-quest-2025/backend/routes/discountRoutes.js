const express = require('express');
const router = express.Router();
const {
  getActiveDiscounts,
  getDiscountByCode,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  deactivateDiscount,
  validateDiscount,
  getDiscountAnalytics,
  getAllDiscountsAdmin
} = require('../controllers/discountController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.route('/')
  .get(getActiveDiscounts);

router.route('/code/:code')
  .get(getDiscountByCode);

// Protected routes
router.use(protect);

// End-user routes
router.route('/validate')
  .post(validateDiscount);

// Admin routes
router.route('/')
  .post(authorize('admin'), createDiscount);

router.route('/admin/all')
  .get(authorize('admin'), getAllDiscountsAdmin);

router.route('/:id')
  .put(authorize('admin'), updateDiscount)
  .delete(authorize('admin'), deleteDiscount);

router.route('/:id/deactivate')
  .put(authorize('admin'), deactivateDiscount);

router.route('/:id/analytics')
  .get(authorize('admin'), getDiscountAnalytics);

module.exports = router;
