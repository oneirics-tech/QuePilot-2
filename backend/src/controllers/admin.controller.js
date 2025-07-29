// backend/src/controllers/admin.controller.js
const queueService = require('../services/queue.service');
const analyticsService = require('../services/analytics.service');
const { Business, Workflow } = require('../models');

class AdminController {
  async updateBusinessSettings(req, res, next) {
    try {
      const businessId = req.user.businessId;
      const settings = req.body;

      const business = await Business.findByPk(businessId);
      
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      await business.update(settings);

      res.json(business);
    } catch (error) {
      next(error);
    }
  }

  async closeOutDay(req, res, next) {
    try {
      const businessId = req.user.businessId;
      const result = await queueService.closeOutDay(businessId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAnalytics(req, res, next) {
    try {
      const businessId = req.user.businessId;
      const { date } = req.query;
      const targetDate = date ? new Date(date) : new Date();

      const [waitTimeStats, employeeStats, hourlyDistribution] = await Promise.all([
        analyticsService.getWaitTimeStats(businessId, targetDate),
        analyticsService.getEmployeeStats(businessId, targetDate),
        analyticsService.getHourlyDistribution(businessId, targetDate)
      ]);

      res.json({
        waitTimeStats,
        employeeStats,
        hourlyDistribution
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
