# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the backend root directory with the following variables:

### Database Configuration
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/lumen-quest
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lumen-quest

# Database Name (optional, extracted from URI if not provided)
DB_NAME=lumen-quest
```

### Server Configuration
```env
# Server Port
PORT=5000

# Environment
NODE_ENV=development
# Options: development, production, test

# Client URL for CORS
CLIENT_URL=http://localhost:3000
```

### Authentication & Security
```env
# JWT Secret (use a strong, random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# JWT Expiration
JWT_EXPIRE=30d

# Session Secret for OAuth
SESSION_SECRET=your-session-secret-here
```

### Rate Limiting
```env
# Rate limiting configuration
RATE_LIMIT_WINDOW_MS=900000
# 15 minutes in milliseconds (15 * 60 * 1000)

RATE_LIMIT_MAX_REQUESTS=100
# Maximum requests per window
```

### OAuth Configuration (Google)
```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### Email Configuration (SendGrid)
```env
# SendGrid API Key
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here

# From Email Address
FROM_EMAIL=noreply@lumenquest.com
FROM_NAME=Lumen Quest
```

### SMS Configuration (Twilio)
```env
# Twilio Credentials
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Payment Processing (Stripe)
```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Stripe Product/Price IDs for subscription plans
STRIPE_BASIC_PRICE_ID=price_basic_monthly
STRIPE_PRO_PRICE_ID=price_pro_monthly
STRIPE_ENTERPRISE_PRICE_ID=price_enterprise_monthly
```

### File Storage (Optional - AWS S3)
```env
# AWS S3 Configuration (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=lumen-quest-uploads
```

### Logging & Monitoring
```env
# Log Level
LOG_LEVEL=info
# Options: error, warn, info, debug

# Sentry DSN (for error tracking)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Redis Configuration (Optional - for caching)
```env
# Redis URL (for session storage and caching)
REDIS_URL=redis://localhost:6379
# or for Redis Cloud:
# REDIS_URL=redis://username:password@host:port
```

## Sample .env File

```env
# Database
MONGODB_URI=mongodb://localhost:27017/lumen-quest

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Authentication
JWT_SECRET=super-secret-jwt-key-change-this-in-production-make-it-very-long-and-random
JWT_EXPIRE=30d
SESSION_SECRET=session-secret-change-this-too

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email (SendGrid)
SENDGRID_API_KEY=SG.your-sendgrid-api-key
FROM_EMAIL=noreply@lumenquest.com
FROM_NAME=Lumen Quest

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Payments (Stripe)
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Setup MongoDB
- **Local MongoDB:** Install MongoDB locally or use Docker
- **MongoDB Atlas:** Create a free cluster at mongodb.com

### 4. Setup Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs

### 5. Setup SendGrid (Optional)
1. Create account at [SendGrid](https://sendgrid.com/)
2. Generate API key
3. Verify sender identity

### 6. Setup Twilio (Optional)
1. Create account at [Twilio](https://twilio.com/)
2. Get Account SID and Auth Token
3. Purchase phone number

### 7. Setup Stripe (Required for Subscriptions)
1. Create account at [Stripe](https://stripe.com/)
2. Get API keys from dashboard
3. Create products and prices for subscription plans
4. Setup webhook endpoints

### 8. Seed Database (Optional)
```bash
npm run seed
```

### 9. Start Development Server
```bash
npm run dev
```

## Production Considerations

### Security
- Use strong, unique secrets for JWT and sessions
- Enable HTTPS in production
- Set `NODE_ENV=production`
- Use environment-specific database URLs
- Enable CORS only for trusted domains

### Database
- Use MongoDB Atlas or managed MongoDB service
- Enable authentication and SSL
- Regular backups
- Connection pooling

### Monitoring
- Setup error tracking (Sentry)
- Application monitoring (New Relic, DataDog)
- Log aggregation (ELK stack, CloudWatch)

### Scaling
- Use Redis for session storage
- Implement caching strategies
- Load balancing
- CDN for static assets

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify token format

3. **OAuth Errors**
   - Check client ID and secret
   - Verify callback URLs
   - Ensure APIs are enabled

4. **Rate Limiting**
   - Adjust rate limit settings
   - Check IP whitelisting
   - Monitor request patterns

### Debug Mode
Set `LOG_LEVEL=debug` for detailed logging during development.

### Health Check
Visit `http://localhost:5000/api/health` to verify server status.
