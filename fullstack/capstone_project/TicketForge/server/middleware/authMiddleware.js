// Middleware to ensure user is logged in
function requireAuth(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Please log in first.' });
    }
    next();
}

// Middleware to ensure logged-in user is IT Support or Administrator
function requireSupport(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Please log in first.' });
    }
    if (req.session.user.role !== 'IT_Support' && req.session.user.role !== 'Administrator') {
        return res.status(403).json({ success: false, message: 'Forbidden. IT Support or Admin access required.' });
    }
    next();
}

// Middleware to ensure logged-in user is Administrator only
function requireAdmin(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Please log in first.' });
    }
    if (req.session.user.role !== 'Administrator') {
        return res.status(403).json({ success: false, message: 'Forbidden. Administrator access required.' });
    }
    next();
}

module.exports = {
    requireAuth,
    requireSupport,
    requireAdmin
};
