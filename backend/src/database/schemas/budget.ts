import Joi from 'joi';
import { positiveInteger } from './general';

const createBudgetSchema = Joi.object({
  initialBalance: Joi.number().precision(2).positive(),
  pageId: positiveInteger.required(),
});

const updateBudgetSchema = Joi.object({
  id: positiveInteger.required(),
  initialBalance: Joi.number().precision(2).positive(),
}).min(2);

export {
  createBudgetSchema,
  updateBudgetSchema,
};
