'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Workflows', {
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
      steps: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [
          { id: 'check_in', name: 'Check-In', order: 1 },
          { id: 'assigned', name: 'Assigned', order: 2, required: true },
          { id: 'checkout', name: 'Checkout', order: 3 }
        ]
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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

    await queryInterface.addIndex('Workflows', ['businessId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Workflows');
  }
};
