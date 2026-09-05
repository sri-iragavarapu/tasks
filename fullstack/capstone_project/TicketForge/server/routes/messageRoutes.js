const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/:ticketId', requireAuth, messageController.getMessages);
router.post('/:ticketId', requireAuth, messageController.sendMessage);

module.exports = router;
