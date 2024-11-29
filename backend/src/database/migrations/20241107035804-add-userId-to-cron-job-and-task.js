// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('cron-jobs', 'userId', {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: '842c6e39-6ff6-4e97-b0cf-2db50f818ebe',
    });

    await queryInterface.addConstraint('cron-jobs', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'cronjobs_userId',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
    });

    await queryInterface.addColumn('cron-tasks', 'userId', {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: '842c6e39-6ff6-4e97-b0cf-2db50f818ebe',
    });

    await queryInterface.addConstraint('cron-tasks', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'crontasks_userId',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('cron-jobs', 'cronjobs_userId');
    await queryInterface.removeConstraint('cron-tasks', 'crontasks_userId');

    await queryInterface.removeColumn('cron-jobs', 'userId');
    await queryInterface.removeColumn('cron-tasks', 'userId');
  },
};
