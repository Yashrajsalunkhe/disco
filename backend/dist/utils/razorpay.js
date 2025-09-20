"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRazorpay = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const orderRazorpay = async (req, res, next) => {
    // Validate Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error('Razorpay credentials missing');
        return res.status(500).json({
            success: false,
            error: 'Payment service configuration error'
        });
    }
    const razorpay = new razorpay_1.default({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    try {
        const { amount, currency, receipt } = req.body;
        // Validate required fields
        if (!amount || !currency || !receipt) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: amount, currency, receipt'
            });
        }
        // Validate amount
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid amount. Must be a positive number'
            });
        }
        const options = {
            amount: amount,
            currency: currency,
            receipt: receipt,
            payment_capture: 1 // Auto capture
        };
        console.log('Creating Razorpay order with options:', { ...options, amount: `${amount / 100} ${currency}` });
        const order = await razorpay.orders.create(options);
        if (!order) {
            console.error('No order returned from Razorpay');
            return res.status(500).json({
                success: false,
                error: 'Failed to create order'
            });
        }
        console.log('Order created successfully:', order.id);
        res.status(200).json({ success: true, order });
    }
    catch (error) {
        console.error('Razorpay order creation error:', {
            message: error.message,
            statusCode: error.statusCode,
            description: error.description,
            source: error.source,
            step: error.step,
            reason: error.reason
        });
        res.status(500).json({
            success: false,
            error: error.description || error.message || 'Failed to create order'
        });
    }
};
exports.orderRazorpay = orderRazorpay;
//# sourceMappingURL=razorpay.js.map