import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import {
  ConcurrenceType, DefaultConcurrences, MonthSelect, WeekDays, WithEndDate,
} from '@/src/lib/types';
import { format } from '@formkit/tempo';
import SequelizeConnection from '../config/SequelizeConnection';
import type User from './user';

const sequelize = SequelizeConnection.getInstance();

// TODO: Define relationship foreign key with transaction or budget

class Concurrence extends Model<
InferAttributes<Concurrence>,
InferCreationAttributes<Concurrence>
> {
  declare id: CreationOptional<string>;

  declare default: CreationOptional<DefaultConcurrences>;

  declare type: CreationOptional<ConcurrenceType>;

  declare steps: CreationOptional<number>;

  declare endDate: CreationOptional<Date>;

  declare withEndDate: CreationOptional<WithEndDate>;

  declare weekDay: CreationOptional<WeekDays>;

  declare time: CreationOptional<Date>;

  declare monthSelect: CreationOptional<MonthSelect>;

  declare userId: ForeignKey<User['id']>;
}

Concurrence.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  default: {
    type: DataTypes.ENUM(...Object.values(DefaultConcurrences)),
    defaultValue: DefaultConcurrences.NONE,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(...Object.values(ConcurrenceType)),
    defaultValue: ConcurrenceType.DAILY,
    allowNull: false,
  },
  steps: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    defaultValue: null,
    allowNull: true,
  },
  withEndDate: {
    type: DataTypes.ENUM(...Object.values(WithEndDate)),
    defaultValue: WithEndDate.FALSE,
    allowNull: false,
  },
  weekDay: {
    type: DataTypes.ENUM(...Object.values(WeekDays)),
    defaultValue: format(new Date(), 'dddd', 'en').toLowerCase(),
    allowNull: false,
  },
  time: {
    type: DataTypes.DATE,
    defaultValue: new Date(),
    allowNull: false,
  },
  monthSelect: {
    type: DataTypes.ENUM(...Object.values(MonthSelect)),
    defaultValue: MonthSelect.EXACT,
    allowNull: false,
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'concurrences',
  modelName: 'Concurrence',
});

export default Concurrence;
