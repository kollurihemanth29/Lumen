const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Generate unique invoice number
const generateInvoiceNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INV-${timestamp}-${random}`;
};

// Calculate subscription end date based on billing cycle
const calculateEndDate = (startDate, billingCycle) => {
  const start = new Date(startDate);
  let endDate = new Date(start);

  switch (billingCycle) {
    case 'daily':
      endDate.setDate(start.getDate() + 1);
      break;
    case 'weekly':
      endDate.setDate(start.getDate() + 7);
      break;
    case 'monthly':
      endDate.setMonth(start.getMonth() + 1);
      break;
    case 'yearly':
      endDate.setFullYear(start.getFullYear() + 1);
      break;
    default:
      endDate.setMonth(start.getMonth() + 1); // Default to monthly
  }

  return endDate;
};

// Calculate next billing date
const calculateNextBillingDate = (currentDate, billingCycle) => {
  return calculateEndDate(currentDate, billingCycle);
};

// Calculate trial end date
const calculateTrialEndDate = (startDate, trialDays) => {
  const start = new Date(startDate);
  const trialEnd = new Date(start);
  trialEnd.setDate(start.getDate() + trialDays);
  return trialEnd;
};

// Format currency
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Calculate discount amount
const calculateDiscount = (amount, discount) => {
  if (discount.percentage) {
    return (amount * discount.percentage) / 100;
  }
  if (discount.amount) {
    return Math.min(discount.amount, amount);
  }
  return 0;
};

// Calculate tax amount
const calculateTax = (amount, taxRate) => {
  return (amount * taxRate) / 100;
};

// Generate secure random string
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if subscription is active
const isSubscriptionActive = (subscription) => {
  const now = new Date();
  return subscription.status === 'active' && 
         subscription.endDate > now;
};

// Check if subscription is in trial
const isSubscriptionInTrial = (subscription) => {
  const now = new Date();
  return subscription.status === 'trial' && 
         subscription.trialEndDate && 
         subscription.trialEndDate > now;
};

// Get subscription status display text
const getSubscriptionStatusText = (subscription) => {
  const statusMap = {
    'active': 'Active',
    'inactive': 'Inactive',
    'cancelled': 'Cancelled',
    'expired': 'Expired',
    'trial': 'Trial',
    'suspended': 'Suspended'
  };
  return statusMap[subscription.status] || 'Unknown';
};

// Calculate usage percentage
const calculateUsagePercentage = (used, limit) => {
  if (!limit || limit === 0) return 0;
  return Math.min((used / limit) * 100, 100);
};

// Check if usage limit exceeded
const isUsageLimitExceeded = (used, limit) => {
  if (!limit) return false; // No limit means unlimited
  return used >= limit;
};

// Generate pagination metadata
const getPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNext,
    hasPrev,
    nextPage: hasNext ? page + 1 : null,
    prevPage: hasPrev ? page - 1 : null
  };
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Generate API response format
const createResponse = (success, data = null, message = '', error = null) => {
  const response = { success };
  
  if (data !== null) response.data = data;
  if (message) response.message = message;
  if (error) response.error = error;
  
  return response;
};

// Date formatting helpers
const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    default:
      return d.toISOString().split('T')[0];
  }
};

// Check if date is in the past
const isDateInPast = (date) => {
  return new Date(date) < new Date();
};

// Check if date is in the future
const isDateInFuture = (date) => {
  return new Date(date) > new Date();
};

module.exports = {
  generateInvoiceNumber,
  calculateEndDate,
  calculateNextBillingDate,
  calculateTrialEndDate,
  formatCurrency,
  calculateDiscount,
  calculateTax,
  generateSecureToken,
  isValidEmail,
  isSubscriptionActive,
  isSubscriptionInTrial,
  getSubscriptionStatusText,
  calculateUsagePercentage,
  isUsageLimitExceeded,
  getPaginationMeta,
  sanitizeInput,
  createResponse,
  formatDate,
  isDateInPast,
  isDateInFuture
};
