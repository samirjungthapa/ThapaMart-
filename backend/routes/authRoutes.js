import express from 'express';
import { loginUser, registerUser, getUserProfile, updateUserRole } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', rateLimiter(15, 60000), loginUser);
router.post('/register', rateLimiter(10, 60000), registerUser);
router.get('/profile', protect, getUserProfile);
router.put('/users/:id/role', protect, admin, updateUserRole);

export default router;
