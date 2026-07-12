import express from 'express';
import { handleAiChat, handleVisualSearch } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', handleAiChat);
router.post('/visual-search', handleVisualSearch);

export default router;
