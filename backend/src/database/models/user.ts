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

  declare confirmed: boolean;

  declare token: string;
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
    defaultValue: 1,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
  token: {
    type: DataTypes.UUID,
    allowNull: true,
    defaultValue: DataTypes.UUIDV4,
  },
  confirmed: {
    type: DataTypes.BOOLEAN,
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
}, {
  sequelize,
  timestamps: true,
  tableName: 'users',
  modelName: 'User',
});
