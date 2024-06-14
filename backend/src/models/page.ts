/* eslint-disable no-param-reassign */
import {
  DataTypes, type CreationOptional, type Model, type InferAttributes, type InferCreationAttributes,
} from 'sequelize';
import sequelize from '../config/database';

interface PageType extends Model<InferAttributes<PageType>, InferCreationAttributes<PageType>> {
  id: CreationOptional<number>
  name: CreationOptional<string>,
}

const Page = sequelize.define<PageType>('Page', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Page',
  },
}, {
  tableName: 'pages',
  timestamps: true,
});

export default Page;
