import Joi from 'joi';
import { positiveInteger } from './general';

const createPageSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  initialAmount: Joi.number().precision(2).positive(),
});

const getAndDeletePageSchema = Joi.object({
  id: positiveInteger.required(),
});

const updatePageSchema = Joi.object({
  id: positiveInteger.required(),
  name: Joi.string().min(3).max(30),
  initialAmount: Joi.number().precision(2).positive(),
}).min(2);

export {
  createPageSchema,
  getAndDeletePageSchema,
  updatePageSchema,
};
