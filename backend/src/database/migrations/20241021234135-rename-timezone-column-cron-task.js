// eslint-disable-next-line @typescript-eslint/no-var-requires
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn('cron-tasks', 'timeZone', 'timezone');
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn('cron-tasks', 'timezone', 'timeZone');
  },
};
