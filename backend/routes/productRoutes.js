import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  deleteProductReview,
  upvoteProductReview
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/broadcast', protect, admin, (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });
  const broadcast = req.app.get('broadcastEvent');
  if (broadcast) {
    broadcast('PROMO_BROADCAST', { message });
    return res.json({ success: true, message: 'Broadcast sent successfully' });
  }
  return res.status(500).json({ message: 'Broadcast channel unavailable' });
});

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews')
  .post(protect, createProductReview);

router.route('/:id/reviews/:reviewId')
  .delete(protect, admin, deleteProductReview);

router.route('/:id/reviews/:reviewId/upvote')
  .post(protect, upvoteProductReview);

export default router;
