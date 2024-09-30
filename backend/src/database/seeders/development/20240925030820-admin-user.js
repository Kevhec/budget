// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);
    const userId = crypto.randomUUID();
    const budgetId = crypto.randomUUID();

    await queryInterface.bulkInsert('users', [
      {
        id: userId,
        username: 'admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'user',
        token: null,
        confirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('budgets', [
      {
        id: budgetId,
        name: 'General',
        totalAmount: 0.00,
        userId,
        startDate: new Date(),
        endDate: null,
        isGeneral: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      username: 'admin',
      email: 'admin@admin.com',
    });
  },
};
