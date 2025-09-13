const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
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
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  tax: {
    amount: {
      type: Number,
      default: 0
    },
    rate: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      enum: ['VAT', 'GST', 'Sales Tax', 'Other']
    }
  },
  discount: {
    amount: {
      type: Number,
      default: 0
    },
    code: String,
    percentage: Number
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer', 'stripe', 'razorpay']
  },
  paymentDetails: {
    transactionId: String,
    paymentMethodId: String,
    last4: String,
    brand: String,
    gateway: String
  },
  billingPeriod: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidAt: {
    type: Date
  },
  failureReason: {
    type: String
  },
  retryCount: {
    type: Number,
    default: 0
  },
  nextRetryDate: {
    type: Date
  },
  refunds: [{
    amount: Number,
    reason: String,
    refundedAt: Date,
    transactionId: String
  }],
  downloadUrl: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
billingSchema.index({ user: 1, status: 1 });
billingSchema.index({ subscription: 1, createdAt: -1 });
billingSchema.index({ invoiceNumber: 1 });
billingSchema.index({ dueDate: 1, status: 1 });

module.exports = mongoose.model('Billing', billingSchema);
