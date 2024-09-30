// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('categories', 'isDefault', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.sequelize.query(
      'UPDATE "categories" SET "isDefault" = :newValue',
      {
        replacements: { newValue: true },
      },
    );
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('categories', 'isDefault');
  },
};
