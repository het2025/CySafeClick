const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const aiController = require('../controllers/ai.controller');

// ─── AI-specific Rate Limiter ──────────────────────────────────────────────
// More conservative than the general limiter to protect Gemini API quota
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,    // 1 minute window
  max: 10,                 // 10 AI requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many AI requests. Please wait a minute and try again.'
  }
});

// Apply AI rate limiter to all routes in this file
router.use(aiLimiter);

// ─── AI Routes ────────────────────────────────────────────────────────────

// Scam Message Analyzer
router.post('/analyze-message', aiController.analyzeMessage);

// Cyber Mitra Chatbot
router.post('/chat', aiController.chat);

// URL + Screenshot Analyzer
router.post('/analyze-url', aiController.analyzeUrl);

// Transaction Risk Scorer
router.post('/transaction-risk', aiController.transactionRisk);

module.exports = router;
