// backend/src/services/assignment.service.js
const { Customer, Employee, Business, ActivityLog } = require('../models');
const { Op } = require('sequelize');

class AssignmentService {
  async autoAssignCustomer(customerId, businessId) {
    const business = await Business.findByPk(businessId);
    const customer = await Customer.findByPk(customerId);
    
    if (!customer || customer.status !== 'waiting') {
      throw new Error('Customer not available for assignment');
    }

    // Get available employees
    const availableEmployees = await Employee.findAll({
      where: {
        businessId,
        isAvailable: true
      },
      order: [['activeCustomerCount', 'ASC'], ['lastCheckIn', 'ASC']]
    });

    if (availableEmployees.length === 0) {
      throw new Error('No available employees');
    }

    // Select employee based on assignment strategy
    let selectedEmployee;
    
    if (!business.allowMultipleCustomers) {
      // Find employee with no active customers
      selectedEmployee = availableEmployees.find(emp => emp.activeCustomerCount === 0);
    } else {
      // Get employee with least customers (already sorted)
      selectedEmployee = availableEmployees[0];
    }

    if (!selectedEmployee) {
      throw new Error('No employee available for assignment');
    }

    // Assign customer
    await this.assignCustomerToEmployee(customer, selectedEmployee, 'auto');
    
    return { customer, employee: selectedEmployee };
  }

  async assignCustomerToEmployee(customer, employee, assignmentType = 'manual') {
    // Update customer
    customer.assignedEmployeeId = employee.id;
    customer.status = 'assigned';
    customer.assignmentTime = new Date();
    customer.currentWorkflowStep = 'assigned';
    await customer.save();

    // Update employee customer count
    employee.activeCustomerCount += 1;
    await employee.save();

    // Log activity
    await ActivityLog.create({
      businessId: customer.businessId,
      customerId: customer.id,
      employeeId: employee.id,
      action: 'customer_assigned',
      details: {
        assignmentType,
        employeeName: employee.name,
        customerName: customer.name
      }
    });

    return customer;
  }

  async reassignCustomer(customerId, fromEmployeeId, toEmployeeId = null) {
    const customer = await Customer.findByPk(customerId);
    
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Update previous employee's count
    if (fromEmployeeId) {
      const fromEmployee = await Employee.findByPk(fromEmployeeId);
      if (fromEmployee) {
        fromEmployee.activeCustomerCount = Math.max(0, fromEmployee.activeCustomerCount - 1);
        await fromEmployee.save();
      }
    }

    // If no specific employee, put back in queue
    if (!toEmployeeId) {
      customer.assignedEmployeeId = null;
      customer.status = 'waiting';
      await customer.save();

      await ActivityLog.create({
        businessId: customer.businessId,
        customerId: customer.id,
        employeeId: fromEmployeeId,
        action: 'customer_reassigned_to_queue',
        details: {
          currentStep: customer.currentWorkflowStep
        }
      });
    } else {
      const toEmployee = await Employee.findByPk(toEmployeeId);
      await this.assignCustomerToEmployee(customer, toEmployee, 'reassignment');
    }

    return customer;
  }

  async checkFlowAndFlex(businessId) {
    const business = await Business.findByPk(businessId);
    
    if (business.assignmentMode !== 'flow_and_flex') {
      return;
    }

    // Find customers assigned to busy employees
    const assignedCustomers = await Customer.findAll({
      where: {
        businessId,
        status: 'assigned',
        currentWorkflowStep: 'assigned'
      },
      include: [{
        model: Employee,
        as: 'assignedEmployee'
      }]
    });

    // Find available employees
    const availableEmployees = await Employee.findAll({
      where: {
        businessId,
        isAvailable: true,
        activeCustomerCount: business.allowMultipleCustomers ? { [Op.gt]: 0 } : 0
      }
    });

    // Reassign if better match found
    for (const customer of assignedCustomers) {
      if (availableEmployees.length > 0) {
        const newEmployee = availableEmployees[0];
        if (newEmployee.id !== customer.assignedEmployeeId) {
          await this.reassignCustomer(customer.id, customer.assignedEmployeeId, newEmployee.id);
        }
      }
    }
  }
}

module.exports = new AssignmentService();
