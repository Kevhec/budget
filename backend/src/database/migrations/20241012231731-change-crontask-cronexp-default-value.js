// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('cron-tasks', 'cronExpression', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '* * * * *',
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('cron-tasks', 'cronExpression', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Budget',
    });
  },
};
