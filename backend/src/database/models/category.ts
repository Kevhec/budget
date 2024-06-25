import {
  CreationOptional,
  DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';
import SequelizeConnection from '../SequelizeConnection';
import User from './user';

const sequelize = SequelizeConnection.getInstance();

class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: CreationOptional<number>;

  declare name: string;

  declare color: string;

  declare userId: ForeignKey<User['id']>;
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

export default Category;
