const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { updateDemoCredential } = require('./authController');

function normalizeEmail(email) {
    return (email || '').trim().toLowerCase();
}

function validateName(name) {
    if (!name || typeof name !== 'string') return 'Name is required.';
    const trimmed = name.trim();
    if (trimmed.length < 3) return 'Name must be at least 3 characters long.';
    if (!/^[a-zA-Z\s]+$/.test(trimmed)) return 'Name must contain letters and spaces only.';
    return null;
}

function validateEmailFormat(email) {
    if (!email || typeof email !== 'string') return 'Email is required.';
    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return 'Please enter a valid email address.';
    return null;
}

function validatePasswordStrength(password) {
    if (!password || typeof password !== 'string') return 'Password is required.';
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Password must contain at least one special character.';
    return null;
}

// PUT /api/users/profile - Update name and/or password (email is read-only)
function updateProfile(req, res) {
    const userId = req.session.user.id;
    const { name, newPassword } = req.body;

    const nameErr = validateName(name);
    if (nameErr) {
        return res.status(400).json({ success: false, message: nameErr });
    }

    const trimmedName = name.trim();

    if (newPassword && newPassword.trim() !== '') {
        const passErr = validatePasswordStrength(newPassword.trim());
        if (passErr) {
            return res.status(400).json({ success: false, message: passErr });
        }
        const hashedPassword = bcrypt.hashSync(newPassword.trim(), 10);
        db.run(
            `UPDATE users SET name = ?, password = ? WHERE id = ?`,
            [trimmedName, hashedPassword, userId],
            function (err) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
                }
                req.session.user.name = trimmedName;
                updateDemoCredential(req.session.user.email, newPassword.trim(), req.session.user.role);
                return res.json({
                    success: true,
                    message: 'Profile updated successfully with new password.',
                    user: req.session.user
                });
            }
        );
    } else {
        db.run(
            `UPDATE users SET name = ? WHERE id = ?`,
            [trimmedName, userId],
            function (err) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Failed to update name.' });
                }
                req.session.user.name = trimmedName;
                return res.json({
                    success: true,
                    message: 'Name updated successfully.',
                    user: req.session.user
                });
            }
        );
    }
}

// GET /api/users/employees - List all employees (IT Support & Admin)
function getEmployees(req, res) {
    db.all(
        `SELECT id, name, email, department, role, is_active, created_at FROM users WHERE role = 'Employee' ORDER BY id DESC`,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to fetch employees list.' });
            }
            return res.json({ success: true, employees: rows });
        }
    );
}

// GET /api/users/all - Get all users categorized by role (Administrator only)
function getAllUsers(req, res) {
    db.all(
        `SELECT id, name, email, department, role, is_active, created_at FROM users ORDER BY id DESC`,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to fetch users directory.' });
            }

            const employees = rows.filter(u => u.role === 'Employee');
            const support = rows.filter(u => u.role === 'IT_Support');
            const admins = rows.filter(u => u.role === 'Administrator');

            return res.json({
                success: true,
                users: rows,
                categorized: {
                    employees,
                    support,
                    admins
                }
            });
        }
    );
}

// POST /api/users/support - Add IT Support Member (Administrator only)
function addITSupportMember(req, res) {
    const { name, email, password, department } = req.body;

    const nameErr = validateName(name);
    if (nameErr) return res.status(400).json({ success: false, message: nameErr });

    const emailErr = validateEmailFormat(email);
    if (emailErr) return res.status(400).json({ success: false, message: emailErr });

    const passErr = validatePasswordStrength(password);
    if (passErr) return res.status(400).json({ success: false, message: passErr });

    const cleanedEmail = normalizeEmail(email);
    const supportDept = department ? department.trim() : 'IT Support';

    db.get('SELECT id FROM users WHERE email = ?', [cleanedEmail], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error checking user.' });
        }
        if (row) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        db.run(
            `INSERT INTO users (name, email, password, role, department, is_active) VALUES (?, ?, ?, 'IT_Support', ?, 1)`,
            [name.trim(), cleanedEmail, hashedPassword, supportDept],
            function (err) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Failed to create IT Support account.' });
                }

                return res.status(201).json({
                    success: true,
                    message: `IT Support account created for ${name.trim()}!`,
                    user: {
                        id: this.lastID,
                        name: name.trim(),
                        email: cleanedEmail,
                        role: 'IT_Support',
                        department: supportDept,
                        is_active: 1
                    }
                });
            }
        );
    });
}

// PUT /api/users/:id/status - Toggle account Deactivate / Activate (Administrator only)
function toggleUserStatus(req, res) {
    const targetId = req.params.id;
    const { is_active } = req.body;
    const currentAdminId = req.session.user.id;

    // Prevent Admin from deactivating their own account
    if (parseInt(targetId, 10) === parseInt(currentAdminId, 10)) {
        return res.status(400).json({
            success: false,
            message: 'Forbidden. You cannot deactivate your own Administrator account.'
        });
    }

    if (is_active !== 0 && is_active !== 1) {
        return res.status(400).json({ success: false, message: 'Invalid active status value.' });
    }

    db.get('SELECT id, name, role FROM users WHERE id = ?', [targetId], (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error fetching user.' });
        }
        if (!user) {
            return res.status(404).json({ success: false, message: 'User account not found.' });
        }

        db.run('UPDATE users SET is_active = ? WHERE id = ?', [is_active, targetId], function (err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to update account status.' });
            }

            const statusLabel = is_active === 1 ? 'activated' : 'deactivated';
            return res.json({
                success: true,
                message: `Account for ${user.name} (${user.role}) has been ${statusLabel}.`,
                is_active
            });
        });
    });
}

// PUT /api/users/:id/reset-password - Reset password to a temporary password (Administrator only)
function resetUserPassword(req, res) {
    const targetId = req.params.id;
    const customTempPassword = req.body.tempPassword ? req.body.tempPassword.trim() : 'Temp@2026';

    const passErr = validatePasswordStrength(customTempPassword);
    if (passErr) {
        return res.status(400).json({ success: false, message: passErr });
    }

    db.get('SELECT id, name, email, role FROM users WHERE id = ?', [targetId], (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error finding user.' });
        }
        if (!user) {
            return res.status(404).json({ success: false, message: 'User account not found.' });
        }

        const hashedPassword = bcrypt.hashSync(customTempPassword, 10);

        db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, targetId], function (err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to reset user password.' });
            }

            updateDemoCredential(user.email, customTempPassword, user.role);

            return res.json({
                success: true,
                message: `Password for ${user.name} has been reset to temporary password.`,
                tempPassword: customTempPassword
            });
        });
    });
}

// DELETE /api/users/employees/:id - Legacy employee deletion endpoint
function deleteEmployee(req, res) {
    const targetId = req.params.id;

    db.get(`SELECT id, name FROM users WHERE id = ? AND role = 'Employee'`, [targetId], (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error checking employee.' });
        }
        if (!user) {
            return res.status(404).json({ success: false, message: 'Employee account not found.' });
        }

        db.serialize(() => {
            db.run('BEGIN TRANSACTION;');
            db.run(`DELETE FROM messages WHERE sender_id = ? OR ticket_id IN (SELECT id FROM tickets WHERE created_by = ?)`, [targetId, targetId]);
            db.run(`DELETE FROM tickets WHERE created_by = ?`, [targetId]);
            db.run(`DELETE FROM users WHERE id = ? AND role = 'Employee'`, [targetId]);
            db.run('COMMIT;', (commitErr) => {
                if (commitErr) {
                    db.run('ROLLBACK;');
                    return res.status(500).json({ success: false, message: 'Failed to complete employee deletion.' });
                }
                return res.json({
                    success: true,
                    message: `Employee ${user.name} deleted.`
                });
            });
        });
    });
}

// DELETE /api/users/me - Delete own account (Employee self delete)
function deleteMe(req, res) {
    const userId = req.session.user.id;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION;');
        db.run(`DELETE FROM messages WHERE sender_id = ? OR ticket_id IN (SELECT id FROM tickets WHERE created_by = ?)`, [userId, userId]);
        db.run(`DELETE FROM tickets WHERE created_by = ?`, [userId]);
        db.run(`DELETE FROM users WHERE id = ?`, [userId]);
        db.run('COMMIT;', (err) => {
            if (err) {
                db.run('ROLLBACK;');
                return res.status(500).json({ success: false, message: 'Failed to delete account transactionally.' });
            }
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                return res.json({ success: true, message: 'Your account and data have been deleted.' });
            });
        });
    });
}

// DELETE /api/users/:id - Permanently delete Employee or IT Support account (Administrator only)
function deleteUserPermanently(req, res) {
    const targetId = req.params.id;
    const currentAdminId = req.session.user.id;

    if (parseInt(targetId, 10) === parseInt(currentAdminId, 10)) {
        return res.status(400).json({ success: false, message: 'Forbidden. You cannot delete your own Administrator account.' });
    }

    db.get('SELECT id, name, role FROM users WHERE id = ?', [targetId], (err, user) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error finding user.' });
        if (!user) return res.status(404).json({ success: false, message: 'User account not found.' });

        db.serialize(() => {
            db.run('BEGIN TRANSACTION;');
            db.run(`DELETE FROM messages WHERE sender_id = ? OR ticket_id IN (SELECT id FROM tickets WHERE created_by = ?)`, [targetId, targetId]);
            db.run(`UPDATE tickets SET assigned_to = NULL WHERE assigned_to = ?`, [targetId]);
            db.run(`DELETE FROM tickets WHERE created_by = ?`, [targetId]);
            db.run(`DELETE FROM users WHERE id = ?`, [targetId]);
            db.run('COMMIT;', (err) => {
                if (err) {
                    db.run('ROLLBACK;');
                    return res.status(500).json({ success: false, message: 'Failed to delete account permanently.' });
                }
                return res.json({
                    success: true,
                    message: `Account for ${user.name} (${user.role}) has been permanently deleted.`
                });
            });
        });
    });
}

module.exports = {
    updateProfile,
    getEmployees,
    getAllUsers,
    addITSupportMember,
    toggleUserStatus,
    resetUserPassword,
    deleteEmployee,
    deleteMe,
    deleteUserPermanently
};
