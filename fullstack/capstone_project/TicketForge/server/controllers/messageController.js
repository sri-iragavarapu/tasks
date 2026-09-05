const db = require('../config/database');

// GET /api/messages/:ticketId - Get chat thread for a ticket
function getMessages(req, res) {
    const ticketId = req.params.ticketId;
    const user = req.session.user;

    // Verify ticket access
    db.get('SELECT created_by FROM tickets WHERE id = ?', [ticketId], (err, ticket) => {
        if (err || !ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }

        if (user.role === 'Employee' && ticket.created_by !== user.id) {
            return res.status(403).json({ success: false, message: 'Forbidden. You do not have access to this ticket chat.' });
        }

        const sql = `
            SELECT 
                m.id, m.ticket_id, m.sender_id, m.message, m.created_at,
                u.name AS sender_name, u.role AS sender_role
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.ticket_id = ?
            ORDER BY m.created_at ASC, m.id ASC
        `;

        db.all(sql, [ticketId], (err, messages) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
            }
            return res.json({ success: true, messages });
        });
    });
}

// POST /api/messages/:ticketId - Post a new message into a ticket
function sendMessage(req, res) {
    const ticketId = req.params.ticketId;
    const { message } = req.body;
    const senderId = req.session.user.id;
    const senderRole = req.session.user.role;

    if (!message || message.trim() === '') {
        return res.status(400).json({ success: false, message: 'Message content cannot be empty.' });
    }

    db.get('SELECT created_by FROM tickets WHERE id = ?', [ticketId], (err, ticket) => {
        if (err || !ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }

        if (senderRole === 'Employee' && ticket.created_by !== senderId) {
            return res.status(403).json({ success: false, message: 'Forbidden. You cannot chat in this ticket.' });
        }

        const sql = `INSERT INTO messages (ticket_id, sender_id, message) VALUES (?, ?, ?)`;
        db.run(sql, [ticketId, senderId, message.trim()], function (err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to send message.' });
            }

            // Also update ticket updated_at
            db.run(`UPDATE tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [ticketId]);

            return res.status(201).json({
                success: true,
                message: 'Message sent!',
                messageId: this.lastID
            });
        });
    });
}

module.exports = {
    getMessages,
    sendMessage
};
