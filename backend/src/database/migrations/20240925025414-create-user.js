/* eslint-disable @typescript-eslint/no-var-requires */
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Invitado',
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
        defaultValue: null,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user',
      },
      token: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: Sequelize.UUIDV4,
      },
      confirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        set(value) {
          if (this.getDataValue('role') === 'guest') {
            this.setDataValue('confirmed', true);
          } else {
            this.setDataValue('confirmed', value);
          }
        },
      },
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('Users');
  },
};
