import Joi from 'joi';
import { positiveInteger } from './general';
import { TransactionType } from '../models/transaction';

const createTransactionSchema = Joi.object({
  description: Joi.string().min(3).max(30).required(),
  amount: Joi.number().precision(2).positive().required(),
  date: Joi.date(),
  type: Joi.string().valid(...Object.values(TransactionType)).required(),
  budgetId: Joi.number().integer().positive(),
  categoryId: Joi.number().integer().positive(),
});

const updateTransactionSchema = Joi.object({
  id: positiveInteger.required(),
  description: Joi.string().min(3).max(30),
  amount: Joi.number().precision(2).positive(),
  type: Joi.string().valid(...Object.values(TransactionType)),
  date: Joi.date(),
  budgetId: Joi.number().integer().positive().required(),
  categoryId: Joi.number().integer().positive(),
}).min(2);

export {
  createTransactionSchema,
  updateTransactionSchema,
};
