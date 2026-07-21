import express from 'express';
import { handleAiChat, handleVisualSearch, handleSuggestMetadata } from '../controllers/aiController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/chat', rateLimiter(10, 60000), handleAiChat);
router.post('/visual-search', upload.single('image'), rateLimiter(10, 60000), handleVisualSearch);
router.post('/suggest-metadata', rateLimiter(10, 60000), handleSuggestMetadata);

export default router;
