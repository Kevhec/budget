// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`
      DELETE FROM budgets WHERE "isGeneral" = true;
    `);

    await queryInterface.removeColumn('budgets', 'isGeneral');
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('budgets', 'isGeneral', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
};
