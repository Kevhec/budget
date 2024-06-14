import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Expense = sequelize.define('Expense', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Date.now(),
  },
}, {
  tableName: 'expenses',
  timestamps: true,
});

export default Expense;
