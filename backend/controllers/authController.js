import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { readDb, writeDb } from '../utils/jsonDb.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'thapamart_secret_key_123456', {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (process.env.MONGODB_URI) {
    try {
      const user = await User.findOne({ email });
      if (user && (await user.comparePassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token: generateToken(user._id.toString()),
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user && bcrypt.compareSync(password, user.password)) {
    return res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user.id),
    });
  }

  res.status(401).json({ message: 'Invalid email or password' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (process.env.MONGODB_URI) {
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: email.includes('admin') ? 'admin' : 'customer' // Auto admin if email contains admin for easy testing
      });

      if (user) {
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token: generateToken(user._id.toString()),
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const userExists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password: hashedPassword,
    role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  };

  db.users.push(newUser);
  writeDb(db);

  res.status(201).json({
    _id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    avatar: newUser.avatar,
    token: generateToken(newUser.id),
  });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  // req.user is already populated by protect middleware
  if (req.user) {
    res.json({
      _id: req.user._id || req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
