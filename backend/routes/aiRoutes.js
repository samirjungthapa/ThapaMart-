import express from 'express';
import { handleAiChat, handleVisualSearch } from '../controllers/aiController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/chat', rateLimiter(10, 60000), handleAiChat);
router.post('/visual-search', rateLimiter(10, 60000), handleVisualSearch);

export default router;
