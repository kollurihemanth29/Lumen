Subscription Management System

A full-stack subscription management system that allows users to explore, subscribe, and manage subscription plans while providing admins with tools for plan management, analytics, and insights.

This project is designed as a hackathon-ready MVP with a Node.js/Express backend, MongoDB database, and React frontend.

🚀 Features
User

Browse available subscription plans

Subscribe to a plan

Upgrade or downgrade subscriptions

Cancel or renew subscriptions

View active subscription details

Admin

Create, update, or deactivate plans

View all plans (active + inactive)

Access admin dashboard with insights:

Top plans by active subscriptions

Active vs cancelled subscriptions

Monthly trends

Analytics (Optional Enhancements)

Subscription trends per plan per month

Churn prediction from logs

Revenue insights from billing

🛠️ Tech Stack

Backend: Node.js, Express.js

Database: MongoDB (Local or Atlas)

Auth: JWT, bcrypt.js

Frontend: React.js (with Chart.js/Recharts for analytics)

Utilities: dotenv, cors, nodemon, xlsx

📂 Project Structure
subscription-management-backend/
│── server.js
│── config/
│   └── db.js
│── models/
│   ├── User.js
│   ├── Plan.js
│   ├── Subscription.js
│   ├── SubscriptionLog.js
│   └── Billing.js
│── routes/
│   ├── userRoutes.js
│   ├── adminRoutes.js
│   └── analyticsRoutes.js (optional)
│── controllers/
│   ├── userController.js
│   ├── adminController.js
│   └── analyticsController.js (optional)
│── middleware/
│   └── authMiddleware.js
│── seed/
│   └── importDataset.js

⚙️ Setup & Installation

Clone repo

git clone https://github.com/your-username/subscription-management-system.git
cd subscription-management-backend


Install dependencies

npm install


Setup environment
Create a .env file in the root:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret


Run server

npm run dev


Seed database (optional)

node seed/importDataset.js

🔑 API Endpoints
User

GET /plans – List all active plans

POST /subscribe/:planId – Subscribe to a plan

PUT /subscription/:id/upgrade – Upgrade subscription

PUT /subscription/:id/downgrade – Downgrade subscription

PUT /subscription/:id/cancel – Cancel subscription

PUT /subscription/:id/renew – Renew subscription

GET /my-subscription – View active subscription

Admin

POST /admin/plans – Create a plan

PUT /admin/plans/:id – Update a plan

DELETE /admin/plans/:id – Deactivate a plan

GET /admin/plans – View all plans

GET /admin/dashboard – Analytics dashboard

Analytics (optional)

GET /analytics/plan-trends

GET /analytics/churn

GET /analytics/revenue

🎯 Demo Flow (MVP)

Login as User → Browse plans → Subscribe → Cancel or renew

Login as Admin → Create a new plan → Open dashboard → View charts

(Optional) → Explore churn/revenue analytics
