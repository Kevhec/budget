import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import SequelizeConnection from '../config/SequelizeConnection';
import type User from './user';
import CronTask from './cronTask';

const sequelize = SequelizeConnection.getInstance();

class Budget extends Model<InferAttributes<Budget>, InferCreationAttributes<Budget>> {
  declare id: CreationOptional<string>;

  declare name: string;

  declare totalAmount: CreationOptional<number>;

  declare startDate: CreationOptional<Date>;

  declare endDate: CreationOptional<Date>;

  declare cronTaskId: ForeignKey<CronTask['id']> | null;

  declare userId: ForeignKey<User['id']>;
}

Budget.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Budget',
  },
  totalAmount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'budgets',
  modelName: 'Budget',
});

export default Budget;
