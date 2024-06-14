import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DATABASE_NAME || '';
const username = process.env.DATABASE_USERNAME || '';
const dbPassword = process.env.DATABASE_PASSWORD || '';

const sequelize = new Sequelize(
  dbName,
  username,
  dbPassword,
  {
    host: process.env.HOST,
    dialect: 'postgres',
  },
);

export default sequelize;
