// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('transactions', 'concurrenceId', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addConstraint('transactions', {
      fields: ['concurrenceId'],
      type: 'foreign key',
      name: 'transactions_concurrenceId',
      references: {
        table: 'concurrences',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('transactions', 'transactions_concurrenceId');
    await queryInterface.removeColumn('transactions', 'concurrenceId');
  },
};
