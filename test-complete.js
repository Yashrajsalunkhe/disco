#!/usr/bin/env node

console.log('🚀 Starting End-to-End Registration Test...\n');

// Test 1: Health Check
async function testHealthCheck() {
    console.log('1️⃣ Testing Backend Health...');
    try {
        const response = await fetch('http://localhost:3000/');
        const text = await response.text();
        console.log('✅ Backend is running:', text);
        return true;
    } catch (error) {
        console.log('❌ Backend health check failed:', error.message);
        return false;
    }
}

// Test 2: Order Creation
async function testOrderCreation() {
    console.log('\n2️⃣ Testing Order Creation...');
    try {
        const orderData = {
            amount: 50000, // ₹500
            currency: 'INR',
            receipt: 'test_receipt_' + Date.now()
        };

        const response = await fetch('http://localhost:3000/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        
        if (result.success && result.order) {
            console.log('✅ Order created successfully!');
            console.log('   Order ID:', result.order.id);
            console.log('   Amount:', result.order.amount);
            console.log('   Status:', result.order.status);
            return result.order;
        } else {
            console.log('❌ Order creation failed:', result.error || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.log('❌ Order creation error:', error.message);
        return null;
    }
}

// Test 3: Registration
async function testRegistration(order) {
    console.log('\n3️⃣ Testing Registration...');
    
    if (!order) {
        console.log('❌ Cannot test registration without valid order');
        return false;
    }

    try {
        const registrationData = {
            leaderName: 'John Doe',
            leaderEmail: 'john.doe.test@example.com',
            leaderMobile: '9876543210',
            leaderCollege: 'ADCET Institute',
            leaderDepartment: 'Computer Science',
            leaderYear: '3rd Year',
            leaderCity: 'Mumbai',
            selectedEvent: 'TechFest 2025',
            participationType: 'solo',
            teamSize: 1,
            teamMembers: [],
            paymentId: 'pay_test_' + Date.now(),
            orderId: order.id,
            signature: 'test_signature_' + Date.now(),
            totalFee: 500
        };

        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData)
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Registration successful!');
            console.log('   Message:', result.message);
            return true;
        } else {
            console.log('❌ Registration failed:', result.error);
            return false;
        }
    } catch (error) {
        console.log('❌ Registration error:', error.message);
        return false;
    }
}

// Test 4: Database Check
async function testDatabaseCheck() {
    console.log('\n4️⃣ Checking Database...');
    try {
        // We'll use Node.js to execute mongosh command
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);
        
        const { stdout } = await execAsync('mongosh --quiet --eval "db.getSiblingDB(\'discovery_adcet\').registrations.countDocuments()"');
        const count = parseInt(stdout.trim());
        
        console.log('✅ Database check complete');
        console.log('   Registrations count:', count);
        return count;
    } catch (error) {
        console.log('❌ Database check failed:', error.message);
        return -1;
    }
}

// Run all tests
async function runTests() {
    const healthOk = await testHealthCheck();
    if (!healthOk) {
        console.log('\n❌ Cannot proceed without healthy backend');
        process.exit(1);
    }

    const order = await testOrderCreation();
    const registrationOk = await testRegistration(order);
    const dbCount = await testDatabaseCheck();

    console.log('\n📊 Test Summary:');
    console.log('─'.repeat(40));
    console.log('Backend Health:', healthOk ? '✅ PASS' : '❌ FAIL');
    console.log('Order Creation:', order ? '✅ PASS' : '❌ FAIL');
    console.log('Registration:', registrationOk ? '✅ PASS' : '❌ FAIL');
    console.log('Database Check:', dbCount >= 0 ? `✅ PASS (${dbCount} records)` : '❌ FAIL');
    
    if (healthOk && order && registrationOk && dbCount >= 0) {
        console.log('\n🎉 All tests passed! Backend is fully functional.');
        console.log('\n💡 Next steps:');
        console.log('   • Configure real Gmail credentials for email');
        console.log('   • Test with Razorpay test card numbers');
        console.log('   • Deploy to production environment');
    } else {
        console.log('\n⚠️  Some tests failed. Check the logs above.');
    }
}

runTests().catch(console.error);