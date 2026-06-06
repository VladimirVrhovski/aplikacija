const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const dataService = require('../services/dataService');

// GET /login -> Render login page
router.get('/login', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  return res.render('auth/login', { error: null, username: '' });
});

// POST /login -> Authenticate user, start session
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.render('auth/login', { error: 'Invalid username or password', username: username || '' });
  }

  try {
    const user = await dataService.getUserByUsername(username);
    if (!user) {
      return res.render('auth/login', { error: 'Invalid username or password', username });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Invalid username or password', username });
    }

    // Start session
    req.session.user = {
      id: user.id,
      username: user.username
    };

    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Error in login POST:', error);
    return res.render('auth/login', { error: 'An unexpected error occurred. Please try again.', username });
  }
});

// GET /register -> Render registration page
router.get('/register', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  return res.render('auth/register', { error: null, username: '' });
});

// POST /register -> Validate and create user
router.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  const prunedUsername = (username || '').trim();

  // Basic validation rules
  if (!prunedUsername || prunedUsername.length < 3 || prunedUsername.length > 20) {
    return res.render('auth/register', { 
      error: 'Username must be between 3 and 20 characters long.', 
      username: prunedUsername 
    });
  }

  if (!password || password.length < 6) {
    return res.render('auth/register', { 
      error: 'Password must be at least 6 characters long.', 
      username: prunedUsername 
    });
  }

  if (password !== confirmPassword) {
    return res.render('auth/register', { 
      error: 'Passwords do not match.', 
      username: prunedUsername 
    });
  }

  try {
    // Check uniqueness (case-insensitive)
    const existingUser = await dataService.getUserByUsername(prunedUsername);
    if (existingUser) {
      return res.render('auth/register', { 
        error: 'Username is already taken.', 
        username: prunedUsername 
      });
    }

    // Hash password and store user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: crypto.randomUUID(),
      username: prunedUsername,
      password: hashedPassword,
      exams: []
    };

    await dataService.addUser(newUser);

    // Redirect to login page on success
    return res.redirect('/login');
  } catch (error) {
    console.error('Error in registration POST:', error);
    return res.render('auth/register', { 
      error: 'An unexpected error occurred. Please try again.', 
      username: prunedUsername 
    });
  }
});

// POST /logout -> Destroy session, redirect to /login
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      return res.redirect('/login');
    });
  } else {
    return res.redirect('/login');
  }
});

module.exports = router;
