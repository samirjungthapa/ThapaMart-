import express from 'express';
import { processPayment, sendStripeApiKey, stripeWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/process').post(protect, processPayment);
router.route('/stripeapi').get(protect, sendStripeApiKey);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
