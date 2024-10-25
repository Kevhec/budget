import Budget from './budget';
import Transaction from './transaction';
import Page from './page';
import User from './user';
import Category from './category';
import CronTask from './cronTask';
import CronJob from './cronJobs';

// Associate user with all of the other models
// so they can be protected by auth
User.hasMany(Page, { foreignKey: 'userId' });
User.hasMany(Budget, { foreignKey: 'userId' });
User.hasMany(Transaction, { foreignKey: 'userId' });
User.hasMany(Category, { foreignKey: 'userId' });

Page.belongsTo(User, { foreignKey: 'userId' });
Budget.belongsTo(User, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });
Category.belongsTo(User, { foreignKey: 'userId' });

// Each page can have only one budget
/* Page.hasOne(Budget, { foreignKey: 'pageId' });
Budget.belongsTo(Page, { foreignKey: 'pageId' }); */

// One budget has many transactions
Budget.hasMany(Transaction, { foreignKey: 'budgetId' });
Transaction.belongsTo(Budget, { foreignKey: 'budgetId', as: 'budget' });

CronTask.hasOne(Budget, { foreignKey: 'cronTaskId' });
CronTask.hasOne(Transaction, { foreignKey: 'cronTaskId' });

Budget.belongsTo(CronTask, { foreignKey: 'cronTaskId', as: 'cronTask' });
Transaction.belongsTo(CronTask, { foreignKey: 'cronTaskId', as: 'cronTask' });

CronTask.hasMany(CronJob, { foreignKey: 'cronTaskId', as: 'cronJobs' });
CronJob.belongsTo(CronTask, { foreignKey: 'cronTaskId', as: 'cronTask' });

// One category can have many transactions
// but a transaction can have only one category
Category.hasMany(Transaction, { foreignKey: 'categoryId' });
Transaction.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

export {
  User,
  Page,
  Budget,
  Category,
  Transaction,
};
