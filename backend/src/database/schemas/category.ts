import Joi from 'joi';
import { positiveInteger } from './general';

const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string(),
  limitAmount: Joi.number().precision(2).positive(),
  budgetId: positiveInteger.required(),
});

const updateCategorySchema = Joi.object({
  id: positiveInteger.required(),
  name: Joi.string(),
  color: Joi.string(),
  limitAmount: Joi.number().precision(2).positive(),
}).min(2);

export {
  createCategorySchema,
  updateCategorySchema,
};
