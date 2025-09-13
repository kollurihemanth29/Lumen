const mongoose = require('mongoose');

const subscriptionLogsSchema = new mongoose.Schema({
  subscriptionId: {
    type: String,
    required: [true, 'Subscription ID is required'],
    trim: true
  },
  currentStatus: {
    type: String,
    required: [true, 'Current status is required'],
    enum: ['active', 'suspended', 'cancelled', 'expired', 'terminated', 'ACTIVE', 'SUSPENDED', 'CANCELLED', 'EXPIRED', 'TERMINATED', 'PAUSED', 'paused', 'initialized', 'INITIALIZED'],
    trim: true
  },
  nextStatus: {
    type: String,
    required: [true, 'Next status is required'],
    enum: ['active', 'suspended', 'cancelled', 'expired', 'terminated', 'ACTIVE', 'SUSPENDED', 'CANCELLED', 'EXPIRED', 'TERMINATED', 'PAUSED', 'paused', 'initialized', 'INITIALIZED'],
    trim: true
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: ['created', 'activated', 'suspended', 'cancelled', 'renewed', 'upgraded', 'downgraded', 'terminated', 'reactivated', 'renew', 'RENEW', 'CREATE', 'ACTIVATE', 'SUSPEND', 'CANCEL'],
    trim: true
  },
  actionDate: {
    type: Date,
    required: [true, 'Action date is required'],
    default: Date.now
  },
  // Additional fields for better tracking
  performedBy: {
    type: String,
    trim: true
  },
  reason: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for log display
subscriptionLogsSchema.virtual('logDisplay').get(function() {
  return `${this.subscriptionId}: ${this.currentStatus} → ${this.nextStatus} (${this.action})`;
});

// Static method to find logs by subscription
subscriptionLogsSchema.statics.findBySubscription = function(subscriptionId) {
  return this.find({ subscriptionId }).sort({ actionDate: -1 });
};

// Static method to find logs by action
subscriptionLogsSchema.statics.findByAction = function(action) {
  return this.find({ action }).sort({ actionDate: -1 });
};

// Static method to find logs by date range
subscriptionLogsSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    actionDate: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ actionDate: -1 });
};

// Static method to get subscription history
subscriptionLogsSchema.statics.getSubscriptionHistory = function(subscriptionId, limit = 50) {
  return this.find({ subscriptionId })
    .sort({ actionDate: -1 })
    .limit(limit);
};

// Indexes for performance
subscriptionLogsSchema.index({ subscriptionId: 1 });
subscriptionLogsSchema.index({ actionDate: -1 });
subscriptionLogsSchema.index({ action: 1 });
subscriptionLogsSchema.index({ currentStatus: 1 });
subscriptionLogsSchema.index({ nextStatus: 1 });
subscriptionLogsSchema.index({ performedBy: 1 });

module.exports = mongoose.model('SubscriptionLogs', subscriptionLogsSchema);
