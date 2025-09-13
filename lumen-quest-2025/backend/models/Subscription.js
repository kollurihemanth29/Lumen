const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
<<<<<<< HEAD
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
=======
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'expired', 'trial', 'suspended'],
    default: 'trial'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  trialEndDate: {
    type: Date
  },
  nextBillingDate: {
    type: Date
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer', 'stripe', 'razorpay'],
    required: true
  },
  paymentDetails: {
    paymentMethodId: String,
    customerId: String,
    subscriptionId: String // External payment provider subscription ID
  },
  usage: {
    apiCalls: {
      type: Number,
      default: 0
    },
    storageUsed: {
      type: Number,
      default: 0
    },
    usersCount: {
      type: Number,
      default: 1
    }
  },
  discounts: [{
    code: String,
    percentage: Number,
    amount: Number,
    validUntil: Date
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59

module.exports = mongoose.model('Subscription', subscriptionSchema);
