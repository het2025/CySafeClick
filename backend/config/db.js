const mongoose = require('mongoose');

let dbStatus = 'disconnected';

// ─── Connection Event Listeners ─────────────────────────
mongoose.connection.on('connected', () => {
  dbStatus = 'connected';
  console.log('✅ MongoDB Connected');
});

mongoose.connection.on('disconnected', () => {
  dbStatus = 'disconnected';
  console.warn('⚠️  MongoDB Disconnected');

  // Auto-reconnect after 5 seconds
  setTimeout(() => {
    console.log('🔄 Attempting MongoDB reconnection...');
    connectDB();
  }, 5000);
});

mongoose.connection.on('error', (err) => {
  dbStatus = 'disconnected';
  console.error(`❌ MongoDB Connection Error: ${err.message}`);
});

mongoose.connection.on('reconnected', () => {
  dbStatus = 'connected';
  console.log('✅ MongoDB Reconnected');
});

// ─── Connect Function ───────────────────────────────────
const connectDB = async () => {
  dbStatus = 'connecting';
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // 'connected' event handler will update dbStatus
  } catch (error) {
    dbStatus = 'disconnected';
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do NOT exit — let the disconnect handler attempt reconnection
  }
};

// ─── Status Getter ──────────────────────────────────────
const getDbStatus = () => dbStatus;

module.exports = connectDB;
module.exports.getDbStatus = getDbStatus;
