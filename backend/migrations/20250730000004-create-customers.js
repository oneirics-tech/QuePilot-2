'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Customers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      businessId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Businesses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: true
      },
      queueNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('waiting', 'assigned', 'in_progress', 'completed', 'auto_closed'),
        defaultValue: 'waiting'
      },
      assignedEmployeeId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Employees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      currentWorkflowStep: {
        type: Sequelize.STRING,
        defaultValue: 'check_in'
      },
      checkInTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      assignmentTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      readyTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      completionTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      completedBy: {
        type: Sequelize.ENUM('employee', 'auto_closed'),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('Customers', ['businessId']);
    await queryInterface.addIndex('Customers', ['status']);
    await queryInterface.addIndex('Customers', ['assignedEmployeeId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Customers');
  }
};
