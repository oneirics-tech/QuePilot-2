// backend/src/routes/workflow.routes.js
const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflow.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware('admin'), workflowController.create);
router.get('/', authMiddleware('admin'), workflowController.list);
router.patch('/:workflowId', authMiddleware('admin'), workflowController.update);

module.exports = router;
