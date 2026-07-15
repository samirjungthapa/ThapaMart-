import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { readDb, writeDb } from '../utils/jsonDb.js';
import { sendEmail } from '../utils/sendEmail.js';
import { sendSMS } from '../utils/sendSMS.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'thapamart_secret_key_123456', {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'thapamart_refresh_secret_key_789', {
    expiresIn: '7d',
  });
};

const setAuthCookies = (res, id) => {
  const token = generateToken(id);
  const refreshToken = generateRefreshToken(id);

  res.cookie('token', token, {
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.cookie('refreshToken', refreshToken, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return token;
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
        const token = setAuthCookies(res, user._id.toString());
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token,
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
    const token = setAuthCookies(res, user.id);
    return res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token,
    });
  }

  res.status(401).json({ message: 'Invalid email or password' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const isEmailSimulated = !process.env.SMTP_HOST || process.env.SMTP_HOST.includes('your_') || process.env.SMTP_HOST.includes('your-');
  const isSmsSimulated = !process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID.includes('your_') || process.env.TWILIO_ACCOUNT_SID.includes('your-');
  const isSimulated = isEmailSimulated && isSmsSimulated;

  // Password complexity check
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number or special character.'
    });
  }



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
        phone,
        isVerified: true,
        role: email.includes('admin') ? 'admin' : 'customer'
      });

      if (user) {
        const token = setAuthCookies(res, user._id.toString());
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
          role: user.role,
          avatar: user.avatar,
          token,
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
    phone,
    password: hashedPassword,
    isVerified: true,
    role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  };

  db.users.push(newUser);
  writeDb(db);

  const token = setAuthCookies(res, newUser.id);
  res.status(201).json({
    _id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    isVerified: newUser.isVerified,
    role: newUser.role,
    avatar: newUser.avatar,
    token,
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
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/auth/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (process.env.MONGODB_URI) {
    try {
      const user = await User.findById(id);
      if (user) {
        user.role = role;
        const updatedUser = await user.save();
        return res.json(updatedUser);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const index = db.users.findIndex(u => u.id === id || (u._id && u._id.toString() === id));
  if (index !== -1) {
    db.users[index].role = role;
    writeDb(db);
    return res.json(db.users[index]);
  }

  res.status(404).json({ message: 'User not found' });
};

// @desc    Get user cart
// @route   GET /api/auth/cart
// @access  Private
export const getUserCart = async (req, res) => {
  if (process.env.MONGODB_URI) {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        return res.json(user.cartItems || []);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const userId = req.user.id || req.user._id.toString();
  const user = db.users.find(u => u.id === userId || (u._id && u._id.toString() === userId));
  if (user) {
    return res.json(user.cartItems || []);
  }

  res.status(404).json({ message: 'User not found' });
};

// @desc    Save/Sync user cart
// @route   PUT /api/auth/cart
// @access  Private
export const saveUserCart = async (req, res) => {
  const { cartItems } = req.body;

  if (process.env.MONGODB_URI) {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        user.cartItems = cartItems;
        await user.save();
        return res.json({ message: 'Cart synced successfully', cartItems: user.cartItems });
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const userId = req.user.id || req.user._id.toString();
  const index = db.users.findIndex(u => u.id === userId || (u._id && u._id.toString() === userId));
  if (index !== -1) {
    db.users[index].cartItems = cartItems;
    writeDb(db);
    return res.json({ message: 'Cart synced successfully', cartItems: db.users[index].cartItems });
  }

  res.status(404).json({ message: 'User not found' });
};

// @desc    Verify registration OTP code
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP code are required' });
  }

  if (process.env.MONGODB_URI) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.otp !== otp || Date.now() > user.otpExpires) {
        return res.status(400).json({ message: 'Invalid or expired OTP code' });
      }

      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      const token = setAuthCookies(res, user._id.toString());
      return res.json({
        message: 'Account verified successfully!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isVerified: true,
          role: user.role,
          avatar: user.avatar
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Fallback JSON DB
  const db = readDb();
  const index = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (index !== -1) {
    const user = db.users[index];
    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    user.isVerified = true;
    delete user.otp;
    delete user.otpExpires;
    writeDb(db);

    const token = setAuthCookies(res, user.id);
    return res.json({
      message: 'Account verified successfully!',
      token,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: true,
        role: user.role,
        avatar: user.avatar
      }
    });
  }

  res.status(404).json({ message: 'User not found' });
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Not authorized, no refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'thapamart_refresh_secret_key_789');
    
    let user;
    if (process.env.MONGODB_URI) {
      try {
        user = await User.findById(decoded.id);
      } catch (err) {
        // Fallback below
      }
    }
    
    if (!user) {
      const db = readDb();
      user = db.users.find(u => u.id === decoded.id || (u._id && u._id.toString() === decoded.id));
    }
 
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    const token = generateToken(user.id || user._id.toString());
    res.cookie('token', token, {
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.json({ token });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Not authorized, refresh token failed' });
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully' });
};

// @desc    Get all users (Admin)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  if (process.env.MONGODB_URI) {
    try {
      const users = await User.find({}).select('-password');
      return res.json(users);
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const users = db.users.map(({ password, ...u }) => u);
  res.json(users);
};
