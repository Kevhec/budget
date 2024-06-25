import Joi from 'joi';
import { positiveInteger } from './general';

const createBudgetSchema = Joi.object({
  name: Joi.string().required(),
  totalAmount: Joi.number().precision(2).positive(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});

const updateBudgetSchema = Joi.object({
  id: positiveInteger.required(),
  name: Joi.string(),
  totalAmount: Joi.number().precision(2).positive(),
  startDate: Joi.date(),
  endDate: Joi.date(),
}).min(2);

export {
  createBudgetSchema,
  updateBudgetSchema,
};
