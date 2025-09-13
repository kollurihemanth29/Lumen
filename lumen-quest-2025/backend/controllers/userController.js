const User = require('../models/User');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const Billing = require('../models/Billing');
const SubscriptionLog = require('../models/SubscriptionLog');

// Get user's current subscription
const getCurrentSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ 
      user: req.user._id, 
      status: { $in: ['active', 'trial'] } 
    }).populate('plan');
    
    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription',
      error: error.message
    });
  }
};

// Get available plans
const getAvailablePlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    
    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching plans',
      error: error.message
    });
  }
};

// Subscribe to a plan
const subscribeToPlan = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Subscribe to plan endpoint - implementation needed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error subscribing to plan',
      error: error.message
    });
  }
};

// Update subscription
const updateSubscription = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Update subscription endpoint - implementation needed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating subscription',
      error: error.message
    });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Cancel subscription endpoint - implementation needed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription',
      error: error.message
    });
  }
};

// Get subscription history
const getSubscriptionHistory = async (req, res) => {
  try {
    const history = await SubscriptionLog.find({ user: req.user._id })
      .populate('subscription')
      .populate('previousPlan')
      .populate('newPlan')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription history',
      error: error.message
    });
  }
};

// Get billing history
const getBillingHistory = async (req, res) => {
  try {
    const billingHistory = await Billing.find({ user: req.user._id })
      .populate('subscription')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: billingHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching billing history',
      error: error.message
    });
  }
};

// Get specific invoice
const getInvoice = async (req, res) => {
  try {
    const invoice = await Billing.findOne({
      _id: req.params.invoiceId,
      user: req.user._id
    }).populate('subscription');
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    
    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching invoice',
      error: error.message
    });
  }
};

// Download invoice
const downloadInvoice = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Download invoice endpoint - implementation needed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downloading invoice',
      error: error.message
    });
  }
};

// Update payment method
const updatePaymentMethod = async (req, res) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Update payment method endpoint - implementation needed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment method',
      error: error.message
    });
  }
};

// Get usage statistics
const getUsageStats = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'trial'] }
    }).populate('plan');
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }
    
    res.json({
      success: true,
      data: {
        usage: subscription.usage,
        limits: subscription.plan.limits,
        utilizationPercentage: {
          apiCalls: subscription.plan.limits.apiCalls ? 
            (subscription.usage.apiCalls / subscription.plan.limits.apiCalls) * 100 : 0,
          storage: subscription.plan.limits.storage ? 
            (subscription.usage.storageUsed / subscription.plan.limits.storage) * 100 : 0,
          users: subscription.plan.limits.users ? 
            (subscription.usage.usersCount / subscription.plan.limits.users) * 100 : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching usage stats',
      error: error.message
    });
  }
};

module.exports = {
  getCurrentSubscription,
  getAvailablePlans,
  subscribeToPlan,
  updateSubscription,
  cancelSubscription,
  getSubscriptionHistory,
  getBillingHistory,
  getInvoice,
  downloadInvoice,
  updatePaymentMethod,
  getUsageStats
};
