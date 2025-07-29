// backend/src/models/Workflow.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Workflow = sequelize.define('Workflow', {
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
  steps: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [
      { id: 'check_in', name: 'Check-In', order: 1 },
      { id: 'assigned', name: 'Assigned', order: 2, required: true },
      { id: 'checkout', name: 'Checkout', order: 3 }
    ]
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Workflow;
