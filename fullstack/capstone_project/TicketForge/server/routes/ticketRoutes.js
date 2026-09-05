const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { requireAuth, requireSupport } = require('../middleware/authMiddleware');

router.get('/', requireAuth, ticketController.getTickets);
router.get('/:id', requireAuth, ticketController.getTicketById);
router.post('/', requireAuth, ticketController.createTicket);

// Assign ticket (IT Support / Admin)
router.put('/:id/assign', requireSupport, ticketController.assignTicket);

// Unassign ticket (IT Support / Admin)
router.put('/:id/unassign', requireSupport, ticketController.unassignTicket);

// Update status (IT Support, Admin, or Employee)
router.put('/:id/status', requireAuth, ticketController.updateTicketStatus);

// Close ticket (Employee)
router.put('/:id/close', requireAuth, ticketController.closeTicket);

// Delete ticket (IT Support / Admin)
router.delete('/:id', requireSupport, ticketController.deleteTicket);

module.exports = router;
