const mongoose = require('mongoose');

const billingInformationSchema = new mongoose.Schema({
  billingId: {
    type: String,
    required: [true, 'Billing ID is required'],
    unique: true,
    trim: true
  },
  subscriptionId: {
    type: String,
    required: [true, 'Subscription ID is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  billingDate: {
    type: Date,
    required: [true, 'Billing date is required'],
    default: Date.now
  },
  paymentStatus: {
    type: String,
    required: [true, 'Payment status is required'],
    enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  // Additional billing details
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'net_banking', 'upi', 'wallet', 'cash', '', null],
    trim: true
  },
  transactionId: {
    type: String,
    trim: true
  },
  paymentGateway: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date
  },
  paidDate: {
    type: Date
  },
  description: {
    type: String,
    trim: true
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: [0, 'Tax amount cannot be negative']
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Discount amount cannot be negative']
  },
  netAmount: {
    type: Number,
    min: [0, 'Net amount cannot be negative']
  },
  invoiceNumber: {
    type: String,
    trim: true
  },
  billingPeriod: {
    startDate: Date,
    endDate: Date
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

// Virtual for total amount display
billingInformationSchema.virtual('totalAmountDisplay').get(function() {
  return `₹${this.amount.toFixed(2)}`;
});

// Virtual for payment status display
billingInformationSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'Pending Payment',
    paid: 'Paid',
    failed: 'Payment Failed',
    refunded: 'Refunded',
    cancelled: 'Cancelled'
  };
  return statusMap[this.paymentStatus] || this.paymentStatus;
});

// Virtual for overdue status
billingInformationSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && this.paymentStatus === 'pending';
});

// Pre-save middleware to calculate net amount
billingInformationSchema.pre('save', function(next) {
  this.netAmount = this.amount - this.discountAmount + this.taxAmount;
  this.updatedAt = Date.now();
  next();
});

// Static method to find bills by subscription
billingInformationSchema.statics.findBySubscription = function(subscriptionId) {
  return this.find({ subscriptionId }).sort({ billingDate: -1 });
};

// Static method to find bills by payment status
billingInformationSchema.statics.findByPaymentStatus = function(paymentStatus) {
  return this.find({ paymentStatus }).sort({ billingDate: -1 });
};

// Static method to find overdue bills
billingInformationSchema.statics.findOverdue = function() {
  return this.find({
    paymentStatus: 'pending',
    dueDate: { $lt: new Date() }
  }).sort({ dueDate: 1 });
};

// Static method to find bills by date range
billingInformationSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    billingDate: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ billingDate: -1 });
};

// Static method to get revenue for period
billingInformationSchema.statics.getRevenue = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
        paidDate: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalTax: { $sum: '$taxAmount' },
        totalDiscount: { $sum: '$discountAmount' },
        billCount: { $sum: 1 }
      }
    }
  ]);
};

// Indexes for performance
billingInformationSchema.index({ billingId: 1 });
billingInformationSchema.index({ subscriptionId: 1 });
billingInformationSchema.index({ paymentStatus: 1 });
billingInformationSchema.index({ billingDate: -1 });
billingInformationSchema.index({ dueDate: 1 });
billingInformationSchema.index({ paidDate: -1 });
billingInformationSchema.index({ transactionId: 1 });

module.exports = mongoose.model('BillingInformation', billingInformationSchema);
