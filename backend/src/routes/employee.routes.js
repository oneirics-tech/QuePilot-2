// backend/src/routes/employee.routes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const authMiddleware = require('../middleware/auth.middleware');
const businessMiddleware = require('../middleware/business.middleware');

router.post('/check-in', businessMiddleware, employeeController.checkIn);
router.post('/check-out', authMiddleware('employee'), employeeController.checkOut);

// Admin routes
router.post('/', authMiddleware('admin'), employeeController.create);
router.get('/', authMiddleware('admin'), employeeController.list);
router.post('/:employeeId/regenerate-pin', authMiddleware('admin'), employeeController.regeneratePin);
router.patch('/:employeeId/availability', authMiddleware('admin'), employeeController.toggleAvailability);

module.exports = router;
