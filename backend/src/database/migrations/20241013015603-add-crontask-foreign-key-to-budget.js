// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('budgets', 'cronTaskId', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.addConstraint('budgets', {
      fields: ['cronTaskId'],
      type: 'foreign key',
      name: 'budgets_cronTaskId',
      references: {
        table: 'cron-tasks',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('budgets', 'budgets_cronTaskId');

    await queryInterface.removeColumn('budgets', 'cronTaskId');
  },
};
