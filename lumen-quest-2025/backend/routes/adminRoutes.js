const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Admin routes - require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Plan management
router.get('/plans', adminController.getAllPlans);
router.post('/plans', adminController.createPlan);
router.put('/plans/:planId', adminController.updatePlan);
router.delete('/plans/:planId', adminController.deletePlan);
router.get('/plans/:planId', adminController.getPlanById);

// Subscription management
router.get('/subscriptions', adminController.getAllSubscriptions);
router.get('/subscriptions/:subscriptionId', adminController.getSubscriptionById);
router.put('/subscriptions/:subscriptionId/status', adminController.updateSubscriptionStatus);
router.delete('/subscriptions/:subscriptionId', adminController.cancelSubscription);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserById);
router.get('/users/:userId/subscriptions', adminController.getUserSubscriptions);
router.put('/users/:userId/subscription', adminController.updateUserSubscription);

// Billing management
router.get('/billing', adminController.getAllBilling);
router.get('/billing/:billingId', adminController.getBillingById);
router.put('/billing/:billingId/status', adminController.updateBillingStatus);
router.post('/billing/:billingId/refund', adminController.processRefund);

// Dashboard analytics
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/revenue', adminController.getRevenueStats);
router.get('/dashboard/subscriptions/stats', adminController.getSubscriptionStats);
router.get('/dashboard/users/stats', adminController.getUserStats);

// Reports
router.get('/reports/revenue', adminController.getRevenueReport);
router.get('/reports/subscriptions', adminController.getSubscriptionReport);
router.get('/reports/churn', adminController.getChurnReport);

module.exports = router;
