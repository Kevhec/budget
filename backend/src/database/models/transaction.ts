import {
  Model,
  DataTypes,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import SequelizeConnection from '../config/SequelizeConnection';
import User from './user';
import Budget from './budget';
import Category from './category';
import CronTask from './cronTask';

const sequelize = SequelizeConnection.getInstance();

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum FrequencyType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

class Transaction
  extends Model<InferAttributes<Transaction>, InferCreationAttributes<Transaction>> {
  declare id: CreationOptional<string>;

  declare description: string;

  declare amount: number;

  declare date: Date;

  declare type: TransactionType;

  declare cronTaskId: ForeignKey<CronTask['id']> | null;

  declare userId: ForeignKey<User['id']>;

  declare categoryId: ForeignKey<Category['id']> | null;

  declare budgetId: ForeignKey<Budget['id']>;
}

Transaction.init({
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  description: {
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
  tableName: 'transactions',
  modelName: 'Transaction',
});

export default Transaction;
