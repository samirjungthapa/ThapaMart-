import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend connection
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

import { protect, admin } from './middleware/authMiddleware.js';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/diagnostics', protect, admin, (req, res) => {
  res.json({
    status: 'Healthy',
    databaseMode: process.env.MONGODB_URI ? 'MongoDB Connected' : 'High-Performance JSON Fallback Mode',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    platform: process.platform,
    nodeVersion: process.version,
    env: {
      port: process.env.PORT || 5000,
      cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Missing',
      stripeKey: process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Missing'
    }
  });
});

// Base route
app.get('/', (req, res) => {
  res.send('🚀 ThapaMart API is running smoothly...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

// Connect to Database then start Express server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 ThapaMart Premium Backend listening on port ${PORT}`);
  });
});
