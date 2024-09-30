import Joi from 'joi';
import { TransactionType } from '../models/transaction';

const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

const createTransactionSchema = Joi.object({
  description: Joi.string().min(3).max(30).required(),
  amount: Joi.number().precision(2).positive().required(),
  date: Joi.date(),
  type: Joi.string().valid(...Object.values(TransactionType)).required(),
  budgetId: Joi.string().guid(),
  categoryId: Joi.string().guid(),
});

const updateTransactionSchema = Joi.object({
  id: Joi.string().guid().required(),
  description: Joi.string().min(3).max(30),
  amount: Joi.number().precision(2).positive(),
  type: Joi.string().valid(...Object.values(TransactionType)),
  date: Joi.date(),
  budgetId: Joi.string().guid(),
  categoryId: Joi.string().guid(),
}).min(2);

const getBalanceSchema = Joi.object({
  from: Joi.string().pattern(dateRegex).optional(),
  to: Joi.string().pattern(dateRegex).optional(),
});

export {
  createTransactionSchema,
  updateTransactionSchema,
  getBalanceSchema,
};
