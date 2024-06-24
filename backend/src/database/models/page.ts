/* eslint-disable no-param-reassign */
import { DataTypes, ForeignKey, Model } from 'sequelize';
import SequelizeConnection from '../SequelizeConnection';
import User from './user';

const sequelize = SequelizeConnection.getInstance();

export default class Page extends Model {
  declare id: number;

  declare name: string;

  declare userId: ForeignKey<User['id']>;
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
}, {
  sequelize,
  timestamps: true,
  paranoid: true,
  tableName: 'pages',
  modelName: 'Page',
});
