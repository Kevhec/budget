import {
  CreationOptional,
  DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';
import SequelizeConnection from '../config/SequelizeConnection';
import type User from './user';

const sequelize = SequelizeConnection.getInstance();

class Budget extends Model<InferAttributes<Budget>, InferCreationAttributes<Budget>> {
  declare id: CreationOptional<number>;

  declare name: string;

  declare totalAmount: CreationOptional<string>;

  declare startDate: CreationOptional<Date>;

  declare endDate: CreationOptional<Date>;

  declare isGeneral: CreationOptional<boolean>;

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
    allowNull: true,
    defaultValue: null,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  isGeneral: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'budgets',
  modelName: 'Budget',
});

export default Budget;
