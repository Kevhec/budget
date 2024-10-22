// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('cron-tasks', 'endDate', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('cron-tasks', 'endDate', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date(),
    });
  },
};
