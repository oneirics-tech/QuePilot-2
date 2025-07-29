// backend/src/services/analytics.service.js
const { Customer, Employee, ActivityLog } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

class AnalyticsService {
  async getWaitTimeStats(businessId, date = new Date()) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const customers = await Customer.findAll({
      where: {
        businessId,
        checkInTime: {
          [Op.between]: [startOfDay, endOfDay]
        },
        readyTime: {
          [Op.not]: null
        }
      }
    });

    if (customers.length === 0) {
      return {
        averageWaitTime: 0,
        longestWaitTime: 0,
        shortestWaitTime: 0,
        totalCustomers: 0
      };
    }

    const waitTimes = customers.map(c => 
      (c.readyTime - c.checkInTime) / 60000 // Convert to minutes
    );

    return {
      averageWaitTime: Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length),
      longestWaitTime: Math.round(Math.max(...waitTimes)),
      shortestWaitTime: Math.round(Math.min(...waitTimes)),
      totalCustomers: customers.length
    };
  }

  async getEmployeeStats(businessId, date = new Date()) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const employeeStats = await Employee.findAll({
      where: { businessId },
      attributes: [
        'id',
        'name',
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM "Customers"
            WHERE "assignedEmployeeId" = "Employee"."id"
            AND "completionTime" BETWEEN '${startOfDay.toISOString()}' AND '${endOfDay.toISOString()}'
            AND "completedBy" = 'employee'
          )`),
          'customersServed'
        ]
      ]
    });

    return employeeStats;
  }

  async getHourlyDistribution(businessId, date = new Date()) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const customers = await Customer.findAll({
      where: {
        businessId,
        checkInTime: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      attributes: [
        [sequelize.fn('date_part', 'hour', sequelize.col('checkInTime')), 'hour'],
        [sequelize.fn('count', '*'), 'count']
      ],
      group: ['hour'],
      order: [['hour', 'ASC']]
    });

    return customers;
  }
}

module.exports = new AnalyticsService();
