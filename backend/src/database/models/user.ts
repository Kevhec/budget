import {
  CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';
import SequelizeConnection from '../SequelizeConnection';
import Budget from './budget';

const sequelize = SequelizeConnection.getInstance();

export default class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;

  declare username: string;

  declare email: string;

  declare password: string;

  declare role: string;

  declare confirmed: boolean;

  declare token: string | null;
}

User.init({
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
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
  token: {
    type: DataTypes.UUID,
    allowNull: true,
    defaultValue: DataTypes.UUIDV4,
  },
  confirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    set(value: boolean) {
      if (this.getDataValue('role') === 'guest') {
        this.setDataValue('confirmed', true);
      } else {
        this.setDataValue('confirmed', value);
      }
    },
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'users',
  modelName: 'User',
  hooks: {
    afterCreate: async (user) => {
      await Budget.create({
        name: 'General',
        isGeneral: true,
        userId: user.id,
      });
    },
  },
});
