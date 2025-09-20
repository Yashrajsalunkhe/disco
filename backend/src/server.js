#!/usr/bin/env node

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { registerUser } from './register.js';
import { checkDuplicate } from './search.js';
import { orderRazorpay } from './utils/razorpay.js';
import { verifyPayment } from './utils/payment-verification.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Discovery ADCET Backend Server is running!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.post('/api/register', checkDuplicate, verifyPayment, registerUser);
app.post('/api/order', orderRazorpay);
app.post('/api/payment-verification', verifyPayment);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
const server = app.listen(PORT, '127.0.0.1', () => {   
  console.log(`Discovery ADCET Backend Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}`);
  console.log(`Env loaded - RAZORPAY_KEY_ID: ${process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing'}`);
});

export default app;