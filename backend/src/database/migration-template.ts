import { QueryInterface, DataTypes, QueryTypes } from 'sequelize';

/** @type {import("sequelize-cli").Migration} */
export default {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {

    },
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {

    },
  ),
};
