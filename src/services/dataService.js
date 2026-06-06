const pool = require('../db');

/**
 * Gets all users from the database.
 * @returns {Promise<Array>} Array of user objects.
 */
async function getAllUsers() {
  const [usersRows] = await pool.query('SELECT * FROM users');
  const allUsers = [];
  
  for (const userRow of usersRows) {
    const [examsRows] = await pool.query('SELECT * FROM exams WHERE user_id = ? ORDER BY added_at ASC', [userRow.id]);
    const exams = examsRows.map(row => ({
      id: row.id,
      subject: row.subject,
      grade: row.grade,
      ects: row.ects,
      addedAt: row.added_at instanceof Date ? row.added_at.toISOString() : row.added_at
    }));
    
    allUsers.push({
      id: userRow.id,
      username: userRow.username,
      password: userRow.password,
      exams
    });
  }
  
  return allUsers;
}

/**
 * Finds user by username (case-insensitive).
 * @param {string} username 
 * @returns {Promise<Object|null>}
 */
async function getUserByUsername(username) {
  const [usersRows] = await pool.query('SELECT * FROM users WHERE LOWER(username) = LOWER(?)', [username]);
  if (usersRows.length === 0) {
    return null;
  }
  
  const userRow = usersRows[0];
  const [examsRows] = await pool.query('SELECT * FROM exams WHERE user_id = ? ORDER BY added_at ASC', [userRow.id]);
  const exams = examsRows.map(row => ({
    id: row.id,
    subject: row.subject,
    grade: row.grade,
    ects: row.ects,
    addedAt: row.added_at instanceof Date ? row.added_at.toISOString() : row.added_at
  }));
  
  return {
    id: userRow.id,
    username: userRow.username,
    password: userRow.password,
    exams
  };
}

/**
 * Finds user by ID.
 * @param {string} id 
 * @returns {Promise<Object|null>}
 */
async function getUserById(id) {
  const [usersRows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  if (usersRows.length === 0) {
    return null;
  }
  
  const userRow = usersRows[0];
  const [examsRows] = await pool.query('SELECT * FROM exams WHERE user_id = ? ORDER BY added_at ASC', [userRow.id]);
  const exams = examsRows.map(row => ({
    id: row.id,
    subject: row.subject,
    grade: row.grade,
    ects: row.ects,
    addedAt: row.added_at instanceof Date ? row.added_at.toISOString() : row.added_at
  }));
  
  return {
    id: userRow.id,
    username: userRow.username,
    password: userRow.password,
    exams
  };
}

/**
 * Adds a new user to the database.
 * @param {Object} newUser 
 */
async function addUser(newUser) {
  await pool.query(
    'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
    [newUser.id, newUser.username, newUser.password]
  );
  
  if (newUser.exams && newUser.exams.length > 0) {
    for (const exam of newUser.exams) {
      const addedAtDate = exam.addedAt ? new Date(exam.addedAt) : new Date();
      await pool.query(
        'INSERT INTO exams (id, user_id, subject, grade, ects, added_at) VALUES (?, ?, ?, ?, ?, ?)',
        [exam.id, newUser.id, exam.subject, exam.grade, exam.ects, addedAtDate]
      );
    }
  }
}

/**
 * Updates a user's details (like adding/deleting exams).
 * @param {Object} updatedUser 
 */
async function updateUser(updatedUser) {
  await pool.query('UPDATE users SET username = ? WHERE id = ?', [updatedUser.username, updatedUser.id]);
  
  await pool.query('DELETE FROM exams WHERE user_id = ?', [updatedUser.id]);
  
  if (updatedUser.exams && updatedUser.exams.length > 0) {
    for (const exam of updatedUser.exams) {
      const addedAtDate = exam.addedAt ? new Date(exam.addedAt) : new Date();
      await pool.query(
        'INSERT INTO exams (id, user_id, subject, grade, ects, added_at) VALUES (?, ?, ?, ?, ?, ?)',
        [exam.id, updatedUser.id, exam.subject, exam.grade, exam.ects, addedAtDate]
      );
    }
  }
}

module.exports = {
  getAllUsers,
  getUserByUsername,
  getUserById,
  addUser,
  updateUser
};
