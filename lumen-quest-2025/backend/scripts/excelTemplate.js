const XLSX = require('xlsx');
const path = require('path');

// Create Excel template with sample data
const createExcelTemplate = () => {
  const workbook = XLSX.utils.book_new();

  // Users sheet
  const usersData = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'end-user',
      phone: '+91-9876543210',
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
      language: 'en',
      timezone: 'Asia/Kolkata',
      primaryUsage: 'streaming',
      deviceCount: 5,
      peakHours: '19:00-23:00,14:00-16:00',
      isActive: true,
      isEmailVerified: true
    },
    {
      name: 'Admin User',
      email: 'admin@lumenquest.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91-9876543211',
      street: '456 Admin Street',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India',
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      language: 'en',
      timezone: 'Asia/Kolkata',
      primaryUsage: 'general',
      deviceCount: 3,
      peakHours: '09:00-18:00',
      isActive: true,
      isEmailVerified: true
    }
  ];

  // Plans sheet
  const plansData = [
    {
      name: 'Fibernet Basic',
      type: 'Fibernet',
      downloadSpeed: 50,
      uploadSpeed: 25,
      speedUnit: 'Mbps',
      monthlyPrice: 599,
      quarterlyPrice: 1707,
      yearlyPrice: 6471,
      currency: 'INR',
      dataLimit: 'Unlimited',
      dataUnit: 'GB',
      features: '24/7 Support, Free Installation, Router Included',
      description: 'Perfect for basic browsing and streaming',
      regions: 'Mumbai, Delhi, Bangalore',
      isActive: true,
      technology: 'Fiber Optic',
      latency: 5,
      bandwidth: 50,
      ipType: 'Dynamic'
    },
    {
      name: 'Fibernet Premium',
      type: 'Fibernet',
      downloadSpeed: 100,
      uploadSpeed: 50,
      speedUnit: 'Mbps',
      monthlyPrice: 999,
      quarterlyPrice: 2847,
      yearlyPrice: 10791,
      currency: 'INR',
      dataLimit: 'Unlimited',
      dataUnit: 'GB',
      features: '24/7 Support, Free Installation, Router Included, Priority Support',
      description: 'High-speed internet for heavy users',
      regions: 'All India',
      isActive: true,
      technology: 'Fiber Optic',
      latency: 3,
      bandwidth: 100,
      ipType: 'Dynamic'
    },
    {
      name: 'Broadband Copper Basic',
      type: 'Broadband Copper',
      downloadSpeed: 25,
      uploadSpeed: 5,
      speedUnit: 'Mbps',
      monthlyPrice: 399,
      quarterlyPrice: 1137,
      yearlyPrice: 4311,
      currency: 'INR',
      dataLimit: 500,
      dataUnit: 'GB',
      features: '24/7 Support, Free Installation',
      description: 'Affordable broadband for light usage',
      regions: 'Tier 2 Cities',
      isActive: true,
      technology: 'Copper',
      latency: 15,
      bandwidth: 25,
      ipType: 'Dynamic'
    }
  ];

  // Subscriptions sheet
  const subscriptionsData = [
    {
      userEmail: 'john.doe@example.com',
      planName: 'Fibernet Premium',
      status: 'active',
      billingCycle: 'monthly',
      startDate: '2024-01-15',
      endDate: '',
      nextBillingDate: '2024-12-15',
      autoRenew: true,
      baseAmount: 999,
      discountAmount: 0,
      taxAmount: 179.82,
      totalAmount: 1178.82,
      installationDate: '2024-01-15',
      connectionId: 'CONN20240115001',
      ipAddress: '192.168.1.100',
      macAddress: '00:1B:44:11:3A:B7'
    }
  ];

  // Usage sheet
  const usageData = [
    {
      userEmail: 'john.doe@example.com',
      date: '2024-12-01',
      downloadUsage: 45.2,
      uploadUsage: 8.3,
      totalUsage: 53.5,
      usageUnit: 'GB',
      sessionDuration: 1440,
      peakSpeed: 98.7,
      avgSpeed: 92.3,
      uptime: 99.2,
      deviceBreakdown: '[]',
      applicationUsage: '[]',
      latency: 3,
      jitter: 1,
      packetLoss: 0.1
    },
    {
      userEmail: 'john.doe@example.com',
      date: '2024-12-02',
      downloadUsage: 52.1,
      uploadUsage: 9.8,
      totalUsage: 61.9,
      usageUnit: 'GB',
      sessionDuration: 1440,
      peakSpeed: 99.1,
      avgSpeed: 94.2,
      uptime: 99.8,
      deviceBreakdown: '[]',
      applicationUsage: '[]',
      latency: 3,
      jitter: 1,
      packetLoss: 0.05
    }
  ];

  // Discounts sheet
  const discountsData = [
    {
      name: 'New User Welcome',
      description: 'Special discount for first-time subscribers',
      code: 'WELCOME25',
      type: 'percentage',
      value: 25,
      minOrderAmount: 500,
      maxDiscountAmount: 500,
      validFrom: '2024-01-01',
      validUntil: '2024-12-31',
      usageLimit: 1000,
      usageCount: 234,
      userTypes: 'new',
      planTypes: 'Fibernet',
      regions: 'All India',
      isActive: true
    },
    {
      name: 'Student Discount',
      description: 'Special pricing for students',
      code: 'STUDENT15',
      type: 'percentage',
      value: 15,
      minOrderAmount: 300,
      maxDiscountAmount: 300,
      validFrom: '2024-03-01',
      validUntil: '2024-12-31',
      usageLimit: 2000,
      usageCount: 567,
      userTypes: 'student',
      planTypes: 'Fibernet,Broadband Copper',
      regions: 'All India',
      isActive: true
    }
  ];

  // Create worksheets
  const usersWS = XLSX.utils.json_to_sheet(usersData);
  const plansWS = XLSX.utils.json_to_sheet(plansData);
  const subscriptionsWS = XLSX.utils.json_to_sheet(subscriptionsData);
  const usageWS = XLSX.utils.json_to_sheet(usageData);
  const discountsWS = XLSX.utils.json_to_sheet(discountsData);

  // Add worksheets to workbook
  XLSX.utils.book_append_sheet(workbook, usersWS, 'Users');
  XLSX.utils.book_append_sheet(workbook, plansWS, 'Plans');
  XLSX.utils.book_append_sheet(workbook, subscriptionsWS, 'Subscriptions');
  XLSX.utils.book_append_sheet(workbook, usageWS, 'Usage');
  XLSX.utils.book_append_sheet(workbook, discountsWS, 'Discounts');

  // Write file
  const templatePath = path.join(__dirname, 'lumen-quest-data-template.xlsx');
  XLSX.writeFile(workbook, templatePath);
  
  console.log(`✅ Excel template created: ${templatePath}`);
  return templatePath;
};

// CLI usage
if (require.main === module) {
  createExcelTemplate();
}

module.exports = { createExcelTemplate };
