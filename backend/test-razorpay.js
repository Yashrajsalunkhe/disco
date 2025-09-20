#!/usr/bin/env node

import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env from parent directory
dotenv.config({ path: resolve('../.env') });

console.log('Testing Razorpay credentials...');
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '***hidden***' : 'undefined');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function testOrderCreation() {
    try {
        const options = {
            amount: 50000, // ₹500
            currency: 'INR',
            receipt: 'test_receipt_123'
        };

        console.log('Creating order with options:', options);
        const order = await razorpay.orders.create(options);
        console.log('Order created successfully:', order);
        return order;
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
}

testOrderCreation().then(() => {
    console.log('Test completed');
    process.exit(0);
});