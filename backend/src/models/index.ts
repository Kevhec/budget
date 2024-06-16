import Budget from './budget';
import Expense from './expense';
import Page from './page';
import User from './user';

// Associate user with all of the other models
// so they can be protected by auth
User.hasMany(Page);
User.hasMany(Budget);
User.hasMany(Expense);

Page.belongsTo(User);
Budget.belongsTo(User);
Expense.belongsTo(User);

// Each page can have many budgets
// but one budget can belong to only one page
Page.hasMany(Budget);
Budget.belongsTo(Page);

// One budget has many expenses
// but any expense can only have one associated budget
Budget.hasMany(Expense);
Expense.belongsTo(Budget);

export {
  Budget,
  Expense,
  User,
  Page,
};
