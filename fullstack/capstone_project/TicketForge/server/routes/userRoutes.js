const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requireSupport, requireAdmin } = require('../middleware/authMiddleware');

// Employee Profile Update
router.put('/profile', requireAuth, userController.updateProfile);

// IT Support & Admin employee list
router.get('/employees', requireSupport, userController.getEmployees);

// Administrator User Management Routes
router.get('/all', requireAdmin, userController.getAllUsers);
router.post('/support', requireAdmin, userController.addITSupportMember);
router.put('/:id/status', requireAdmin, userController.toggleUserStatus);
router.put('/:id/reset-password', requireAdmin, userController.resetUserPassword);
router.delete('/:id', requireAdmin, userController.deleteUserPermanently);

// Legacy deletion
router.delete('/employees/:id', requireAdmin, userController.deleteEmployee);

// Self account deletion
router.delete('/me', requireAuth, userController.deleteMe);

module.exports = router;
