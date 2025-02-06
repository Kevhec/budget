// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);
    const userId = crypto.randomUUID();

    await queryInterface.bulkInsert('users', [
      {
        id: userId,
        username: 'admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'user',
        token: null,
        confirmed: true,
        birthday: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        timezone: 'UTC',
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
