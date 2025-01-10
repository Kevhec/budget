// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn('concurrences', 'default', 'defaults');
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn('concurrences', 'defaults', 'default');
  },
};
