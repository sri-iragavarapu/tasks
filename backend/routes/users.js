const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { all, run, get } = require('../db');

// list users (admin)
router.get('/', auth('admin'), async (req, res) => {
  try {
    const rows = await all('SELECT u.id, u.name, u.email, u.role, d.name as department FROM users u LEFT JOIN departments d ON u.department_id = d.id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch users' });
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