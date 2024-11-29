import {
  Model,
  DataTypes,
  type CreationOptional,
  type ForeignKey,
  type HasManyGetAssociationsMixin,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import SequelizeConnection from '../config/SequelizeConnection';
import type CronJob from './cronJobs';
import User from './user';

const sequelize = SequelizeConnection.getInstance();

class CronTask extends Model<InferAttributes<CronTask>, InferCreationAttributes<CronTask>> {
  declare id: CreationOptional<string>;

  declare cronExpression: CreationOptional<string>;

  declare timezone: CreationOptional<string>;

  declare endDate: CreationOptional<Date | null>;

  declare isFinished: CreationOptional<boolean>;

  declare getCronJobs: HasManyGetAssociationsMixin<CronJob>;

  declare cronJobs?: CronJob[];

  declare userId: ForeignKey<User['id']>;
}

CronTask.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  cronExpression: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '* * * * *',
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  isFinished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'cron-tasks',
  modelName: 'CronTask',
});

export default CronTask;
