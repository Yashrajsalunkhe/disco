# Discovery ADCET 2025 - Backend Integration

This implementation adds the same registration functionality as the NeuroVerse website, including:
- **Email notifications** using Nodemailer with Gmail SMTP
- **MongoDB database** for storing registration data
- **Razorpay payment gateway** for handling registration fees
- **Duplicate registration prevention**
- **Payment verification** and security

## Setup Instructions

### 1. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the required values in `.env`:

#### MongoDB Setup
- Install MongoDB locally or use MongoDB Atlas
- Update `MONGO_URI` with your connection string

#### Email Configuration (Gmail)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account > Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
3. Update `EMAIL_USER` with your Gmail address
4. Update `EMAIL_PASS` with the 16-character app password (not your regular password)

#### Razorpay Setup
1. Create account at https://razorpay.com/
2. Go to Dashboard > API Keys
3. Generate Test/Live API keys
4. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
5. Update `VITE_RAZORPAY_KEY_ID` with the same key ID (for frontend)

### 2. Backend Setup

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Build TypeScript:
   ```bash
   npm run build
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run on http://localhost:3000

### 3. Frontend Setup

The frontend is already configured to proxy API requests to the backend.

1. Start the frontend development server:
   ```bash
   npm run dev
   ```

   The frontend will run on http://localhost:8080

### 4. Testing the Integration

1. Start both backend and frontend servers
2. Navigate to the registration form
3. Fill out the form completely
4. Click "Submit Registration" 
5. Complete the Razorpay payment flow
6. Check your email for the confirmation

## API Endpoints

- `POST /api/order` - Create Razorpay payment order
- `POST /api/register` - Register user after payment verification
- `POST /api/payment-verification` - Verify payment signature

## Database Schema

The MongoDB collection `registrations` stores:
- Leader details (name, email, mobile, college, etc.)
- Event information
- Team members (if applicable)
- Payment details (order ID, payment ID, signature)
- Registration timestamp

## Email Features

- Welcome email with registration details
- Professional HTML template
- Registration ID for tracking
- Event information and contact details

## Security Features

- Payment signature verification
- Duplicate registration prevention
- Input validation and sanitization
- MongoDB injection protection

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use live Razorpay keys instead of test keys
3. Configure proper CORS origins
4. Set up SSL certificates
5. Use a production MongoDB database
6. Configure email settings for production

## Troubleshooting

### Common Issues:

1. **Email not sending**: Check Gmail app password and 2FA settings
2. **Payment failing**: Verify Razorpay keys and test mode
3. **Database connection**: Check MongoDB URI and network connectivity
4. **CORS errors**: Ensure backend server is running on port 3000

### Logs:
- Backend logs appear in the terminal where you ran `npm run dev`
- Check browser console for frontend errors
- MongoDB connection status is logged on backend startup