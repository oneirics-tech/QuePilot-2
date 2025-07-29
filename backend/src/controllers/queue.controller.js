// backend/src/controllers/queue.controller.js
const queueService = require('../services/queue.service');
const assignmentService = require('../services/assignment.service');

class QueueController {
  async getStatus(req, res, next) {
    try {
      const businessId = req.businessId || req.user.businessId;
      const status = await queueService.getQueueStatus(businessId);
      res.json(status);
    } catch (error) {
      next(error);
    }
  }

  async assignCustomer(req, res, next) {
    try {
      const { customerId, employeeId } = req.body;
      const businessId = req.user.businessId;

      const [customer, employee] = await Promise.all([
        Customer.findOne({ where: { id: customerId, businessId } }),
        Employee.findOne({ where: { id: employeeId, businessId } })
      ]);

      if (!customer || !employee) {
        return res.status(404).json({ error: 'Customer or employee not found' });
      }

      await assignmentService.assignCustomerToEmployee(customer, employee, 'manual');

      res.json({ customer, employee });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QueueController();
