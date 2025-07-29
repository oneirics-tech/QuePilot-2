// backend/src/routes/customer.routes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const authMiddleware = require('../middleware/auth.middleware');
const businessMiddleware = require('../middleware/business.middleware');

router.post('/check-in', businessMiddleware, customerController.checkIn);
router.get('/my-customers', authMiddleware('employee'), customerController.getMyCustomers);
router.post('/:customerId/ready', authMiddleware('employee'), customerController.markReady);
router.patch('/:customerId/workflow', authMiddleware('employee'), customerController.updateWorkflowStep);
router.post('/:customerId/reassign', authMiddleware(), customerController.reassign);

module.exports = router;
