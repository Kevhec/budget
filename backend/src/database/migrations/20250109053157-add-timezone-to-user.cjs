// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'timezone', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.sequelize.query(
      "UPDATE users SET timezone = 'UTC' WHERE timezone IS NULL;",
    );

    await queryInterface.changeColumn('users', 'timezone', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'timezone');
  },
};
