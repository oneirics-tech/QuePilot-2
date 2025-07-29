// backend/src/routes/queue.routes.js
const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queue.controller');
const authMiddleware = require('../middleware/auth.middleware');
const businessMiddleware = require('../middleware/business.middleware');

router.get('/status', businessMiddleware, queueController.getStatus);
router.post('/assign', authMiddleware('admin'), queueController.assignCustomer);

module.exports = router;
