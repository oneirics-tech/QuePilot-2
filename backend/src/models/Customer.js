// backend/src/models/Customer.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  businessId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Businesses',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  queueNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('waiting', 'assigned', 'in_progress', 'completed', 'auto_closed'),
    defaultValue: 'waiting'
  },
  assignedEmployeeId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Employees',
      key: 'id'
    }
  },
  currentWorkflowStep: {
    type: DataTypes.STRING,
    defaultValue: 'check_in'
  },
  checkInTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  assignmentTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  readyTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completionTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedBy: {
    type: DataTypes.ENUM('employee', 'auto_closed'),
    allowNull: true
  }
});

module.exports = Customer;
