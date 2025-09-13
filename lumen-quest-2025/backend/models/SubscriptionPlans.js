const mongoose = require('mongoose');

const subscriptionPlansSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Product ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
    maxlength: [100, 'Plan name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  autoRenewalAllowed: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued', 'Active', 'Inactive', 'Discontinued'],
    default: 'active'
  },
  // Additional plan details
  description: {
    type: String,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  dataLimit: {
    type: mongoose.Schema.Types.Mixed, // Can be Number, String, or null
    default: null
  },
  speed: {
    download: {
      type: Number, // in Mbps
      required: true
    },
    upload: {
      type: Number, // in Mbps
      required: true
    }
  },
  category: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'enterprise'],
    default: 'basic'
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

// Virtual for plan display name
subscriptionPlansSchema.virtual('displayName').get(function() {
  return `${this.name} - ₹${this.price}/${this.billingCycle}`;
});

// Virtual for data limit display
subscriptionPlansSchema.virtual('dataLimitDisplay').get(function() {
  return this.dataLimit ? `${this.dataLimit} GB` : 'Unlimited';
});

// Virtual for speed display
subscriptionPlansSchema.virtual('speedDisplay').get(function() {
  return `${this.speed.download}/${this.speed.upload} Mbps`;
});

// Pre-save middleware to update timestamps
subscriptionPlansSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find active plans
subscriptionPlansSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Static method to find plans by category
subscriptionPlansSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'active' });
};

// Static method to find plans by price range
subscriptionPlansSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  return this.find({
    price: { $gte: minPrice, $lte: maxPrice },
    status: 'active'
  });
};

// Indexes for performance
subscriptionPlansSchema.index({ productId: 1 });
subscriptionPlansSchema.index({ status: 1 });
subscriptionPlansSchema.index({ category: 1 });
subscriptionPlansSchema.index({ price: 1 });
subscriptionPlansSchema.index({ name: 1 });

module.exports = mongoose.model('SubscriptionPlans', subscriptionPlansSchema);
