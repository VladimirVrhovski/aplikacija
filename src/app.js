const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Parsing middle-wares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session management
const sessionSecret = process.env.SESSION_SECRET || 'student-grade-tracker-session-secret-key-2026';
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: false // Set to true if running over HTTPS in prod, false for standard HTTP dev
  }
}));

// Setup views and static files
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));

// Root route: Redirects appropriately based on active session
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  return res.redirect('/login');
});

// GET /health -> Integration check endpoint
app.get('/health', (req, res) => {
  return res.status(200).json({ status: 'ok' });
});

// Import Routes
const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exams');

// Mount routes
app.use('/', authRoutes);
app.use('/', examRoutes);

// Export app for test runs with supertest
module.exports = app;

// Conditionally start listening if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  
  // Database self-check before listening
  const pool = require('./db');
  pool.query('SELECT 1')
    .then(() => {
      console.log('Database self-check succeeded. Connected to MySQL.');
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Student Grade Tracker app listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Database self-check failed on startup:', err);
      
      // In the AI Studio development/preview environment, we want to bypass the process.exit(1)
      // crash so that the user and developers can view the fully styled application pages and layouts.
      const isLocalPreview = process.env.DISABLE_HMR === 'true' || !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';
      if (isLocalPreview) {
        console.warn('Bypassing production process.exit(1) because we are in the local/preview workspace.');
        app.listen(PORT, '0.0.0.0', () => {
          console.log(`Student Grade Tracker app listening on port ${PORT} (Database Offline)`);
        });
      } else {
        process.exit(1);
      }
    });
}
