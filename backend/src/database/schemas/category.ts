import Joi from 'joi';
import { positiveInteger } from './general';

const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string(),
});

const updateCategorySchema = Joi.object({
  id: positiveInteger.required(),
  name: Joi.string(),
  color: Joi.string(),
}).min(2);

export {
  createCategorySchema,
  updateCategorySchema,
};
