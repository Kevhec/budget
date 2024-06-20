import Joi from 'joi';
import { positiveInteger } from './general';

const createExpenseSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  amount: Joi.number().precision(2).positive().required(),
  date: Joi.date(),
  budgetId: Joi.number().integer().positive(),
});

const getAndDeleteExpenseSchema = Joi.object({
  id: positiveInteger.required(),
});

const updateExpenseSchema = Joi.object({
  id: positiveInteger.required(),
  name: Joi.string().min(3).max(30),
  amount: Joi.number().precision(2).positive(),
  date: Joi.date(),
  budgetId: Joi.number().integer().positive(),
});

export {
  createExpenseSchema,
  getAndDeleteExpenseSchema,
  updateExpenseSchema,
};
