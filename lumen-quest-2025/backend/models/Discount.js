const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Discount name is required'],
    trim: true,
    maxlength: [100, 'Discount name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Discount description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  code: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'Discount code cannot exceed 20 characters']
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed_amount', 'free_months'],
    required: [true, 'Discount type is required']
  },
  value: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  conditions: {
    minimumPlanPrice: {
      type: Number,
      default: 0
    },
    applicablePlans: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan'
    }],
    planTypes: [{
      type: String,
      enum: ['fibernet', 'broadband-copper']
    }],
    newCustomersOnly: {
      type: Boolean,
      default: false
    },
    maxUsagePerUser: {
      type: Number,
      default: 1
    },
    requiresReferral: {
      type: Boolean,
      default: false
    }
  },
  validity: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  usage: {
    totalUsageCount: {
      type: Number,
      default: 0
    },
    maxUsageLimit: {
      type: Number,
      default: null // null means unlimited
    },
    usedBy: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
      },
      usedAt: {
        type: Date,
        default: Date.now
      },
      discountAmount: Number
    }]
  },
  targeting: {
    userSegments: [{
      type: String,
      enum: ['new_users', 'existing_users', 'high_usage', 'low_usage', 'premium_users', 'all']
    }],
    regions: [String],
    ageGroups: [{
      type: String,
      enum: ['18-25', '26-35', '36-45', '46-55', '55+']
    }]
  },
  performance: {
    conversionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
discountSchema.index({ code: 1 });
discountSchema.index({ 'validity.startDate': 1, 'validity.endDate': 1 });
discountSchema.index({ 'validity.isActive': 1 });
discountSchema.index({ type: 1 });

// Virtual for discount status
discountSchema.virtual('status').get(function() {
  const now = new Date();
  if (!this.validity.isActive) return 'inactive';
  if (now < this.validity.startDate) return 'scheduled';
  if (now > this.validity.endDate) return 'expired';
  if (this.usage.maxUsageLimit && this.usage.totalUsageCount >= this.usage.maxUsageLimit) return 'exhausted';
  return 'active';
});

// Method to check if discount is currently valid
discountSchema.methods.isCurrentlyValid = function() {
  const now = new Date();
  return this.validity.isActive && 
         this.validity.startDate <= now && 
         this.validity.endDate >= now &&
         (!this.usage.maxUsageLimit || this.usage.totalUsageCount < this.usage.maxUsageLimit);
};

// Method to check if user can use this discount
discountSchema.methods.canUserUse = function(userId, planId) {
  if (!this.isCurrentlyValid()) return { canUse: false, reason: 'Discount is not valid' };
  
  // Check if user has already used this discount the maximum number of times
  const userUsageCount = this.usage.usedBy.filter(usage => 
    usage.userId.toString() === userId.toString()
  ).length;
  
  if (userUsageCount >= this.conditions.maxUsagePerUser) {
    return { canUse: false, reason: 'Maximum usage limit reached for this user' };
  }
  
  // Check if plan is applicable
  if (this.conditions.applicablePlans.length > 0) {
    const isApplicable = this.conditions.applicablePlans.some(
      applicablePlan => applicablePlan.toString() === planId.toString()
    );
    if (!isApplicable) {
      return { canUse: false, reason: 'Discount not applicable to this plan' };
    }
  }
  
  return { canUse: true };
};

// Method to calculate discount amount
discountSchema.methods.calculateDiscountAmount = function(planPrice) {
  switch (this.type) {
    case 'percentage':
      return (planPrice * this.value) / 100;
    case 'fixed_amount':
      return Math.min(this.value, planPrice); // Don't exceed plan price
    case 'free_months':
      return planPrice * this.value; // Value represents number of free months
    default:
      return 0;
  }
};

// Method to apply discount to a user
discountSchema.methods.applyToUser = async function(userId, subscriptionId, planPrice) {
  const canUseResult = this.canUserUse(userId, subscriptionId);
  if (!canUseResult.canUse) {
    throw new Error(canUseResult.reason);
  }
  
  const discountAmount = this.calculateDiscountAmount(planPrice);
  
  // Record usage
  this.usage.usedBy.push({
    userId,
    subscriptionId,
    usedAt: new Date(),
    discountAmount
  });
  
  this.usage.totalUsageCount += 1;
  this.performance.totalRevenue += (planPrice - discountAmount);
  
  await this.save();
  return discountAmount;
};

// Static method to get active discounts for a plan
discountSchema.statics.getActiveDiscountsForPlan = function(planId, planType) {
  const now = new Date();
  return this.find({
    'validity.isActive': true,
    'validity.startDate': { $lte: now },
    'validity.endDate': { $gte: now },
    $or: [
      { 'conditions.applicablePlans': planId },
      { 'conditions.planTypes': planType },
      { 'conditions.applicablePlans': { $size: 0 }, 'conditions.planTypes': { $size: 0 } }
    ]
  });
};

// Static method to get discount analytics
discountSchema.statics.getDiscountAnalytics = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        'usage.usedBy.usedAt': {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $unwind: '$usage.usedBy'
    },
    {
      $match: {
        'usage.usedBy.usedAt': {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        discountName: { $first: '$name' },
        totalUsage: { $sum: 1 },
        totalDiscountAmount: { $sum: '$usage.usedBy.discountAmount' },
        averageDiscountAmount: { $avg: '$usage.usedBy.discountAmount' }
      }
    },
    {
      $sort: { totalUsage: -1 }
    }
  ]);
};

module.exports = mongoose.model('Discount', discountSchema);
