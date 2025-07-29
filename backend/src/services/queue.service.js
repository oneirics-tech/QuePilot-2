// backend/src/services/queue.service.js
const { Customer, Employee, Business, ActivityLog, Workflow } = require('../models');
const assignmentService = require('./assignment.service');
const { Op } = require('sequelize');

class QueueService {
  async addCustomerToQueue(businessId, customerData) {
    // Get next queue number
    const lastCustomer = await Customer.findOne({
      where: {
        businessId,
        createdAt: {
          [Op.gte]: new Date().setHours(0, 0, 0, 0)
        }
      },
      order: [['queueNumber', 'DESC']]
    });

    const queueNumber = (lastCustomer?.queueNumber || 0) + 1;

    // Create customer
    const customer = await Customer.create({
      businessId,
      ...customerData,
      queueNumber,
      status: 'waiting',
      currentWorkflowStep: 'check_in'
    });

    // Log activity
    await ActivityLog.create({
      businessId,
      customerId: customer.id,
      action: 'customer_checked_in',
      details: {
        queueNumber,
        reason: customerData.reason
      }
    });

    // Try auto-assignment
    try {
      await assignmentService.autoAssignCustomer(customer.id, businessId);
    } catch (error) {
      // No available employees, customer stays in queue
      console.log('Auto-assignment failed:', error.message);
    }

    return customer;
  }

  async getQueueStatus(businessId) {
    const waiting = await Customer.findAll({
      where: {
        businessId,
        status: 'waiting'
      },
      order: [['checkInTime', 'ASC']]
    });

    const assigned = await Customer.findAll({
      where: {
        businessId,
        status: 'assigned'
      },
      include: [{
        model: Employee,
        as: 'assignedEmployee'
      }],
      order: [['assignmentTime', 'ASC']]
    });

    const inProgress = await Customer.findAll({
      where: {
        businessId,
        status: 'in_progress'
      },
      include: [{
        model: Employee,
        as: 'assignedEmployee'
      }]
    });

    return {
      waiting,
      assigned,
      inProgress,
      totalInQueue: waiting.length + assigned.length + inProgress.length
    };
  }

  async updateCustomerWorkflowStep(customerId, newStep, employeeId) {
    const customer = await Customer.findByPk(customerId);
    
    if (!customer) {
      throw new Error('Customer not found');
    }

    const oldStep = customer.currentWorkflowStep;
    customer.currentWorkflowStep = newStep;
    
    if (newStep === 'checkout' || newStep === 'completed') {
      customer.status = 'completed';
      customer.completionTime = new Date();
      customer.completedBy = 'employee';
    } else {
      customer.status = 'in_progress';
    }

    await customer.save();

    // Update employee count if completed
    if (customer.status === 'completed' && customer.assignedEmployeeId) {
      const employee = await Employee.findByPk(customer.assignedEmployeeId);
      if (employee) {
        employee.activeCustomerCount = Math.max(0, employee.activeCustomerCount - 1);
        await employee.save();
      }
    }

    // Log activity
    await ActivityLog.create({
      businessId: customer.businessId,
      customerId: customer.id,
      employeeId,
      action: 'workflow_step_changed',
      details: {
        fromStep: oldStep,
        toStep: newStep
      }
    });

    return customer;
  }

  async markCustomerReady(customerId, employeeId) {
    const customer = await Customer.findByPk(customerId);
    
    if (!customer) {
      throw new Error('Customer not found');
    }

    customer.readyTime = new Date();
    customer.status = 'in_progress';
    await customer.save();

    await ActivityLog.create({
      businessId: customer.businessId,
      customerId: customer.id,
      employeeId,
      action: 'customer_ready',
      details: {
        waitTime: Math.floor((customer.readyTime - customer.checkInTime) / 60000) // minutes
      }
    });

    return customer;
  }

  async closeOutDay(businessId) {
    const openCustomers = await Customer.findAll({
      where: {
        businessId,
        status: {
          [Op.in]: ['waiting', 'assigned', 'in_progress']
        }
      }
    });

    const results = [];

    for (const customer of openCustomers) {
      customer.status = 'auto_closed';
      customer.completionTime = new Date();
      customer.completedBy = 'auto_closed';
      await customer.save();

      // Update employee counts
      if (customer.assignedEmployeeId) {
        const employee = await Employee.findByPk(customer.assignedEmployeeId);
        if (employee) {
          employee.activeCustomerCount = 0;
          await employee.save();
        }
      }

      await ActivityLog.create({
        businessId,
        customerId: customer.id,
        action: 'customer_auto_closed',
        details: {
          previousStatus: customer.status,
          queueNumber: customer.queueNumber
        }
      });

      results.push(customer);
    }

    // Check out all employees
    await Employee.update(
      { 
        isAvailable: false, 
        lastCheckOut: new Date(),
        activeCustomerCount: 0
      },
      { 
        where: { businessId, isAvailable: true } 
      }
    );

    return {
      closedCustomers: results.length,
      customers: results
    };
  }
}

module.exports = new QueueService();
