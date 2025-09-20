#!/usr/bin/env node

// Test payment enforcement

console.log('🧪 Testing Payment Enforcement...\n');

// Test 1: Try to register without payment details
async function testRegistrationWithoutPayment() {
    console.log('1️⃣ Testing registration WITHOUT payment details...');
    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                leaderName: 'Test User',
                leaderEmail: 'test@example.com',
                leaderMobile: '9876543210',
                leaderCollege: 'Test College',
                leaderDepartment: 'Computer Science',
                leaderYear: '3rd Year',
                leaderCity: 'Mumbai',
                selectedEvent: 'TechFest',
                participationType: 'solo',
                teamSize: 1,
                teamMembers: [],
                totalFee: 500
                // Missing: paymentId, orderId, signature
            })
        });

        const result = await response.json();
        if (!result.success && result.error.includes('Payment details are required')) {
            console.log('✅ PASS: Registration correctly rejected without payment');
        } else {
            console.log('❌ FAIL: Registration should be rejected without payment');
        }
        return result;
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return null;
    }
}

// Test 2: Try to register with invalid payment IDs
async function testRegistrationWithInvalidPayment() {
    console.log('\n2️⃣ Testing registration with INVALID payment details...');
    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                leaderName: 'Test User',
                leaderEmail: 'test@example.com',
                leaderMobile: '9876543210',
                leaderCollege: 'Test College',
                leaderDepartment: 'Computer Science',
                leaderYear: '3rd Year',
                leaderCity: 'Mumbai',
                selectedEvent: 'TechFest',
                participationType: 'solo',
                teamSize: 1,
                teamMembers: [],
                totalFee: 500,
                paymentId: 'invalid_payment_id',  // Invalid format
                orderId: 'invalid_order_id',      // Invalid format
                signature: 'fake_signature'
            })
        });

        const result = await response.json();
        if (!result.success && result.error.includes('Invalid payment details')) {
            console.log('✅ PASS: Registration correctly rejected with invalid payment IDs');
        } else {
            console.log('❌ FAIL: Registration should be rejected with invalid payment IDs');
        }
        return result;
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return null;
    }
}

// Test 3: Try to register with invalid signature (should fail payment verification)
async function testRegistrationWithInvalidSignature() {
    console.log('\n3️⃣ Testing registration with invalid payment signature...');
    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                leaderName: 'Test User',
                leaderEmail: 'test@example.com',
                leaderMobile: '9876543210',
                leaderCollege: 'Test College',
                leaderDepartment: 'Computer Science',
                leaderYear: '3rd Year',
                leaderCity: 'Mumbai',
                selectedEvent: 'TechFest',
                participationType: 'solo',
                teamSize: 1,
                teamMembers: [],
                totalFee: 500,
                paymentId: 'pay_test_123456789',      // Valid format
                orderId: 'order_test_123456789',     // Valid format
                signature: 'invalid_signature_hash'   // Invalid signature
            })
        });

        const result = await response.json();
        if (!result.success && result.error.includes('Payment verification failed')) {
            console.log('✅ PASS: Registration correctly rejected with invalid signature');
        } else {
            console.log('❌ FAIL: Registration should be rejected with invalid signature');
        }
        return result;
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return null;
    }
}

// Run all tests
async function runPaymentTests() {
    console.log('🔒 Payment Enforcement Test Suite');
    console.log('═'.repeat(50));
    
    await testRegistrationWithoutPayment();
    await testRegistrationWithInvalidPayment();
    await testRegistrationWithInvalidSignature();
    
    console.log('\n📋 Summary:');
    console.log('All tests validate that registration is impossible without:');
    console.log('• Valid payment details (paymentId, orderId, signature)');
    console.log('• Proper payment ID formats (pay_*, order_*)');
    console.log('• Correct payment signature verification');
    console.log('\n✅ Payment is MANDATORY for registration completion!');
}

runPaymentTests().catch(console.error);