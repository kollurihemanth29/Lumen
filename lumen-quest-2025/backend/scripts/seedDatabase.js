const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const SubscriptionPlans = require('../models/SubscriptionPlans');
const Subscription = require('../models/Subscription');
const SubscriptionLogs = require('../models/SubscriptionLogs');
const BillingInformation = require('../models/BillingInformation');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lumen-quest');
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Helper function to read Excel file
const readExcelFile = (filePath, sheetName = null) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheet = sheetName || workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    console.log(`📊 Read ${data.length} rows from ${sheet} sheet`);
    return data;
  } catch (error) {
    console.error(`❌ Error reading Excel file: ${error.message}`);
    return [];
  }
};

// Seed Users
const seedUsers = async (filePath) => {
  try {
    const userData = readExcelFile(filePath, 'User_Data');
    
    for (const row of userData) {
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [
          { email: row.Email },
          { userId: row['User Id'] }
        ]
      });
      if (existingUser) {
        console.log(`⚠️  User ${row.Email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(row.Password || 'defaultPassword123', 12);

      const user = new User({
        userId: row['User Id'],
        name: row.Name,
        phone: row.Phone,
        email: row.Email,
        status: row.Status || 'active',
        password: hashedPassword,
        role: row.Role || 'end-user'
      });

      await user.save();
      console.log(`✅ Created user: ${user.email}`);
    }
  } catch (error) {
    console.error(`❌ Error seeding users: ${error.message}`);
  }
};

// Seed Subscription Plans
const seedSubscriptionPlans = async (filePath) => {
  try {
    const planData = readExcelFile(filePath, 'Subscription_Plans');
    
    for (const row of planData) {
      // Check if plan already exists
      const existingPlan = await SubscriptionPlans.findOne({ productId: row['Product Id'] });
      if (existingPlan) {
        console.log(`⚠️  Plan ${row.Name} already exists, skipping...`);
        continue;
      }

      const plan = new SubscriptionPlans({
        productId: row['Product Id'],
        name: row.Name,
        price: parseFloat(row.Price) || 0,
        autoRenewalAllowed: row['Auto Renewal Allowed'] !== false,
        status: row.Status || 'active',
        description: row.Description || '',
        features: row.Features ? row.Features.split(',').map(f => f.trim()) : [],
        billingCycle: row['Billing Cycle'] || 'monthly',
        dataLimit: row['Data Limit'] === 'Unlimited' ? null : parseInt(row['Data Limit']),
        speed: {
          download: parseInt(row['Download Speed']) || 100,
          upload: parseInt(row['Upload Speed']) || 50
        },
        category: row.Category || 'basic'
      });

      await plan.save();
      console.log(`✅ Created plan: ${plan.name}`);
    }
  } catch (error) {
    console.error(`❌ Error seeding subscription plans: ${error.message}`);
  }
};

// Seed Subscriptions
const seedSubscriptions = async (filePath) => {
  try {
    const subscriptionData = readExcelFile(filePath, 'Subscriptions');
    
    for (const row of subscriptionData) {
      // Check if subscription already exists
      const existingSubscription = await Subscription.findOne({ 
        subscriptionId: row['Subscription Id']
      });
      
      if (existingSubscription) {
        console.log(`⚠️  Subscription ${row['Subscription Id']} already exists, skipping...`);
        continue;
      }

      const subscription = new Subscription({
        subscriptionId: row['Subscription Id'],
        subscriptionType: row['Subscription Type'],
        productId: row['Product Id'],
        userId: row['User Id'],
        status: row.Status || 'active',
        startDate: row['Start Date'] ? new Date(row['Start Date']) : new Date(),
        lastBilledDate: row['Last Billed Date'] ? new Date(row['Last Billed Date']) : null,
        lastRenewedDate: row['Last Renewed Date'] ? new Date(row['Last Renewed Date']) : null,
        terminatedDate: row['Terminated Date'] ? new Date(row['Terminated Date']) : null,
        graceTime: parseInt(row['Grace Time']) || 0
      });

      await subscription.save();
      console.log(`✅ Created subscription: ${subscription.subscriptionId}`);
    }
  } catch (error) {
    console.error(`❌ Error seeding subscriptions: ${error.message}`);
  }
};

// Seed Subscription Logs
const seedSubscriptionLogs = async (filePath) => {
  try {
    const logsData = readExcelFile(filePath, 'Subscription_Logs');
    
    for (const row of logsData) {
      const log = new SubscriptionLogs({
        subscriptionId: row['Subscription id'],
        currentStatus: row['current status'],
        nextStatus: row['next status'],
        action: row.action,
        actionDate: row['action date'] ? new Date(row['action date']) : new Date(),
        performedBy: row['performed by'] || 'system',
        reason: row.reason || '',
        notes: row.notes || ''
      });

      await log.save();
      console.log(`✅ Created subscription log: ${log.subscriptionId} - ${log.action}`);
    }
  } catch (error) {
    console.error(`❌ Error seeding subscription logs: ${error.message}`);
  }
};

// Seed Billing Information
const seedBillingInformation = async (filePath) => {
  try {
    const billingData = readExcelFile(filePath, 'Billing_Information');
    
    for (const row of billingData) {
      const existingBilling = await BillingInformation.findOne({ billingId: row.billing_id });
      if (existingBilling) {
        console.log(`⚠️  Billing record ${row.billing_id} already exists, skipping...`);
        continue;
      }

      const billing = new BillingInformation({
        billingId: row.billing_id,
        subscriptionId: row.subscription_id,
        amount: parseFloat(row.amount) || 0,
        billingDate: row.billing_date ? new Date(row.billing_date) : new Date(),
        paymentStatus: row.payment_status || 'pending',
        paymentMethod: row.payment_method || '',
        transactionId: row.transaction_id || '',
        dueDate: row.due_date ? new Date(row.due_date) : null,
        paidDate: row.paid_date ? new Date(row.paid_date) : null,
        description: row.description || '',
        taxAmount: parseFloat(row.tax_amount) || 0,
        discountAmount: parseFloat(row.discount_amount) || 0
      });

      await billing.save();
      console.log(`✅ Created billing record: ${billing.billingId}`);
    }
  } catch (error) {
    console.error(`❌ Error seeding billing information: ${error.message}`);
  }
};

// Main seeding function
const seedDatabase = async () => {
  // PASTE YOUR EXCEL FILE PATH HERE
  const excelFilePath = 'C:\\Users\\Hemanth\\Downloads\\SubscriptionUseCase_Dataset.xlsx';
  
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    console.log(`📁 Excel file: ${excelFilePath}`);
    
    // Seed in order (due to dependencies)
    await seedUsers(excelFilePath);
    await seedSubscriptionPlans(excelFilePath);
    await seedSubscriptions(excelFilePath);
    await seedSubscriptionLogs(excelFilePath);
    await seedBillingInformation(excelFilePath);
    
    console.log('✅ Database seeding completed successfully!');
    
    // Print summary
    const userCount = await User.countDocuments();
    const planCount = await SubscriptionPlans.countDocuments();
    const subscriptionCount = await Subscription.countDocuments();
    const logsCount = await SubscriptionLogs.countDocuments();
    const billingCount = await BillingInformation.countDocuments();
    
    console.log('\n📊 Database Summary:');
    console.log(`👥 Users: ${userCount}`);
    console.log(`📋 Subscription Plans: ${planCount}`);
    console.log(`📝 Subscriptions: ${subscriptionCount}`);
    console.log(`📈 Subscription Logs: ${logsCount}`);
    console.log(`💰 Billing Records: ${billingCount}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// CLI usage
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedUsers, seedSubscriptionPlans, seedSubscriptions, seedSubscriptionLogs, seedBillingInformation };
