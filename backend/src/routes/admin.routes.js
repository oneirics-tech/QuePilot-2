// backend/src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.patch('/business/settings', authMiddleware('admin'), adminController.updateBusinessSettings);
router.post('/close-day', authMiddleware('admin'), adminController.closeOutDay);
router.get('/analytics', authMiddleware('admin'), adminController.getAnalytics);

module.exports = router;
