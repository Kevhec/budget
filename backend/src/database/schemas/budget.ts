import Joi from 'joi';
import { recurrenceSchema } from './general';

const createBudgetSchema = Joi.object({
  name: Joi.string().required(),
  totalAmount: Joi.number().precision(2).positive(),
  startDate: Joi.date().required(),
  endDate: Joi.date(),
  recurrence: recurrenceSchema.optional(),
});

const updateBudgetSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().optional(),
  totalAmount: Joi.number().precision(2).positive().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  recurrence: recurrenceSchema.optional(),
}).min(2);

export {
  createBudgetSchema,
  updateBudgetSchema,
};
