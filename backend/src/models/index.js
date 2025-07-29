// backend/src/models/index.js
const Business = require('./Business');
const Admin = require('./Admin');
const Employee = require('./Employee');
const Customer = require('./Customer');
const Workflow = require('./Workflow');
const ActivityLog = require('./ActivityLog');

// Define associations
Business.hasMany(Admin, { foreignKey: 'businessId' });
Business.hasMany(Employee, { foreignKey: 'businessId' });
Business.hasMany(Customer, { foreignKey: 'businessId' });
Business.hasMany(Workflow, { foreignKey: 'businessId' });
Business.hasMany(ActivityLog, { foreignKey: 'businessId' });

Admin.belongsTo(Business, { foreignKey: 'businessId' });
Employee.belongsTo(Business, { foreignKey: 'businessId' });
Customer.belongsTo(Business, { foreignKey: 'businessId' });
Customer.belongsTo(Employee, { foreignKey: 'assignedEmployeeId', as: 'assignedEmployee' });
Workflow.belongsTo(Business, { foreignKey: 'businessId' });
ActivityLog.belongsTo(Business, { foreignKey: 'businessId' });
ActivityLog.belongsTo(Customer, { foreignKey: 'customerId' });
ActivityLog.belongsTo(Employee, { foreignKey: 'employeeId' });

module.exports = {
  Business,
  Admin,
  Employee,
  Customer,
  Workflow,
  ActivityLog
};
