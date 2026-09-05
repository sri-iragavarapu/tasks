const db = require('../config/database');

// GET /api/tickets - Fetch tickets with search, filters, assignment filters & sorting
function getTickets(req, res) {
    const user = req.session.user;
    const { search, category, status, priority, assignmentFilter, sortBy } = req.query;

    let sql = `
        SELECT 
            t.id, t.title, t.description, t.category, t.priority, t.status, 
            t.created_by, t.assigned_to, t.assigned_at, t.created_at, t.updated_at,
            u1.name AS creator_name, u1.department AS creator_department,
            u2.name AS assignee_name
        FROM tickets t
        LEFT JOIN users u1 ON t.created_by = u1.id
        LEFT JOIN users u2 ON t.assigned_to = u2.id
        WHERE 1=1
    `;

    const params = [];

    // If Employee, show only their own tickets
    if (user.role === 'Employee') {
        sql += ` AND t.created_by = ?`;
        params.push(user.id);
    }

    // Assignment Filter (IT Support / Admin)
    if (assignmentFilter === 'Assigned_To_Me') {
        sql += ` AND t.assigned_to = ?`;
        params.push(user.id);
    } else if (assignmentFilter === 'Unassigned') {
        sql += ` AND t.assigned_to IS NULL`;
    }

    // Filters
    if (search && search.trim() !== '') {
        const term = `%${search.trim().replace(/^TF-/i, '')}%`;
        const rawTerm = `%${search.trim()}%`;
        sql += ` AND (t.title LIKE ? OR t.description LIKE ? OR CAST(t.id AS TEXT) LIKE ? OR t.title LIKE ? OR CAST(t.id AS TEXT) = ?)`;
        params.push(rawTerm, rawTerm, term, term, search.trim().replace(/^TF-0*/i, ''));
    }

    if (category && category !== 'All') {
        sql += ` AND t.category = ?`;
        params.push(category);
    }

    if (status && status !== 'All') {
        sql += ` AND t.status = ?`;
        params.push(status);
    }

    if (priority && priority !== 'All') {
        sql += ` AND t.priority = ?`;
        params.push(priority);
    }

    // Sorting logic
    if (sortBy === 'oldest') {
        sql += ` ORDER BY t.created_at ASC, t.id ASC`;
    } else if (sortBy === 'priority') {
        sql += ` ORDER BY CASE t.priority WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 WHEN 'Low' THEN 4 ELSE 5 END, t.created_at DESC`;
    } else if (sortBy === 'status') {
        sql += ` ORDER BY CASE t.status WHEN 'Open' THEN 1 WHEN 'In_Progress' THEN 2 WHEN 'Resolved' THEN 3 WHEN 'Closed' THEN 4 ELSE 5 END, t.created_at DESC`;
    } else {
        // Default: Newest first
        sql += ` ORDER BY t.created_at DESC, t.id DESC`;
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error fetching tickets:', err.message);
            return res.status(500).json({ success: false, message: 'Failed to fetch tickets.' });
        }
        return res.json({ success: true, tickets: rows });
    });
}

// GET /api/tickets/:id - Get single ticket detailed metadata
function getTicketById(req, res) {
    const ticketId = req.params.id;
    const user = req.session.user;

    const sql = `
        SELECT 
            t.id, t.title, t.description, t.category, t.priority, t.status, 
            t.created_by, t.assigned_to, t.assigned_at, t.created_at, t.updated_at,
            u1.name AS creator_name, u1.email AS creator_email, u1.department AS creator_department,
            u2.name AS assignee_name, u2.email AS assignee_email
        FROM tickets t
        LEFT JOIN users u1 ON t.created_by = u1.id
        LEFT JOIN users u2 ON t.assigned_to = u2.id
        WHERE t.id = ?
    `;

    db.get(sql, [ticketId], (err, ticket) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error fetching ticket.' });
        }
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }

        // Access check: Employees can only view their own tickets
        if (user.role === 'Employee' && ticket.created_by !== user.id) {
            return res.status(403).json({ success: false, message: 'Forbidden. You cannot view this ticket.' });
        }

        return res.json({ success: true, ticket });
    });
}

// POST /api/tickets - Raise a new ticket
function createTicket(req, res) {
    const { title, description, category, priority } = req.body;
    const currentUser = req.session.user;

    if (!currentUser || !currentUser.id) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Session expired.' });
    }

    const createdBy = currentUser.id;

    if (!title || title.trim().length < 5) {
        return res.status(400).json({ success: false, message: 'Ticket title must be at least 5 characters long.' });
    }

    if (!description || description.trim().length < 10) {
        return res.status(400).json({ success: false, message: 'Ticket description must be at least 10 characters long.' });
    }

    if (!category || category === 'All') {
        return res.status(400).json({ success: false, message: 'Please select a valid ticket category.' });
    }

    const ticketPriority = priority || 'Medium';

    // Prevent automated or double-click duplicate ticket creation within 5 seconds
    db.get(
        `SELECT id FROM tickets WHERE created_by = ? AND title = ? AND description = ? AND created_at > datetime('now', '-5 seconds')`,
        [createdBy, title.trim(), description.trim()],
        (dupErr, dupTicket) => {
            if (dupTicket) {
                return res.status(409).json({ success: false, message: 'Ticket already submitted recently. Please wait.' });
            }

            const sql = `
                INSERT INTO tickets (title, description, category, priority, status, created_by)
                VALUES (?, ?, ?, ?, 'Open', ?)
            `;

            db.run(sql, [title.trim(), description.trim(), category, ticketPriority, createdBy], function (err) {
                if (err) {
                    console.error('Error creating ticket:', err.message);
                    return res.status(500).json({ success: false, message: 'Failed to create ticket.' });
                }

                return res.status(201).json({
                    success: true,
                    message: 'Ticket created successfully!',
                    ticketId: this.lastID
                });
            });
        }
    );
}

// PUT /api/tickets/:id/assign - IT Support assigns ticket to self
function assignTicket(req, res) {
    const ticketId = req.params.id;
    const supportId = req.session.user.id;
    const nowIso = new Date().toISOString();

    const sql = `
        UPDATE tickets 
        SET assigned_to = ?, assigned_at = ?, status = 'In_Progress', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(sql, [supportId, nowIso, ticketId], function (err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to assign ticket.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }

        return res.json({
            success: true,
            message: 'Ticket assigned to you successfully and status set to In Progress.',
            assigned_to: supportId,
            assigned_at: nowIso,
            status: 'In_Progress'
        });
    });
}

// PUT /api/tickets/:id/unassign - IT Support / Admin unassigns ticket
function unassignTicket(req, res) {
    const ticketId = req.params.id;

    const sql = `
        UPDATE tickets 
        SET assigned_to = NULL, assigned_at = NULL, status = 'Open', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(sql, [ticketId], function (err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to unassign ticket.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }

        return res.json({
            success: true,
            message: 'Ticket unassigned successfully and status set back to Open.',
            assigned_to: null,
            assigned_at: null,
            status: 'Open'
        });
    });
}

// PUT /api/tickets/:id/status - Update status
function updateTicketStatus(req, res) {
    const ticketId = req.params.id;
    const { status } = req.body;
    const currentUser = req.session.user;

    const validStatuses = ['Open', 'In_Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    // Retrieve ticket details to verify assignment authorization
    db.get('SELECT id, assigned_to, created_by FROM tickets WHERE id = ?', [ticketId], (err, ticket) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error fetching ticket.' });
        }
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }

        // Authorization Rules:
        // Support/Staff members must assign the ticket to themselves before updating status
        if (currentUser.role === 'IT_Support') {
            if (ticket.assigned_to !== currentUser.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Please assign this ticket to yourself before updating the status.'
                });
            }
        } else if (currentUser.role === 'Employee') {
            if (ticket.created_by !== currentUser.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized. You can only update your own tickets.'
                });
            }
        }

        const sql = `
            UPDATE tickets 
            SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        db.run(sql, [status, ticketId], function (updateErr) {
            if (updateErr) {
                return res.status(500).json({ success: false, message: 'Failed to update ticket status.' });
            }
            return res.json({ success: true, message: `Ticket status updated to ${status}.` });
        });
    });
}

// PUT /api/tickets/:id/close - Employee marks resolved ticket as Closed
function closeTicket(req, res) {
    const ticketId = req.params.id;
    const userId = req.session.user.id;

    db.run(
        `UPDATE tickets SET status = 'Closed', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND created_by = ?`,
        [ticketId, userId],
        function (err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to close ticket.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ success: false, message: 'Ticket not found or permission denied.' });
            }
            return res.json({ success: true, message: 'Ticket closed successfully.' });
        }
    );
}

// DELETE /api/tickets/:id - Delete ticket (IT Support only)
function deleteTicket(req, res) {
    const ticketId = req.params.id;

    db.run(`DELETE FROM tickets WHERE id = ?`, [ticketId], function (err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to delete ticket.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }
        return res.json({ success: true, message: 'Ticket deleted successfully.' });
    });
}

module.exports = {
    getTickets,
    getTicketById,
    createTicket,
    assignTicket,
    unassignTicket,
    updateTicketStatus,
    closeTicket,
    deleteTicket
};
