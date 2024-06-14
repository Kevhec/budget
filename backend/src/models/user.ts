import {
  CreationOptional,
  DataTypes, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';
import sequelize from '../config/database';

export interface UserType extends Model<
InferAttributes<UserType>, InferCreationAttributes<UserType>
> {
  id: CreationOptional<number>
  username: CreationOptional<string>,
  email: CreationOptional<string>,
  password: CreationOptional<string>,
  pagesCount: CreationOptional<number>,
  role: CreationOptional<string>,
}

const User = sequelize.define<UserType>('User', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Invitado',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
    defaultValue: null,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  pagesCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
}, {
  tableName: 'users',
  timestamps: true,
});

export default User;
