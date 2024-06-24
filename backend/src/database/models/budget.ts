import { DataTypes, ForeignKey, Model } from 'sequelize';
import SequelizeConnection from '../SequelizeConnection';
import User from './user';
import Page from './page';

const sequelize = SequelizeConnection.getInstance();

export default class Budget extends Model {
  declare id: number;

  declare initialBalance: string;

  declare currentBalance: string;

  declare UserId: ForeignKey<User['id']>;

  declare PageId: ForeignKey<Page['id']>;
}

Budget.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  initialBalance: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  currentBalance: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'budgets',
  modelName: 'Budget',
});
