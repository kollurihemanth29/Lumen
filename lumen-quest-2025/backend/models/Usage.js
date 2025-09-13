const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: [true, 'Subscription ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: [true, 'Plan ID is required']
  },
  period: {
    startDate: {
      type: Date,
      required: [true, 'Period start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'Period end date is required']
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      required: [true, 'Billing cycle is required']
    }
  },
  dataUsage: {
    totalUsed: {
      type: Number,
      default: 0,
      min: [0, 'Usage cannot be negative']
    }, // in GB
    dailyUsage: [{
      date: {
        type: Date,
        required: true
      },
      usage: {
        type: Number,
        required: true,
        min: [0, 'Daily usage cannot be negative']
      }, // in GB
      peakHours: [{
        hour: {
          type: Number,
          min: 0,
          max: 23
        },
        usage: Number
      }]
    }],
    peakUsage: {
      date: Date,
      amount: Number
    },
    averageDailyUsage: {
      type: Number,
      default: 0
    }
  },
  usagePatterns: {
    primaryUsageTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night', 'mixed'],
      default: 'mixed'
    },
    weekdayVsWeekend: {
      weekdayAverage: { type: Number, default: 0 },
      weekendAverage: { type: Number, default: 0 }
    },
    deviceTypes: [{
      type: {
        type: String,
        enum: ['mobile', 'laptop', 'desktop', 'tablet', 'smart_tv', 'gaming_console', 'other']
      },
      usagePercentage: Number
    }],
    contentTypes: [{
      category: {
        type: String,
        enum: ['streaming', 'gaming', 'browsing', 'work', 'downloads', 'social_media', 'other']
      },
      usagePercentage: Number
    }]
  },
  quotaStatus: {
    allocated: {
      type: Number,
      required: [true, 'Allocated quota is required']
    }, // in GB
    remaining: {
      type: Number,
      default: function() { return this.quotaStatus.allocated; }
    }, // in GB
    usagePercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    isUnlimited: {
      type: Boolean,
      default: false
    }
  },
  alerts: [{
    type: {
      type: String,
      enum: ['quota_warning', 'quota_exceeded', 'unusual_usage', 'peak_usage'],
      required: true
    },
    threshold: Number, // percentage or GB
    triggered: {
      type: Boolean,
      default: false
    },
    triggeredAt: Date,
    message: String
  }],
  recommendations: [{
    type: {
      type: String,
      enum: ['upgrade_plan', 'downgrade_plan', 'usage_optimization', 'cost_saving'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    suggestedPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan'
    },
    potentialSavings: Number,
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  metadata: {
    lastCalculated: {
      type: Date,
      default: Date.now
    },
    calculationVersion: {
      type: String,
      default: '1.0'
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
usageSchema.index({ subscriptionId: 1, 'period.startDate': -1 });
usageSchema.index({ userId: 1, 'period.startDate': -1 });
usageSchema.index({ planId: 1 });
usageSchema.index({ 'period.endDate': 1 });

// Virtual for usage efficiency
usageSchema.virtual('usageEfficiency').get(function() {
  if (this.quotaStatus.isUnlimited || this.quotaStatus.allocated === 0) return 100;
  return Math.min((this.dataUsage.totalUsed / this.quotaStatus.allocated) * 100, 100);
});

// Method to add daily usage
usageSchema.methods.addDailyUsage = async function(date, usage, hourlyBreakdown = []) {
  const existingDayIndex = this.dataUsage.dailyUsage.findIndex(
    day => day.date.toDateString() === new Date(date).toDateString()
  );

  if (existingDayIndex >= 0) {
    this.dataUsage.dailyUsage[existingDayIndex].usage += usage;
    if (hourlyBreakdown.length > 0) {
      this.dataUsage.dailyUsage[existingDayIndex].peakHours = hourlyBreakdown;
    }
  } else {
    this.dataUsage.dailyUsage.push({
      date: new Date(date),
      usage,
      peakHours: hourlyBreakdown
    });
  }

  // Update totals
  this.dataUsage.totalUsed += usage;
  this.quotaStatus.remaining = Math.max(0, this.quotaStatus.allocated - this.dataUsage.totalUsed);
  this.quotaStatus.usagePercentage = this.quotaStatus.isUnlimited ? 0 : 
    (this.dataUsage.totalUsed / this.quotaStatus.allocated) * 100;

  // Update peak usage if this is higher
  if (!this.dataUsage.peakUsage.amount || usage > this.dataUsage.peakUsage.amount) {
    this.dataUsage.peakUsage = { date: new Date(date), amount: usage };
  }

  // Calculate average daily usage
  if (this.dataUsage.dailyUsage.length > 0) {
    this.dataUsage.averageDailyUsage = this.dataUsage.totalUsed / this.dataUsage.dailyUsage.length;
  }

  await this.checkAndTriggerAlerts();
  return await this.save();
};

// Method to check and trigger usage alerts
usageSchema.methods.checkAndTriggerAlerts = async function() {
  const now = new Date();
  
  for (let alert of this.alerts) {
    if (alert.triggered) continue;
    
    let shouldTrigger = false;
    
    switch (alert.type) {
      case 'quota_warning':
        shouldTrigger = this.quotaStatus.usagePercentage >= alert.threshold;
        break;
      case 'quota_exceeded':
        shouldTrigger = this.quotaStatus.usagePercentage >= 100;
        break;
      case 'unusual_usage':
        const todayUsage = this.dataUsage.dailyUsage
          .find(day => day.date.toDateString() === now.toDateString())?.usage || 0;
        shouldTrigger = todayUsage > (this.dataUsage.averageDailyUsage * 2);
        break;
    }
    
    if (shouldTrigger) {
      alert.triggered = true;
      alert.triggeredAt = now;
    }
  }
};

// Method to generate usage recommendations
usageSchema.methods.generateRecommendations = async function() {
  const recommendations = [];
  
  // Clear existing recommendations
  this.recommendations = this.recommendations.filter(rec => !rec.isActive);
  
  // Recommendation 1: Plan upgrade if consistently exceeding quota
  if (this.quotaStatus.usagePercentage > 90 && !this.quotaStatus.isUnlimited) {
    recommendations.push({
      type: 'upgrade_plan',
      message: 'Consider upgrading your plan to avoid overage charges and get better value.',
      confidence: 85
    });
  }
  
  // Recommendation 2: Plan downgrade if using much less than allocated
  if (this.quotaStatus.usagePercentage < 30 && this.dataUsage.dailyUsage.length >= 15) {
    recommendations.push({
      type: 'downgrade_plan',
      message: 'You could save money by switching to a lower-tier plan that better matches your usage.',
      confidence: 75
    });
  }
  
  // Recommendation 3: Usage optimization
  if (this.usagePatterns.primaryUsageTime === 'mixed') {
    recommendations.push({
      type: 'usage_optimization',
      message: 'Consider scheduling heavy downloads during off-peak hours for better performance.',
      confidence: 60
    });
  }
  
  this.recommendations.push(...recommendations);
  return recommendations;
};

// Static method to get usage analytics for admin
usageSchema.statics.getUsageAnalytics = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        'period.startDate': { $gte: startDate },
        'period.endDate': { $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$planId',
        totalUsers: { $sum: 1 },
        averageUsage: { $avg: '$dataUsage.totalUsed' },
        totalUsage: { $sum: '$dataUsage.totalUsed' },
        peakUsage: { $max: '$dataUsage.totalUsed' }
      }
    },
    {
      $lookup: {
        from: 'plans',
        localField: '_id',
        foreignField: '_id',
        as: 'planDetails'
      }
    }
  ]);
};

module.exports = mongoose.model('Usage', usageSchema);
