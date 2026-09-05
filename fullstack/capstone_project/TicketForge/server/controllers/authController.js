const bcrypt = require('bcryptjs');
const db = require('../config/database');

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

function verifyPassword(inputPassword, storedPassword) {
    if (!storedPassword) {
        return false;
    }

    if (typeof storedPassword === 'string' && storedPassword.startsWith('$2')) {
        try {
            return bcrypt.compareSync(inputPassword, storedPassword);
        } catch (err) {
            return false;
        }
    }

    return inputPassword === storedPassword;
}

// POST /api/auth/register
function register(req, res) {
    const { name, email, password, department } = req.body;

    const nameErr = validateName(name);
    if (nameErr) return res.status(400).json({ success: false, message: nameErr });

    const emailErr = validateEmailFormat(email);
    if (emailErr) return res.status(400).json({ success: false, message: emailErr });

    const passwordErr = validatePasswordStrength(password);
    if (passwordErr) return res.status(400).json({ success: false, message: passwordErr });

    const cleanedEmail = normalizeEmail(email);
    const userDept = department ? department.trim() : 'General';

    // Check if email already exists
    db.get('SELECT id FROM users WHERE email = ?', [cleanedEmail], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error checking user existence.' });
        }
        if (row) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insert new Employee user (Role is strictly locked to Employee for self-registration)
        db.run(
            `INSERT INTO users (name, email, password, role, department, is_active) VALUES (?, ?, ?, 'Employee', ?, 1)`,
            [name.trim(), cleanedEmail, hashedPassword, userDept],
            function (err) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Failed to create employee account.' });
                }

                const newUser = {
                    id: this.lastID,
                    name: name.trim(),
                    email: cleanedEmail,
                    role: 'Employee',
                    department: userDept,
                    is_active: 1
                };

                // Store in session
                req.session.user = newUser;

                return res.status(201).json({
                    success: true,
                    message: 'Account created successfully!',
                    user: newUser
                });
            }
        );
    });
}

// POST /api/auth/login
function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanedEmail = normalizeEmail(email);

    db.get('SELECT * FROM users WHERE email = ?', [cleanedEmail], (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error during login.' });
        }
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Check if user account is deactivated
        if (user.is_active === 0) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact your Administrator.'
            });
        }

        const isPasswordMatch = verifyPassword(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            is_active: user.is_active
        };

        req.session.user = sessionUser;

        return res.json({
            success: true,
            message: `Welcome back, ${user.name}!`,
            user: sessionUser
        });
    });
}

// POST /api/auth/logout
function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to log out.' });
        }
        res.clearCookie('connect.sid');
        return res.json({ success: true, message: 'Logged out successfully.' });
    });
}

// GET /api/auth/me
function getMe(req, res) {
    if (req.session && req.session.user) {
        // Fetch fresh user details from DB in case profile was updated or account deactivated
        db.get('SELECT id, name, email, role, department, is_active FROM users WHERE id = ?', [req.session.user.id], (err, user) => {
            if (err || !user || user.is_active === 0) {
                req.session.destroy(() => {});
                return res.json({ success: true, user: null });
            }
            req.session.user = user;
            return res.json({ success: true, user });
        });
    } else {
        return res.json({ success: true, user: null });
    }
}

let demoCredentials = {
    admin: { email: 'admin@levitateit.com', password: 'Admin@2026' },
    support: { email: 'support@levitateit.com', password: 'admin123' },
    employee: { email: 'john@levitateit.com', password: 'password123' }
};

function updateDemoCredential(email, newPassword, role) {
    const cleaned = (email || '').trim().toLowerCase();

    if (cleaned === 'admin@levitateit.com' || role === 'Administrator') {
        demoCredentials.admin.password = newPassword;
        if (cleaned) demoCredentials.admin.email = cleaned;
    }
    if (cleaned === 'support@levitateit.com' || cleaned === 'sarah@levitateit.com' || role === 'IT_Support') {
        demoCredentials.support.password = newPassword;
        if (cleaned) demoCredentials.support.email = cleaned;
    }
    if (cleaned === 'john@levitateit.com' || role === 'Employee') {
        demoCredentials.employee.password = newPassword;
        if (cleaned) demoCredentials.employee.email = cleaned;
    }
}

function getDemoCredentials(req, res) {
    return res.json({ success: true, credentials: demoCredentials });
}

module.exports = {
    register,
    login,
    logout,
    getMe,
    getDemoCredentials,
    updateDemoCredential,
    validatePasswordStrength
};
