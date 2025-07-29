// backend/src/controllers/customer.controller.js
const queueService = require('../services/queue.service');
const notificationService = require('../services/notification.service');
const { Customer, Employee, Business } = require('../models');

class CustomerController {
  async checkIn(req, res, next) {
    try {
      const { name, email, reason, businessId } = req.body;

      const customer = await queueService.addCustomerToQueue(businessId, {
        name,
        email,
        reason
      });

      const business = await Business.findByPk(businessId);
      
      // Send check-in confirmation email
      await notificationService.sendCheckInConfirmation(customer, business);

      res.status(201).json({
        queueNumber: customer.queueNumber,
        status: customer.status,
        customerId: customer.id
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyCustomers(req, res, next) {
    try {
      const employeeId = req.user.id;

      const customers = await Customer.findAll({
        where: {
          assignedEmployeeId: employeeId,
          status: ['assigned', 'in_progress']
        },
        order: [['assignmentTime', 'ASC']]
      });

      res.json(customers);
    } catch (error) {
      next(error);
    }
  }

  async markReady(req, res, next) {
    try {
      const { customerId } = req.params;
      const employeeId = req.user.id;

      const customer = await queueService.markCustomerReady(customerId, employeeId);
      
      const [employee, business] = await Promise.all([
        Employee.findByPk(employeeId),
        Business.findByPk(customer.businessId)
      ]);

      // Send ready notification
      await notificationService.sendReadyNotification(customer, employee, business);

      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async updateWorkflowStep(req, res, next) {
    try {
      const { customerId } = req.params;
      const { step } = req.body;
      const employeeId = req.user.id;

      const customer = await queueService.updateCustomerWorkflowStep(
        customerId, 
        step, 
        employeeId
      );

      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async reassign(req, res, next) {
    try {
      const { customerId } = req.params;
      const { toEmployeeId } = req.body;
      const fromEmployeeId = req.user.role === 'employee' ? req.user.id : req.body.fromEmployeeId;

      const customer = await assignmentService.reassignCustomer(
        customerId,
        fromEmployeeId,
        toEmployeeId
      );

      res.json(customer);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CustomerController();
