"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const register_1 = require("./register");
const search_1 = require("./search");
const razorpay_1 = require("./utils/razorpay");
const payment_verification_1 = require("./utils/payment-verification");
const admin_1 = require("./utils/admin");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com'] // Replace with your production domain
        : ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: false, limit: '10mb' }));
// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Health check route
app.get('/', (req, res) => {
    res.send('Discovery ADCET Backend Server is running!');
});
// API Routes
app.post('/api/register', search_1.checkDuplicate, payment_verification_1.verifyPayment, register_1.registerUser);
app.post('/api/order', razorpay_1.orderRazorpay);
app.post('/api/payment-verification', payment_verification_1.verifyPayment);
// Admin Routes
app.post('/api/admin/login', admin_1.adminLogin);
app.get('/api/admin/registrations', admin_1.authenticateAdmin, admin_1.getAllRegistrations);
app.get('/api/admin/export', admin_1.authenticateAdmin, admin_1.exportRegistrationsExcel);
app.get('/api/admin/stats', admin_1.authenticateAdmin, admin_1.getRegistrationStats);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});
// Start server
app.listen(PORT, () => {
    console.log(`Discovery ADCET Backend Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map