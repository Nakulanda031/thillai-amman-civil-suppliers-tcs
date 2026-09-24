require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const path = require('path');

const leadRoutes = require('./routes/leads');

const app = express();

// --- Security / CORS ---
const allowedOrigins = process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : '*';
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rate Limiting for Public Form Endpoints ---
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 submissions per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many enquiry requests from this IP. Please call our office directly at 73393 01146.' }
});

app.use('/api/quote', formLimiter);
app.use('/api/booking', formLimiter);
app.use('/api/contact', formLimiter);

// --- Static Uploads (For Admin plan viewing) ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Routes ---
app.use('/api', leadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Thillai Amman Civil Suppliers API',
    time: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// --- MongoDB Connection ---
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tcs_civil_suppliers';
mongoose
  .connect(mongoUri)
  .then(() => console.log('[TCS DB] Connected to MongoDB successfully'))
  .catch((err) => console.warn('[TCS DB Warning] MongoDB not connected:', err.message, '— Leads will be handled in memory/fallback if DB is offline.'));

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected error occurred.'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[TCS Server] Running on http://localhost:${PORT}`);
});
