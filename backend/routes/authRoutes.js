import express from 'express';
import { loginUser, registerUser, getUserProfile, updateUserRole } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/profile', protect, getUserProfile);
router.put('/users/:id/role', protect, admin, updateUserRole);

export default router;
