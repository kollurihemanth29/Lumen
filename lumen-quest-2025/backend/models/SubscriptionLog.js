const mongoose = require('mongoose');

const subscriptionLogSchema = new mongoose.Schema({
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: [
      'created',
      'activated',
      'deactivated',
      'cancelled',
      'renewed',
      'upgraded',
      'downgraded',
      'suspended',
      'expired',
      'payment_failed',
      'payment_success',
      'trial_started',
      'trial_ended'
    ],
    required: true
  },
  previousStatus: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'expired', 'trial', 'suspended']
  },
  newStatus: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'expired', 'trial', 'suspended']
  },
  previousPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  newPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  amount: {
    type: Number
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentId: {
    type: String
  },
  reason: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
subscriptionLogSchema.index({ subscription: 1, createdAt: -1 });
subscriptionLogSchema.index({ user: 1, action: 1 });
subscriptionLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SubscriptionLog', subscriptionLogSchema);
