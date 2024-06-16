import Joi from 'joi';

const expenseSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  amount: Joi.number().positive().required(),
  date: Joi.date(),
  budgetId: Joi.number().integer().positive(),
});

export default expenseSchema;
