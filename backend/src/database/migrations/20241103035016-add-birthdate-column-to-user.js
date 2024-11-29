// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'birthday', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date(),
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'birthday');
  },
};
