import { DataTypes, ForeignKey, Model } from 'sequelize';
import SequelizeConnection from '../SequelizeConnection';
import User from './user';
import Budget from './budget';

const sequelize = SequelizeConnection.getInstance();

export default class Expense extends Model {
  declare id: number;

  declare name: string;

  declare amount: number;

  declare date: Date;

  declare UserId: ForeignKey<User['id']>;

  declare BudgetId: ForeignKey<Budget['id']>;
}

Expense.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Date.now(),
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'expenses',
  modelName: 'Expense',
});
