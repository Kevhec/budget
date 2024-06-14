import Budget from './budget';
import Expense from './expense';
import Page from './page';
import User from './user';

// One user can have many pages
// but one page can only belong to one user
User.hasMany(Page);
Page.belongsTo(User);

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
