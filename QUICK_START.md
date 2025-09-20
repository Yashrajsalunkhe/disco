# Quick Start Guide

## Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud)
- Gmail account with App Password
- Razorpay account (test mode)

## 1. Setup Environment Variables

1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your credentials:
   ```bash
   # Example values (replace with actual)
   MONGO_URI=mongodb://localhost:27017/discovery_adcet
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
   ```

## 2. Install Dependencies

Install both frontend and backend dependencies:
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend && npm install && cd ..
```

## 3. Start Development Servers

Option A - Start both servers together:
```bash
npm run dev:all
```

Option B - Start servers separately:
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev
```

## 4. Test the Application

1. Open http://localhost:8080 in your browser
2. Navigate to the registration form
3. Fill out all required fields
4. Submit the form
5. Complete the Razorpay payment (use test card: 4111 1111 1111 1111)
6. Check your email for confirmation

## 5. Test Credentials

For testing Razorpay payments, use these test card details:
- **Card Number:** 4111 1111 1111 1111
- **Expiry:** Any future date
- **CVV:** Any 3 digits
- **Name:** Any name

## Troubleshooting

### Backend won't start:
- Check if MongoDB is running
- Verify environment variables in `.env`
- Check port 3000 is not in use

### Payment fails:
- Verify Razorpay keys are correct
- Check if using test mode keys
- Ensure VITE_RAZORPAY_KEY_ID matches RAZORPAY_KEY_ID

### Email not sending:
- Verify Gmail App Password (not regular password)
- Check 2FA is enabled on Gmail
- Verify EMAIL_USER and EMAIL_PASS in `.env`

### CORS errors:
- Ensure backend is running on port 3000
- Check vite.config.ts proxy settings