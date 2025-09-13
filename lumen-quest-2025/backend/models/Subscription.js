const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subscriptionId: {
    type: String,
    required: [true, 'Subscription ID is required'],
    unique: true,
    trim: true
  },
  subscriptionType: {
    type: String,
    required: [true, 'Subscription type is required'],
    trim: true
  },
  productId: {
    type: String,
    required: [true, 'Product ID is required'],
    trim: true
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'cancelled', 'expired', 'terminated', 'ACTIVE', 'SUSPENDED', 'CANCELLED', 'EXPIRED', 'TERMINATED', 'PAUSED', 'paused'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now
  },
  lastBilledDate: {
    type: Date
  },
  lastRenewedDate: {
    type: Date
  },
  terminatedDate: {
    type: Date
  },
  graceTime: {
    type: Number, // in days
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subscription duration
subscriptionSchema.virtual('duration').get(function() {
  const endDate = this.terminatedDate || Date.now();
  return Math.ceil((endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Virtual for grace period remaining
subscriptionSchema.virtual('gracePeriodRemaining').get(function() {
  if (this.graceTime && this.lastBilledDate) {
    const graceEndDate = new Date(this.lastBilledDate);
    graceEndDate.setDate(graceEndDate.getDate() + this.graceTime);
    const remaining = Math.ceil((graceEndDate - Date.now()) / (1000 * 60 * 60 * 24));
    return remaining > 0 ? remaining : 0;
  }
  return 0;
});

// Virtual for subscription status
subscriptionSchema.virtual('isActive').get(function() {
  return this.status === 'active' && (!this.terminatedDate || this.terminatedDate > Date.now());
});

// Pre-save middleware to update timestamps
subscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find active subscriptions
subscriptionSchema.statics.findActive = function() {
  return this.find({
    status: 'active',
    $or: [
      { terminatedDate: { $exists: false } },
      { terminatedDate: { $gt: new Date() } }
    ]
  });
};

// Static method to find subscriptions by user
subscriptionSchema.statics.findByUser = function(userId) {
  return this.find({ userId });
};

// Static method to find subscriptions by product
subscriptionSchema.statics.findByProduct = function(productId) {
  return this.find({ productId });
};

// Indexes for performance
subscriptionSchema.index({ subscriptionId: 1 });
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ productId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ startDate: -1 });
subscriptionSchema.index({ lastBilledDate: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
