#!/usr/bin/env node

import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve('../.env') });

// Test 1: Order Creation
console.log('🧪 Testing Razorpay Order Creation...');

try {
    const response = await fetch('http://localhost:3000/api/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: 50000,
            currency: 'INR',
            receipt: 'test_receipt_' + Date.now()
        })
    });

    const result = await response.json();
    console.log('Order Creation Result:', result);

    if (result.success && result.order) {
        console.log('✅ Order creation successful!');
        
        // Test 2: Registration with mock payment
        console.log('\n🧪 Testing Registration with Mock Payment...');
        
        const registrationData = {
            leaderName: 'Test User',
            leaderEmail: 'test@example.com',
            leaderMobile: '9876543210',
            leaderCollege: 'Test College',
            leaderDepartment: 'Computer Science',
            leaderYear: '3rd Year',
            leaderCity: 'Mumbai',
            selectedEvent: 'ADCET Tech Fest',
            participationType: 'solo',
            teamSize: 1,
            teamMembers: [],
            paymentId: 'pay_test_' + Date.now(),
            orderId: result.order.id,
            signature: 'test_signature_' + Date.now(),
            totalFee: 500
        };

        const registerResponse = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData)
        });

        const registerResult = await registerResponse.json();
        console.log('Registration Result:', registerResult);
        
        if (registerResult.success) {
            console.log('✅ Registration successful!');
        } else {
            console.log('❌ Registration failed:', registerResult.error);
        }
    } else {
        console.log('❌ Order creation failed:', result.error);
    }
} catch (error) {
    console.error('❌ Test failed with error:', error.message);
}

console.log('\n🏁 Test completed');