const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const requireAuth = require('../middleware/requireAuth');
const dataService = require('../services/dataService');
const { calcGPA, calcTotalECTS } = require('../utils/calculations');

// Protect all routes within this file
router.use(requireAuth);

// GET /dashboard -> Render student dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await dataService.getUserById(userId);
    
    if (!user) {
      // Session user doesn't exist in data store, kick to logout
      return res.redirect('/login');
    }

    const exams = user.exams || [];
    const totalECTS = calcTotalECTS(exams);
    const rawGPA = calcGPA(exams);
    const gpa = rawGPA !== null ? rawGPA.toFixed(2) : 'N/A';

    return res.render('dashboard', {
      user: {
        username: user.username
      },
      exams,
      stats: {
        count: exams.length,
        totalECTS,
        gpa
      },
      error: null,
      // Store previously entered fields to avoid losing input on validation error
      formData: {
        subject: '',
        grade: '',
        ects: ''
      }
    });
  } catch (err) {
    console.error('Error on /dashboard:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// POST /exams -> Add new exam
router.post('/exams', async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await dataService.getUserById(userId);

    if (!user) {
      return res.redirect('/login');
    }

    const exams = user.exams || [];
    const { subject, grade, ects } = req.body;

    const subjectTrimmed = (subject || '').trim();
    const gradeInt = parseInt(grade, 10);
    const ectsInt = parseInt(ects, 10);

    // Validation
    let validationError = null;

    if (!subjectTrimmed || subjectTrimmed.length > 100) {
      validationError = 'Subject name is required and must be under 100 characters.';
    } else if (isNaN(gradeInt) || gradeInt < 6 || gradeInt > 10) {
      validationError = 'Grade must be an integer between 6 and 10 inclusive.';
    } else if (isNaN(ectsInt) || ectsInt < 1 || ectsInt > 30) {
      validationError = 'ECTS credits must be an integer between 1 and 30 inclusive.';
    }

    if (validationError) {
      // If validation fails, we render the page again with an error message and input cache
      const totalECTS = calcTotalECTS(exams);
      const rawGPA = calcGPA(exams);
      const gpa = rawGPA !== null ? rawGPA.toFixed(2) : 'N/A';

      return res.render('dashboard', {
        user: {
          username: user.username
        },
        exams,
        stats: {
          count: exams.length,
          totalECTS,
          gpa
        },
        error: validationError,
        formData: {
          subject: subjectTrimmed,
          grade: grade || '',
          ects: ects || ''
        }
      });
    }

    // Create and add the exam
    const newExam = {
      id: crypto.randomUUID(),
      subject: subjectTrimmed,
      grade: gradeInt,
      ects: ectsInt,
      addedAt: new Date().toISOString()
    };

    user.exams = user.exams || [];
    user.exams.push(newExam);
    await dataService.updateUser(user);

    // Successfully added, redirect to dashboard to clear POST resubmission
    return res.redirect('/dashboard');
  } catch (err) {
    console.error('Error on POST /exams:', err);
    return res.status(500).send('Internal Server Error');
  }
});

// POST /exams/:id/delete -> Delete exam by ID (simulated delete via standard POST)
router.post('/exams/:id/delete', async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await dataService.getUserById(userId);

    if (!user) {
      return res.redirect('/login');
    }

    const examId = req.params.id;
    user.exams = (user.exams || []).filter(exam => exam.id !== examId);
    await dataService.updateUser(user);

    return res.redirect('/dashboard');
  } catch (err) {
    console.error('Error on DELETE exam:', err);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
