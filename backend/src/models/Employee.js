// backend/src/models/Employee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
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
  initials: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  pin: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastCheckIn: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastCheckOut: {
    type: DataTypes.DATE,
    allowNull: true
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  activeCustomerCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Employee;
