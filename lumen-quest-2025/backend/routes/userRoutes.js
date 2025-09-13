const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// User subscription management routes
router.use(protect); // All routes require authentication

// Get user's current subscription
router.get('/subscription', userController.getCurrentSubscription);

// Get available plans
router.get('/plans', userController.getAvailablePlans);

// Subscribe to a plan
router.post('/subscribe', userController.subscribeToPlan);

// Update subscription (upgrade/downgrade)
router.put('/subscription', userController.updateSubscription);

// Cancel subscription
router.delete('/subscription', userController.cancelSubscription);

// Get subscription history
router.get('/subscription/history', userController.getSubscriptionHistory);

// Get billing history
router.get('/billing/history', userController.getBillingHistory);

// Get specific invoice
router.get('/billing/invoice/:invoiceId', userController.getInvoice);

// Download invoice
router.get('/billing/invoice/:invoiceId/download', userController.downloadInvoice);

// Update payment method
router.put('/payment-method', userController.updatePaymentMethod);

// Get usage statistics
router.get('/usage', userController.getUsageStats);

module.exports = router;
