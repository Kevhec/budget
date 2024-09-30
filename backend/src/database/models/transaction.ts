import {
  CreationOptional,
  DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';
import SequelizeConnection from '../config/SequelizeConnection';
import User from './user';
import Budget from './budget';
import Category from './category';

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
  declare id: CreationOptional<number>;

  declare description: string;

  declare amount: number;

  declare date: Date;

  declare type: TransactionType;

  /*   declare frequency: FrequencyType;

  declare endDate: Date; */

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
/*   frequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  }, */
}, {
  sequelize,
  timestamps: true,
  tableName: 'transactions',
  modelName: 'Transaction',
  hooks: {
    beforeCreate: async (transaction) => {
      const generalBudget = await Budget.findOne({
        where: {
          userId: transaction.userId,
          isGeneral: true,
        },
      });

      if (!generalBudget) {
        throw new Error('No general budget found for the current user');
      }

      // eslint-disable-next-line no-param-reassign
      transaction.budgetId = generalBudget.id;
    },
  },
});

export default Transaction;
