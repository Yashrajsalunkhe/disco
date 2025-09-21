import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { registerUser } from './register.js';
import { checkDuplicate } from './search.js';
import { orderRazorpay } from './utils/razorpay.js';
import { verifyPayment } from './utils/payment-verification.js';
import { 
  adminLogin, 
  authenticateAdmin, 
  getAllRegistrations, 
  exportRegistrationsExcel, 
  getRegistrationStats 
} from './utils/admin.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware
// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "https://discovery.adcet.ac.in/"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

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
app.post('/api/register', checkDuplicate, verifyPayment, registerUser);
app.post('/api/order', orderRazorpay);
app.post('/api/payment-verification', verifyPayment);

// Admin Routes
app.post('/api/admin/login', adminLogin);
app.get('/api/admin/registrations', authenticateAdmin, getAllRegistrations);
app.get('/api/admin/export', authenticateAdmin, exportRegistrationsExcel);
app.get('/api/admin/stats', authenticateAdmin, getRegistrationStats);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {   
    console.log(`Discovery ADCET Backend Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}`);
  });
}

export default app;
