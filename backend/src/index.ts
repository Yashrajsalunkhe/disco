import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { registerUser } from './register';
import { checkDuplicate } from './search';
import { orderRazorpay } from './utils/razorpay';
import { verifyPayment } from './utils/payment-verification';
import { 
  adminLogin, 
  authenticateAdmin, 
  getAllRegistrations, 
  exportRegistrationsExcel, 
  getRegistrationStats 
} from './utils/admin';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? ['https://yourdomain.com'] // Replace with your production domain
//     : ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:3000'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(cors())
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Serve static files from public directory (frontend build)
app.use(express.static(path.join(__dirname, '../public')));

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

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {   
  console.log(`Discovery ADCET Backend Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}`);
});

export default app;