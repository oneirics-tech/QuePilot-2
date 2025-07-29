const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Business = sequelize.define('Business', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  primaryColor: {
    type: DataTypes.STRING,
    defaultValue: '#4F46E5'
  },
  secondaryColor: {
    type: DataTypes.STRING,
    defaultValue: '#10B981'
  },
  fontFamily: {
    type: DataTypes.STRING,
    defaultValue: 'Inter'
  },
  assignmentMode: {
    type: DataTypes.ENUM('stick_and_serve', 'flow_and_flex'),
    defaultValue: 'stick_and_serve'
  },
  allowMultipleCustomers: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
});

module.exports = Business;
