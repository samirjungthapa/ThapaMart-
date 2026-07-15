import express from 'express';
import { loginUser, registerUser, verifyOtp, getUserProfile, updateUserRole, getUserCart, saveUserCart, refreshAccessToken, logoutUser, getUsers } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';

import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', rateLimiter(15, 60000), validateLogin, loginUser);
router.post('/register', rateLimiter(10, 60000), validateRegister, registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/role', protect, admin, updateUserRole);

router.route('/cart')
  .get(protect, getUserCart)
  .put(protect, saveUserCart);

export default router;
