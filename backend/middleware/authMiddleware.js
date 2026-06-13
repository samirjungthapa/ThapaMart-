import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { readDb } from '../utils/jsonDb.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'thapamart_secret_key_123456');

      if (process.env.MONGODB_URI) {
        try {
          req.user = await User.findById(decoded.id).select('-password');
        } catch (dbErr) {
          // Fallback to JSON check
          const db = readDb();
          req.user = db.users.find(u => u.id === decoded.id);
        }
      } else {
        const db = readDb();
        req.user = db.users.find(u => u.id === decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
