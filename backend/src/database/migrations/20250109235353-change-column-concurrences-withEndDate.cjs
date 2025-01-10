// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('concurrences', 'withEndDate');

    await queryInterface.addColumn('concurrences', 'withEndDate', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('concurrences', 'withEndDate');

    await queryInterface.addColumn('concurrences', 'withEndDate', {
      type: Sequelize.ENUM('true', 'false'),
      allowNull: false,
      defaultValue: 'false',
    });
  },
};
