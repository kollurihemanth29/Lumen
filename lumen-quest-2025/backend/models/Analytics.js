const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['subscription_trends', 'plan_performance', 'user_behavior', 'revenue_analytics', 'usage_patterns'],
    required: [true, 'Analytics type is required']
  },
  period: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    granularity: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
      default: 'monthly'
    }
  },
  data: {
    subscriptionMetrics: {
      totalSubscriptions: { type: Number, default: 0 },
      newSubscriptions: { type: Number, default: 0 },
      cancelledSubscriptions: { type: Number, default: 0 },
      upgrades: { type: Number, default: 0 },
      downgrades: { type: Number, default: 0 },
      renewals: { type: Number, default: 0 },
      churnRate: { type: Number, default: 0 },
      growthRate: { type: Number, default: 0 }
    },
    planPerformance: [{
      planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
      },
      planName: String,
      subscriptionCount: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
      averageUsage: { type: Number, default: 0 },
      satisfactionScore: { type: Number, default: 0 },
      churnRate: { type: Number, default: 0 }
    }],
    revenueMetrics: {
      totalRevenue: { type: Number, default: 0 },
      recurringRevenue: { type: Number, default: 0 },
      averageRevenuePerUser: { type: Number, default: 0 },
      discountImpact: { type: Number, default: 0 },
      projectedRevenue: { type: Number, default: 0 }
    },
    userBehavior: {
      averageSessionDuration: { type: Number, default: 0 },
      mostActiveHours: [String],
      devicePreferences: [{
        device: String,
        percentage: Number
      }],
      contentPreferences: [{
        category: String,
        percentage: Number
      }]
    },
    usagePatterns: {
      averageMonthlyUsage: { type: Number, default: 0 },
      peakUsagePeriods: [String],
      lowUsagePeriods: [String],
      usageDistribution: [{
        range: String, // e.g., "0-10GB", "10-50GB"
        userCount: Number,
        percentage: Number
      }]
    }
  },
  insights: [{
    category: {
      type: String,
      enum: ['trend', 'anomaly', 'opportunity', 'risk', 'recommendation']
    },
    title: String,
    description: String,
    impact: {
      type: String,
      enum: ['high', 'medium', 'low']
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    actionItems: [String]
  }],
  recommendations: [{
    type: {
      type: String,
      enum: ['plan_optimization', 'pricing_strategy', 'marketing_campaign', 'user_retention', 'feature_enhancement']
    },
    title: String,
    description: String,
    expectedImpact: String,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low']
    },
    estimatedROI: Number,
    implementationEffort: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  }],
  metadata: {
    generatedBy: {
      type: String,
      enum: ['system', 'ai_engine', 'manual'],
      default: 'system'
    },
    version: {
      type: String,
      default: '1.0'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    dataQuality: {
      completeness: { type: Number, min: 0, max: 100, default: 100 },
      accuracy: { type: Number, min: 0, max: 100, default: 100 }
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
analyticsSchema.index({ type: 1, 'period.startDate': -1 });
analyticsSchema.index({ 'period.endDate': 1 });
analyticsSchema.index({ 'metadata.generatedBy': 1 });

// Static method to generate subscription trends analytics
analyticsSchema.statics.generateSubscriptionTrends = async function(startDate, endDate) {
  const Subscription = mongoose.model('Subscription');
  
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        totalSubscriptions: { $sum: 1 },
        newSubscriptions: {
          $sum: {
            $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
          }
        },
        cancelledSubscriptions: {
          $sum: {
            $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0]
          }
        }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ];
  
  const results = await Subscription.aggregate(pipeline);
  
  return new this({
    type: 'subscription_trends',
    period: { startDate, endDate, granularity: 'monthly' },
    data: {
      subscriptionMetrics: {
        totalSubscriptions: results.reduce((sum, r) => sum + r.totalSubscriptions, 0),
        newSubscriptions: results.reduce((sum, r) => sum + r.newSubscriptions, 0),
        cancelledSubscriptions: results.reduce((sum, r) => sum + r.cancelledSubscriptions, 0)
      }
    },
    metadata: { generatedBy: 'system' }
  });
};

// Static method to generate plan performance analytics
analyticsSchema.statics.generatePlanPerformance = async function(startDate, endDate) {
  const Subscription = mongoose.model('Subscription');
  const Plan = mongoose.model('Plan');
  
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'active'
      }
    },
    {
      $group: {
        _id: '$planId',
        subscriptionCount: { $sum: 1 },
        averagePrice: { $avg: '$pricing.finalPrice' },
        totalRevenue: { $sum: '$pricing.finalPrice' }
      }
    },
    {
      $lookup: {
        from: 'plans',
        localField: '_id',
        foreignField: '_id',
        as: 'planDetails'
      }
    },
    {
      $unwind: '$planDetails'
    },
    {
      $sort: { subscriptionCount: -1 }
    }
  ];
  
  const results = await Subscription.aggregate(pipeline);
  
  const planPerformance = results.map(result => ({
    planId: result._id,
    planName: result.planDetails.name,
    subscriptionCount: result.subscriptionCount,
    revenue: result.totalRevenue,
    averageUsage: 0, // This would need to be calculated from Usage model
    satisfactionScore: result.planDetails.popularity?.rating || 0,
    churnRate: 0 // This would need historical data calculation
  }));
  
  return new this({
    type: 'plan_performance',
    period: { startDate, endDate, granularity: 'monthly' },
    data: { planPerformance },
    metadata: { generatedBy: 'system' }
  });
};

// Method to generate AI-powered insights
analyticsSchema.methods.generateInsights = function() {
  const insights = [];
  
  // Analyze subscription trends
  if (this.data.subscriptionMetrics) {
    const metrics = this.data.subscriptionMetrics;
    
    if (metrics.churnRate > 10) {
      insights.push({
        category: 'risk',
        title: 'High Churn Rate Detected',
        description: `Churn rate of ${metrics.churnRate}% is above the healthy threshold of 10%`,
        impact: 'high',
        confidence: 85,
        actionItems: ['Analyze cancellation reasons', 'Implement retention campaigns', 'Review plan pricing']
      });
    }
    
    if (metrics.growthRate > 20) {
      insights.push({
        category: 'opportunity',
        title: 'Strong Growth Momentum',
        description: `Growth rate of ${metrics.growthRate}% indicates strong market demand`,
        impact: 'high',
        confidence: 90,
        actionItems: ['Scale infrastructure', 'Expand marketing budget', 'Consider new plan tiers']
      });
    }
  }
  
  // Analyze plan performance
  if (this.data.planPerformance && this.data.planPerformance.length > 0) {
    const topPlan = this.data.planPerformance[0];
    const totalSubscriptions = this.data.planPerformance.reduce((sum, plan) => sum + plan.subscriptionCount, 0);
    const topPlanShare = (topPlan.subscriptionCount / totalSubscriptions) * 100;
    
    if (topPlanShare > 60) {
      insights.push({
        category: 'risk',
        title: 'Over-dependence on Single Plan',
        description: `${topPlan.planName} accounts for ${topPlanShare.toFixed(1)}% of subscriptions`,
        impact: 'medium',
        confidence: 80,
        actionItems: ['Diversify plan portfolio', 'Promote alternative plans', 'Analyze customer needs']
      });
    }
  }
  
  this.insights = insights;
  return insights;
};

// Method to generate recommendations
analyticsSchema.methods.generateRecommendations = function() {
  const recommendations = [];
  
  // Based on insights, generate actionable recommendations
  this.insights.forEach(insight => {
    switch (insight.category) {
      case 'risk':
        if (insight.title.includes('Churn Rate')) {
          recommendations.push({
            type: 'user_retention',
            title: 'Implement Churn Reduction Program',
            description: 'Launch targeted retention campaigns for at-risk customers',
            expectedImpact: 'Reduce churn by 3-5%',
            priority: 'high',
            estimatedROI: 150,
            implementationEffort: 'medium'
          });
        }
        break;
      case 'opportunity':
        if (insight.title.includes('Growth Momentum')) {
          recommendations.push({
            type: 'marketing_campaign',
            title: 'Accelerate Customer Acquisition',
            description: 'Increase marketing spend to capitalize on growth momentum',
            expectedImpact: 'Increase new subscriptions by 25%',
            priority: 'high',
            estimatedROI: 200,
            implementationEffort: 'low'
          });
        }
        break;
    }
  });
  
  this.recommendations = recommendations;
  return recommendations;
};

module.exports = mongoose.model('Analytics', analyticsSchema);
