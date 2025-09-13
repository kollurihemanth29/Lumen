const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
<<<<<<< HEAD
    required: [true, 'Plan name is required'],
    trim: true,
    maxlength: [100, 'Plan name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Plan description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['fibernet', 'broadband-copper'],
    required: [true, 'Plan type is required']
  },
  pricing: {
    monthlyPrice: {
      type: Number,
      required: [true, 'Monthly price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      default: 'monthly'
    }
  },
  features: {
    dataQuota: {
      type: Number,
      required: [true, 'Data quota is required'],
      min: [0, 'Data quota cannot be negative']
    }, // in GB
    speed: {
      download: {
        type: Number,
        required: [true, 'Download speed is required']
      }, // in Mbps
      upload: {
        type: Number,
        required: [true, 'Upload speed is required']
      } // in Mbps
    },
    isUnlimited: {
      type: Boolean,
      default: false
    },
    additionalFeatures: [{
      name: String,
      description: String,
      included: { type: Boolean, default: true }
    }]
  },
  availability: {
    isActive: {
      type: Boolean,
      default: true
    },
    regions: [String], // Available regions/cities
    validFrom: {
      type: Date,
      default: Date.now
    },
    validUntil: {
      type: Date
    }
  },
  targetAudience: {
    type: String,
    enum: ['residential', 'business', 'enterprise', 'all'],
    default: 'residential'
  },
  popularity: {
    subscriptionCount: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    reviews: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
=======
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly', 'weekly', 'daily'],
    required: true,
    default: 'monthly'
  },
  features: [{
    name: String,
    description: String,
    included: {
      type: Boolean,
      default: true
    }
  }],
  limits: {
    users: {
      type: Number,
      default: null // null means unlimited
    },
    storage: {
      type: Number,
      default: null // in GB
    },
    apiCalls: {
      type: Number,
      default: null // per month
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  trialDays: {
    type: Number,
    default: 0
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
  }
}, {
  timestamps: true
});

<<<<<<< HEAD
// Index for efficient queries
planSchema.index({ type: 1, 'availability.isActive': 1 });
planSchema.index({ 'pricing.monthlyPrice': 1 });
planSchema.index({ 'popularity.subscriptionCount': -1 });

// Virtual for formatted price
planSchema.virtual('formattedPrice').get(function() {
  return `${this.pricing.currency} ${this.pricing.monthlyPrice}/${this.pricing.billingCycle}`;
});

// Method to check if plan is currently available
planSchema.methods.isCurrentlyAvailable = function() {
  const now = new Date();
  return this.availability.isActive && 
         this.availability.validFrom <= now && 
         (!this.availability.validUntil || this.availability.validUntil >= now);
};

// Static method to get popular plans
planSchema.statics.getPopularPlans = function(limit = 5) {
  return this.find({ 'availability.isActive': true })
    .sort({ 'popularity.subscriptionCount': -1 })
    .limit(limit);
};

=======
>>>>>>> 5bf46421c429c20e5464e1e7d7a47461380d6e59
module.exports = mongoose.model('Plan', planSchema);
