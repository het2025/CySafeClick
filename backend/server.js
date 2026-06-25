require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { getDbStatus } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const dbCheck = require('./middleware/dbCheck');

// ─── Route Imports ───────────────────────────────────────
const tickerRoutes     = require('./routes/ticker.routes');
const alertsRoutes     = require('./routes/alerts.routes');
const numbersRoutes    = require('./routes/numbers.routes');
const reportsRoutes    = require('./routes/reports.routes');
const threatsRoutes    = require('./routes/threats.routes');
const mapRoutes        = require('./routes/map.routes');
const tipsRoutes       = require('./routes/tips.routes');
const storiesRoutes    = require('./routes/stories.routes');
const glossaryRoutes   = require('./routes/glossary.routes');
const quizRoutes       = require('./routes/quiz.routes');
const playbooksRoutes  = require('./routes/playbooks.routes');
const platformsRoutes  = require('./routes/platforms.routes');
const statsRoutes      = require('./routes/stats.routes');
const communityRoutes  = require('./routes/community.routes');
const newsRoutes       = require('./routes/news.routes');
const aiRoutes         = require('./routes/ai.routes');

// ─── Initialize App ──────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// ─── Connect to MongoDB ─────────────────────────────────
connectDB();

// ─── Global Middleware ───────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(morgan('dev'));
app.use(generalLimiter);

// ─── Health Check (no dbCheck — always accessible) ───────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SafeClick Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    dbStatus: getDbStatus()
  });
});

// ─── API Routes (protected by dbCheck) ───────────────────
app.use('/api/ticker',     dbCheck, tickerRoutes);
app.use('/api/alerts',     dbCheck, alertsRoutes);
app.use('/api/numbers',    dbCheck, numbersRoutes);
app.use('/api/reports',    dbCheck, reportsRoutes);
app.use('/api/threats',    dbCheck, threatsRoutes);
app.use('/api/map',        dbCheck, mapRoutes);
app.use('/api/tips',       dbCheck, tipsRoutes);
app.use('/api/stories',    dbCheck, storiesRoutes);
app.use('/api/glossary',   dbCheck, glossaryRoutes);
app.use('/api/quiz',       dbCheck, quizRoutes);
app.use('/api/playbooks',  dbCheck, playbooksRoutes);
app.use('/api/platforms',  dbCheck, platformsRoutes);
app.use('/api/stats',      dbCheck, statsRoutes);
app.use('/api/community',  dbCheck, communityRoutes);
app.use('/api/news',       dbCheck, newsRoutes);

// ─── AI Routes (No dbCheck — stateless, no DB needed) ────────────────────
app.use('/api/ai',         aiRoutes);

// ─── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// ─── Global Error Handler ────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🛡️  SafeClick Backend Server`);
  console.log(`   Port:        ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV}`);
  console.log(`   Frontend:    ${process.env.FRONTEND_URL}`);
  console.log(`   Health:      http://localhost:${PORT}/api/health\n`);
});
