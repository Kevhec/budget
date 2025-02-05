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

enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
  GENERAL = 'general',
}

const sequelize = SequelizeConnection.getInstance();

// TODO: Limitar categorías a 10
class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: CreationOptional<string>;

  declare name: string;

  declare color: string;

  declare isDefault: boolean;

  declare type: CategoryType;

  declare userId: ForeignKey<User['id']>;
}

Category.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#000000',
  },
  type: {
    type: DataTypes.ENUM(...Object.values(CategoryType)),
    allowNull: false,
    defaultValue: CategoryType.GENERAL,
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'categories',
  modelName: 'Category',
});

export default Category;
