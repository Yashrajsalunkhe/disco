import { RequestHandler } from "express"
import crypto from "crypto"

export const verifyPayment: RequestHandler = async (req, res, next) => {
    const razorpay_order_id = req.body.razorpay_order_id || req.body.orderId;
    const razorpay_payment_id = req.body.razorpay_payment_id || req.body.paymentId;
    const razorpay_signature = req.body.razorpay_signature || req.body.signature;

    // Check if all payment details are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ 
            success: false, 
            error: 'Payment verification failed: Missing payment details. Registration requires completed payment.' 
        });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
        return res.status(500).json({ 
            success: false, 
            error: 'Payment configuration error. Please contact support.' 
        });
    }

    try {
        const digest = crypto.createHmac('sha256', secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
            
        if (digest === razorpay_signature) {
            console.log('Payment verification successful for order:', razorpay_order_id);
            next();
        } else {
            console.error('Payment verification failed for order:', razorpay_order_id);
            return res.status(400).json({ 
                success: false, 
                error: 'Payment verification failed: Invalid payment signature. Registration cannot proceed without valid payment.' 
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Payment verification error. Please try again or contact support.' 
        });
    }
};