const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { run, all, get } = require('../db');

// Apply for leave (employee)
router.post('/', auth(), async (req, res) => {
  const { start_date, end_date, type, reason } = req.body;
  const userId = req.user.id;
  if (!start_date || !end_date) return res.status(400).json({ error: 'Missing dates' });
  try {
    await run(`INSERT INTO leaves (user_id, start_date, end_date, type, reason) VALUES (?, ?, ?, ?, ?)`, [userId, start_date, end_date, type, reason]);
    res.json({ message: 'Leave request submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not submit leave' });
  }
});

// Get leaves. Admins see all, employees see own
router.get('/', auth(), async (req, res) => {
  try {
    let rows;
    if (req.user.role === 'admin') {
      rows = await all(`SELECT l.*, u.name as employee_name, u.email as employee_email FROM leaves l JOIN users u ON l.user_id = u.id ORDER BY l.created_at DESC`);
    } else {
      rows = await all(`SELECT l.*, u.name as employee_name FROM leaves l JOIN users u ON l.user_id = u.id WHERE l.user_id = ? ORDER BY l.created_at DESC`, [req.user.id]);
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch leaves' });
  }
});

// Admin action: approve/reject
router.post('/:id/review', auth('admin'), async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'approve' or 'reject'
  if (!['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'Invalid action' });
  try {
    const status = action === 'approve' ? 'approved' : 'rejected';
    await run(`UPDATE leaves SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?`, [status, req.user.id, id]);
    res.json({ message: `Leave ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update leave' });
  }
});

module.exports = router;