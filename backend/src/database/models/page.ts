/* eslint-disable no-param-reassign */
import { DataTypes, ForeignKey, Model } from 'sequelize';
import SequelizeConnection from '../SequelizeConnection';
import User from './user';

const sequelize = SequelizeConnection.getInstance();

export default class Page extends Model {
  declare id: number;

  declare name: string;

  declare initialAmount: number;

  declare UserId: ForeignKey<User['id']>;
}

Page.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Page',
  },
  initialAmount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'pages',
  modelName: 'Page',
});
