import Joi from 'joi';
import { positiveInteger } from './general';

const createBudgetSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  amount: Joi.number().precision(2).positive(),
  pageId: positiveInteger.required(),
});

const getAndDeleteBudgetSchema = Joi.object({
  id: positiveInteger.required(),
});

const updateBudgetSchema = Joi.object({
  id: positiveInteger.required(),
  name: Joi.string().min(3).max(30),
  amount: Joi.number().precision(2).positive(),
}).min(2);

export {
  createBudgetSchema,
  updateBudgetSchema,
  getAndDeleteBudgetSchema,
};
