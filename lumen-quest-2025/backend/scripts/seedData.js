require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const Billing = require('../models/Billing');
const SubscriptionLog = require('../models/SubscriptionLog');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample data
const samplePlans = [
  {
    name: 'Basic',
    description: 'Perfect for individuals and small projects',
    price: 9.99,
    currency: 'USD',
    billingCycle: 'monthly',
    features: [
      { name: 'Basic Support', description: 'Email support during business hours' },
      { name: 'Core Features', description: 'Access to all basic features' },
      { name: 'Mobile App', description: 'iOS and Android app access' }
    ],
    limits: {
      users: 1,
      storage: 5, // GB
      apiCalls: 1000
    },
    isActive: true,
    trialDays: 7
  },
  {
    name: 'Professional',
    description: 'Ideal for growing teams and businesses',
    price: 29.99,
    currency: 'USD',
    billingCycle: 'monthly',
    features: [
      { name: 'Priority Support', description: '24/7 chat and email support' },
      { name: 'Advanced Features', description: 'Access to all advanced features' },
      { name: 'Team Collaboration', description: 'Multi-user collaboration tools' },
      { name: 'Analytics Dashboard', description: 'Advanced reporting and analytics' }
    ],
    limits: {
      users: 10,
      storage: 50, // GB
      apiCalls: 10000
    },
    isActive: true,
    isPopular: true,
    trialDays: 14
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    price: 99.99,
    currency: 'USD',
    billingCycle: 'monthly',
    features: [
      { name: 'Dedicated Support', description: 'Dedicated account manager and phone support' },
      { name: 'Enterprise Features', description: 'All features including enterprise-grade security' },
      { name: 'Custom Integrations', description: 'Custom API integrations and webhooks' },
      { name: 'Advanced Analytics', description: 'Custom reports and data exports' },
      { name: 'SSO Integration', description: 'Single sign-on with your existing systems' }
    ],
    limits: {
      users: null, // unlimited
      storage: null, // unlimited
      apiCalls: null // unlimited
    },
    isActive: true,
    trialDays: 30
  }
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@lumenquest.com',
    password: 'admin123',
    role: 'admin',
    department: 'technical',
    employeeId: 'EMP001',
    phone: '1234567890',
    isActive: true
  },
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'user123',
    role: 'user',
    phone: '9876543210',
    isActive: true
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'user123',
    role: 'user',
    phone: '5555555555',
    isActive: true
  },
  {
    name: 'Manager User',
    email: 'manager@lumenquest.com',
    password: 'manager123',
    role: 'manager',
    department: 'sales',
    employeeId: 'EMP002',
    phone: '1111111111',
    isActive: true
  }
];

// Seed function
const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Plan.deleteMany({}),
      Subscription.deleteMany({}),
      Billing.deleteMany({}),
      SubscriptionLog.deleteMany({})
    ]);

    // Create plans
    console.log('📋 Creating plans...');
    const createdPlans = await Plan.insertMany(samplePlans);
    console.log(`✅ Created ${createdPlans.length} plans`);

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create sample subscriptions
    console.log('📝 Creating sample subscriptions...');
    const basicPlan = createdPlans.find(p => p.name === 'Basic');
    const proPlan = createdPlans.find(p => p.name === 'Professional');
    const regularUsers = createdUsers.filter(u => u.role === 'user');

    if (regularUsers.length >= 2 && basicPlan && proPlan) {
      const sampleSubscriptions = [
        {
          user: regularUsers[0]._id,
          plan: basicPlan._id,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          paymentMethod: 'credit_card',
          paymentDetails: {
            paymentMethodId: 'pm_test_123',
            customerId: 'cus_test_123'
          },
          usage: {
            apiCalls: 150,
            storageUsed: 1.2,
            usersCount: 1
          }
        },
        {
          user: regularUsers[1]._id,
          plan: proPlan._id,
          status: 'trial',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
          nextBillingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          paymentMethod: 'stripe',
          usage: {
            apiCalls: 500,
            storageUsed: 5.8,
            usersCount: 3
          }
        }
      ];

      const createdSubscriptions = await Subscription.insertMany(sampleSubscriptions);
      console.log(`✅ Created ${createdSubscriptions.length} subscriptions`);

      // Create sample billing records
      console.log('💳 Creating sample billing records...');
      const sampleBilling = [
        {
          subscription: createdSubscriptions[0]._id,
          user: regularUsers[0]._id,
          invoiceNumber: 'INV-2024-001',
          amount: basicPlan.price,
          currency: 'USD',
          totalAmount: basicPlan.price,
          status: 'paid',
          paymentMethod: 'credit_card',
          billingPeriod: {
            start: new Date(),
            end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          },
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          paidAt: new Date()
        }
      ];

      const createdBilling = await Billing.insertMany(sampleBilling);
      console.log(`✅ Created ${createdBilling.length} billing records`);

      // Create sample subscription logs
      console.log('📊 Creating sample subscription logs...');
      const sampleLogs = [
        {
          subscription: createdSubscriptions[0]._id,
          user: regularUsers[0]._id,
          action: 'created',
          newStatus: 'active',
          newPlan: basicPlan._id,
          amount: basicPlan.price,
          currency: 'USD',
          reason: 'Initial subscription creation'
        },
        {
          subscription: createdSubscriptions[1]._id,
          user: regularUsers[1]._id,
          action: 'trial_started',
          newStatus: 'trial',
          newPlan: proPlan._id,
          reason: 'Trial period started'
        }
      ];

      const createdLogs = await SubscriptionLog.insertMany(sampleLogs);
      console.log(`✅ Created ${createdLogs.length} subscription logs`);
    }

    console.log('🎉 Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`Plans: ${createdPlans.length}`);
    console.log(`Users: ${createdUsers.length}`);
    console.log(`Subscriptions: ${await Subscription.countDocuments()}`);
    console.log(`Billing Records: ${await Billing.countDocuments()}`);
    console.log(`Subscription Logs: ${await SubscriptionLog.countDocuments()}`);

    console.log('\n🔐 Test Credentials:');
    console.log('Admin: admin@lumenquest.com / admin123');
    console.log('Manager: manager@lumenquest.com / manager123');
    console.log('User 1: john.doe@example.com / user123');
    console.log('User 2: jane.smith@example.com / user123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeder if called directly
if (require.main === module) {
  connectDB().then(() => {
    seedData();
  });
}

module.exports = { seedData, connectDB };
