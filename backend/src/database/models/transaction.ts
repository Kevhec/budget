import { DataTypes, ForeignKey, Model } from 'sequelize';
import SequelizeConnection from '../SequelizeConnection';
import User from './user';
import Budget from './budget';
import Category from './category';

const sequelize = SequelizeConnection.getInstance();

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export default class Transaction extends Model {
  declare id: number;

  declare name: string;

  declare amount: number;

  declare date: Date;

  declare type: TransactionType;

  declare categoryId: ForeignKey<Category['id']> | null;

  declare userId: ForeignKey<User['id']>;

  declare budgetId: ForeignKey<Budget['id']>;
}

Transaction.init({
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
  type: {
    type: DataTypes.ENUM(...Object.values(TransactionType)),
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
