const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { all, run, get } = require('../db');
const bcrypt = require('bcrypt');

// list users (admin)
router.get('/', auth('admin'), async (req, res) => {
  try {
    const rows = await all('SELECT u.id, u.name, u.email, u.role, d.name as department, u.department_id FROM users u LEFT JOIN departments d ON u.department_id = d.id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch users' });
  }
});

// admin create user (admin)
router.post('/', auth('admin'), async (req, res) => {
  const { name, email, password, role = 'employee', department_id = null } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    await run(`INSERT INTO users (name, email, password, role, department_id) VALUES (?, ?, ?, ?, ?)`, [name, email, hashed, role, department_id]);
    res.json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create user' });
  }
});

// list departments (any authenticated user)
router.get('/departments', auth(), async (req, res) => {
  try {
    const rows = await all('SELECT id, name FROM departments ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch departments' });
  }
});

// create department (admin)
router.post('/departments', auth('admin'), async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing name' });
  try {
    await run(`INSERT INTO departments (name) VALUES (?)`, [name]);
    res.json({ message: 'Department created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create department' });
  }
});

module.exports = router;