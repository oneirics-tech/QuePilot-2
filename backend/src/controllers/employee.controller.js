// backend/src/controllers/employee.controller.js
const { Employee, ActivityLog } = require('../models');
const pinGenerator = require('../utils/pin.generator');
const queueService = require('../services/queue.service');
const assignmentService = require('../services/assignment.service');

class EmployeeController {
  async create(req, res, next) {
    try {
      const { name, initials, customPin } = req.body;
      const businessId = req.user.businessId;

      const pin = customPin || pinGenerator.generate();

      const employee = await Employee.create({
        businessId,
        name,
        initials: initials || name.split(' ').map(n => n[0]).join('').toUpperCase(),
        pin,
        profileImage: req.body.profileImage
      });

      await ActivityLog.create({
        businessId,
        employeeId: employee.id,
        action: 'employee_created',
        details: { name }
      });

      res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const employees = await Employee.findAll({
        where: { businessId: req.user.businessId },
        order: [['name', 'ASC']]
      });

      res.json(employees);
    } catch (error) {
      next(error);
    }
  }

  async checkIn(req, res, next) {
    try {
      const { pin } = req.body;
      const businessId = req.businessId || req.body.businessId;

      const employee = await Employee.findOne({
        where: { businessId, pin }
      });

      if (!employee) {
        return res.status(401).json({ error: 'Invalid PIN' });
      }

      employee.isAvailable = true;
      employee.lastCheckIn = new Date();
      await employee.save();

      await ActivityLog.create({
        businessId,
        employeeId: employee.id,
        action: 'employee_checked_in',
        details: { time: employee.lastCheckIn }
      });

      // Try to assign waiting customers
      await assignmentService.checkFlowAndFlex(businessId);

      res.json({
        employee,
        token: jwt.sign(
          { 
            id: employee.id, 
            businessId,
            role: 'employee'
          },
          process.env.JWT_SECRET,
          { expiresIn: '8h' }
        )
      });
    } catch (error) {
      next(error);
    }
  }

  async checkOut(req, res, next) {
    try {
      const employeeId = req.user.id;

      const employee = await Employee.findByPk(employeeId);
      
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      employee.isAvailable = false;
      employee.lastCheckOut = new Date();
      await employee.save();

      await ActivityLog.create({
        businessId: employee.businessId,
        employeeId: employee.id,
        action: 'employee_checked_out',
        details: { time: employee.lastCheckOut }
      });

      res.json({ message: 'Checked out successfully' });
    } catch (error) {
      next(error);
    }
  }

  async regeneratePin(req, res, next) {
    try {
      const { employeeId } = req.params;
      const businessId = req.user.businessId;

      const employee = await Employee.findOne({
        where: { id: employeeId, businessId }
      });

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      employee.pin = pinGenerator.generate();
      await employee.save();

      await ActivityLog.create({
        businessId,
        employeeId: employee.id,
        action: 'pin_regenerated',
        details: { adminId: req.user.id }
      });

      res.json({ pin: employee.pin });
    } catch (error) {
      next(error);
    }
  }

  async toggleAvailability(req, res, next) {
    try {
      const { employeeId } = req.params;
      const { isAvailable } = req.body;
      const businessId = req.user.businessId;

      const employee = await Employee.findOne({
        where: { id: employeeId, businessId }
      });

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      employee.isAvailable = isAvailable;
      if (isAvailable) {
        employee.lastCheckIn = new Date();
      } else {
        employee.lastCheckOut = new Date();
      }
      await employee.save();

      await ActivityLog.create({
        businessId,
        employeeId: employee.id,
        action: isAvailable ? 'admin_checked_in_employee' : 'admin_checked_out_employee',
        details: { adminId: req.user.id }
      });

      res.json(employee);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeController();
