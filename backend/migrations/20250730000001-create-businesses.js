'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Businesses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      primaryColor: {
        type: Sequelize.STRING,
        defaultValue: '#4F46E5'
      },
      secondaryColor: {
        type: Sequelize.STRING,
        defaultValue: '#10B981'
      },
      fontFamily: {
        type: Sequelize.STRING,
        defaultValue: 'Inter'
      },
      assignmentMode: {
        type: Sequelize.ENUM('stick_and_serve', 'flow_and_flex'),
        defaultValue: 'stick_and_serve'
      },
      allowMultipleCustomers: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      settings: {
        type: Sequelize.JSONB,
        defaultValue: {}
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Businesses');
  }
};
