# Subscription Management API Documentation

## Overview
This document provides comprehensive documentation for the Lumen Quest Subscription Management API endpoints.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Endpoints (`/api/user`)

### Get Current Subscription
```http
GET /api/user/subscription
```
**Description:** Retrieve the current active subscription for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "subscription_id",
    "user": "user_id",
    "plan": {
      "_id": "plan_id",
      "name": "Professional",
      "price": 29.99,
      "features": [...],
      "limits": {...}
    },
    "status": "active",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-02-01T00:00:00.000Z",
    "usage": {
      "apiCalls": 500,
      "storageUsed": 5.8,
      "usersCount": 3
    }
  }
}
```

### Get Available Plans
```http
GET /api/user/plans
```
**Description:** Retrieve all available subscription plans.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "plan_id",
      "name": "Basic",
      "description": "Perfect for individuals and small projects",
      "price": 9.99,
      "currency": "USD",
      "billingCycle": "monthly",
      "features": [...],
      "limits": {...},
      "trialDays": 7
    }
  ]
}
```

### Subscribe to Plan
```http
POST /api/user/subscribe
```
**Description:** Subscribe to a new plan.

**Request Body:**
```json
{
  "planId": "plan_id",
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "paymentMethodId": "pm_test_123",
    "customerId": "cus_test_123"
  }
}
```

### Update Subscription
```http
PUT /api/user/subscription
```
**Description:** Update current subscription (upgrade/downgrade).

**Request Body:**
```json
{
  "planId": "new_plan_id",
  "effectiveDate": "immediate" // or "next_billing_cycle"
}
```

### Cancel Subscription
```http
DELETE /api/user/subscription
```
**Description:** Cancel the current subscription.

**Request Body:**
```json
{
  "reason": "No longer needed",
  "effectiveDate": "end_of_period" // or "immediate"
}
```

### Get Subscription History
```http
GET /api/user/subscription/history
```
**Description:** Retrieve subscription change history.

### Get Billing History
```http
GET /api/user/billing/history
```
**Description:** Retrieve billing and invoice history.

### Get Invoice
```http
GET /api/user/billing/invoice/:invoiceId
```
**Description:** Retrieve a specific invoice.

### Download Invoice
```http
GET /api/user/billing/invoice/:invoiceId/download
```
**Description:** Download invoice as PDF.

### Update Payment Method
```http
PUT /api/user/payment-method
```
**Description:** Update payment method for subscription.

**Request Body:**
```json
{
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "paymentMethodId": "pm_new_123"
  }
}
```

### Get Usage Statistics
```http
GET /api/user/usage
```
**Description:** Get current usage statistics and limits.

**Response:**
```json
{
  "success": true,
  "data": {
    "usage": {
      "apiCalls": 500,
      "storageUsed": 5.8,
      "usersCount": 3
    },
    "limits": {
      "apiCalls": 10000,
      "storage": 50,
      "users": 10
    },
    "utilizationPercentage": {
      "apiCalls": 5.0,
      "storage": 11.6,
      "users": 30.0
    }
  }
}
```

## Admin Endpoints (`/api/admin`)
*Requires admin role*

### Plan Management

#### Get All Plans
```http
GET /api/admin/plans
```

#### Create Plan
```http
POST /api/admin/plans
```
**Request Body:**
```json
{
  "name": "Enterprise Plus",
  "description": "Advanced enterprise features",
  "price": 199.99,
  "currency": "USD",
  "billingCycle": "monthly",
  "features": [
    {
      "name": "Advanced Analytics",
      "description": "Custom reports and dashboards"
    }
  ],
  "limits": {
    "users": null,
    "storage": null,
    "apiCalls": null
  },
  "trialDays": 30
}
```

#### Update Plan
```http
PUT /api/admin/plans/:planId
```

#### Delete Plan
```http
DELETE /api/admin/plans/:planId
```

#### Get Plan by ID
```http
GET /api/admin/plans/:planId
```

### Subscription Management

#### Get All Subscriptions
```http
GET /api/admin/subscriptions
```

#### Get Subscription by ID
```http
GET /api/admin/subscriptions/:subscriptionId
```

#### Update Subscription Status
```http
PUT /api/admin/subscriptions/:subscriptionId/status
```
**Request Body:**
```json
{
  "status": "suspended",
  "reason": "Payment failure"
}
```

#### Cancel Subscription (Admin)
```http
DELETE /api/admin/subscriptions/:subscriptionId
```

### User Management

#### Get All Users
```http
GET /api/admin/users
```

#### Get User by ID
```http
GET /api/admin/users/:userId
```

#### Get User Subscriptions
```http
GET /api/admin/users/:userId/subscriptions
```

#### Update User Subscription
```http
PUT /api/admin/users/:userId/subscription
```

### Billing Management

#### Get All Billing Records
```http
GET /api/admin/billing
```

#### Get Billing by ID
```http
GET /api/admin/billing/:billingId
```

#### Update Billing Status
```http
PUT /api/admin/billing/:billingId/status
```

#### Process Refund
```http
POST /api/admin/billing/:billingId/refund
```
**Request Body:**
```json
{
  "amount": 29.99,
  "reason": "Customer request"
}
```

### Dashboard Analytics

#### Get Dashboard Stats
```http
GET /api/admin/dashboard/stats
```

#### Get Revenue Stats
```http
GET /api/admin/dashboard/revenue
```

#### Get Subscription Stats
```http
GET /api/admin/dashboard/subscriptions/stats
```

#### Get User Stats
```http
GET /api/admin/dashboard/users/stats
```

### Reports

#### Get Revenue Report
```http
GET /api/admin/reports/revenue?startDate=2024-01-01&endDate=2024-12-31
```

#### Get Subscription Report
```http
GET /api/admin/reports/subscriptions?period=monthly
```

#### Get Churn Report
```http
GET /api/admin/reports/churn?period=quarterly
```

## Analytics Endpoints (`/api/analytics`)
*Requires admin role*

### Revenue Analytics

#### Monthly Revenue
```http
GET /api/analytics/revenue/monthly?year=2024
```

#### Yearly Revenue
```http
GET /api/analytics/revenue/yearly
```

#### Revenue Trends
```http
GET /api/analytics/revenue/trends?period=6months
```

### Subscription Analytics

#### Subscription Growth
```http
GET /api/analytics/subscriptions/growth?period=monthly
```

#### Churn Rate
```http
GET /api/analytics/subscriptions/churn?period=monthly
```

#### Retention Rate
```http
GET /api/analytics/subscriptions/retention?cohort=monthly
```

#### Conversion Rate
```http
GET /api/analytics/subscriptions/conversion?period=monthly
```

### Plan Analytics

#### Plan Popularity
```http
GET /api/analytics/plans/popularity
```

#### Plan Performance
```http
GET /api/analytics/plans/performance?period=quarterly
```

### User Analytics

#### User Acquisition
```http
GET /api/analytics/users/acquisition?period=monthly
```

#### Lifetime Value
```http
GET /api/analytics/users/lifetime-value?cohort=monthly
```

#### User Engagement
```http
GET /api/analytics/users/engagement?period=weekly
```

### Payment Analytics

#### Payment Success Rate
```http
GET /api/analytics/payments/success-rate?period=monthly
```

#### Failed Payments
```http
GET /api/analytics/payments/failed?period=monthly
```

#### Payment Method Stats
```http
GET /api/analytics/payments/methods
```

### Custom Reports

#### Generate Custom Report
```http
POST /api/analytics/reports/custom
```
**Request Body:**
```json
{
  "reportType": "revenue_by_plan",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-12-31"
  },
  "filters": {
    "planIds": ["plan1", "plan2"],
    "status": ["active", "trial"]
  }
}
```

#### Export Report
```http
GET /api/analytics/reports/export/:reportId?format=csv
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Higher limits available for authenticated users

## Pagination
List endpoints support pagination:
```
GET /api/admin/subscriptions?page=1&limit=20&sort=createdAt&order=desc
```

## Webhooks
Configure webhooks for subscription events:
- `subscription.created`
- `subscription.updated`
- `subscription.cancelled`
- `payment.succeeded`
- `payment.failed`
- `invoice.created`

## Testing
Use the seeder script to populate test data:
```bash
npm run seed
```

### Test Credentials
- **Admin:** admin@lumenquest.com / admin123
- **Manager:** manager@lumenquest.com / manager123
- **User 1:** john.doe@example.com / user123
- **User 2:** jane.smith@example.com / user123
