# Lumen Quest Backend API

A robust Node.js/Express backend for telecom inventory management system with JWT authentication and role-based access control.

## 🚀 Features

- **Authentication System**: JWT-based authentication with role-based access control
- **User Management**: Admin, Manager, and Staff roles with department-based organization
- **Security**: Helmet, CORS, rate limiting, password hashing with bcrypt
- **Validation**: Express-validator for input validation and sanitization
- **Error Handling**: Comprehensive error handling and logging
- **Database**: MongoDB with Mongoose ODM

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js               # MongoDB connection setup
├── controllers/
│   └── authController.js   # Authentication logic
├── middleware/
│   ├── authMiddleware.js   # JWT verification & role authorization
│   └── errorMiddleware.js  # Error handling middleware
├── models/
│   └── User.js             # User schema with roles and departments
├── routes/
│   └── authRoutes.js       # Authentication API routes
├── utils/
│   └── generateToken.js    # JWT token utilities
├── .env                    # Environment variables
├── server.js               # Express server entry point
└── package.json           # Dependencies and scripts
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup:**
   - Copy `.env` file and update the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/lumen-quest
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

3. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔐 Authentication API Endpoints

### Public Routes
- `POST /api/auth/login` - User login
- `GET /api/health` - Health check

### Protected Routes
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

## 👥 User Roles & Departments

### Roles:
- **Admin**: Full system access, can create users
- **Manager**: Department management access
- **Staff**: Basic inventory access

### Departments:
- Inventory
- Sales
- Procurement
- Technical
- Finance

## 📝 API Usage Examples

### Login
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Register (Admin only)
```javascript
POST /api/auth/register
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "staff",
  "department": "inventory",
  "employeeId": "EMP001",
  "phone": "1234567890"
}
```

### Get Profile
```javascript
GET /api/auth/profile
Authorization: Bearer <token>
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Express-validator for data sanitization
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers protection

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed),
  role: Enum ['admin', 'manager', 'staff'],
  department: Enum ['inventory', 'sales', 'procurement', 'technical', 'finance'],
  employeeId: String (required, unique),
  phone: String (10 digits),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

## 🚦 Getting Started

1. **Start MongoDB** (if running locally)
2. **Install dependencies**: `npm install`
3. **Configure environment**: Update `.env` file
4. **Start server**: `npm run dev`
5. **Test API**: Visit `http://localhost:5000/api/health`

## 📊 Development

- **Development**: `npm run dev` (with nodemon)
- **Production**: `npm start`
- **Testing**: `npm test` (Jest configured)

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | localhost:27017/lumen-quest |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | Token expiration time | 30d |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 |
| `NODE_ENV` | Environment mode | development |

## 📈 Next Steps

This backend template provides the foundation for:
- Product management system
- Supplier management
- Stock transaction tracking
- Inventory reporting
- Role-based dashboards

Ready to integrate with the frontend and extend with additional modules!
