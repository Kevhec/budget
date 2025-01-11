// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.bulkUpdate(
      'categories',
      {
        isDefault: true,
      },
      {
        isDefault: false,
      },
    );
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.bulkUpdate(
      'categories',
      {
        isDefault: false,
      },
      {
        isDefault: true,
      },
    );
  },
};
