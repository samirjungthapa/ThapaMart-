import express from 'express';
import { processPayment, sendStripeApiKey } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/process').post(protect, processPayment);
router.route('/stripeapi').get(protect, sendStripeApiKey);

export default router;
