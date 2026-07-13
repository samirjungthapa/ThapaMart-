import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { handleSockets } from './utils/socketHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import couponRoutes from './routes/couponRoutes.js';

dotenv.config();

const app = express();


// Middlewares
app.use(cors({
  origin: '*', // Allow frontend connection
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Native Security Headers Middleware (Helmet Alternative)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self' *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com *; font-src 'self' data: https://fonts.gstatic.com *; img-src 'self' data: https: *; connect-src 'self' https: *;");
  next();
});

import { protect, admin } from './middleware/authMiddleware.js';

// API Routes
let sseClients = [];
app.get('/api/live-updates', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.push(res);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c !== res);
  });
});

app.set('broadcastEvent', (type, data) => {
  sseClients.forEach(client => {
    client.write(`data: ${JSON.stringify({ type, data })}\n\n`);
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/coupons', couponRoutes);

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

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

handleSockets(io);

app.set('socketio', io);

// Connect to Database then start Express server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 ThapaMart Premium Backend listening on port ${PORT}`);
  });
});
