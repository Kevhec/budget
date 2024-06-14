import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Budget = sequelize.define('Budget', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'budgets',
});

export default Budget;
