import Joi from 'joi';
import { positiveInteger } from './general';

const createPageSchema = Joi.object({
  name: Joi.string().min(3).max(30),
});

const updatePageSchema = Joi.object({
  id: positiveInteger.required(),
  name: Joi.string().min(3).max(30),
}).min(2);

export {
  createPageSchema,
  updatePageSchema,
};
