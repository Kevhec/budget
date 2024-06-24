import { DataTypes, ForeignKey, Model } from 'sequelize';
import SequelizeConnection from '../SequelizeConnection';
import User from './user';
import Budget from './budget';

const sequelize = SequelizeConnection.getInstance();

export default class Category extends Model {
  declare id: number;

  declare name: string;

  declare limitAmount: string;

  declare color: string;

  declare UserId: ForeignKey<User['id']>;

  declare BudgetId: ForeignKey<Budget['id']>;
}

Category.init({
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
  limitAmount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#000000',
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'categories',
  modelName: 'Category',
});
