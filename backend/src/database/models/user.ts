import { DataTypes, Model } from 'sequelize';
import SequelizeConnection from '../SequelizeConnection';

const sequelize = SequelizeConnection.getInstance();

export default class User extends Model {
  declare id: string;

  declare username: string;

  declare email: string;

  declare password: string;

  declare pagesCount: number;

  declare role: string;
}

User.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Invitado',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
    defaultValue: null,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  pagesCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'users',
  modelName: 'User',
});
