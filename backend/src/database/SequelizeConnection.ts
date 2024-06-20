import { Dialect, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

class SequelizeConnection {
  private static instance: Sequelize;

  private constructor() {
    const dbName = process.env.DB_NAME || '';
    const dbUser = process.env.DB_USERNAME || '';
    const dbHost = process.env.DB_HOST;
    const dbDriver = process.env.DB_DRIVER as Dialect;
    const dbPassword = process.env.DB_PASSWORD || '';

    SequelizeConnection.instance = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      dialect: dbDriver,
    });

    SequelizeConnection.instance.authenticate().then(() => {
      console.log('Sequelize connected');
    });
  }

  public static getInstance(): Sequelize {
    if (!SequelizeConnection.instance) {
      // eslint-disable-next-line no-new
      new SequelizeConnection();
    }

    return SequelizeConnection.instance;
  }
}

export default SequelizeConnection;
