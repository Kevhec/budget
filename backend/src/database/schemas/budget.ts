import { OccurrenceType, WeekDays } from '@/src/lib/types';
import Joi from 'joi';

const createBudgetSchema = Joi.object({
  name: Joi.string().required(),
  totalAmount: Joi.number().precision(2).positive(),
  startDate: Joi.date().required(),
  endDate: Joi.date(),
  recurrence: Joi.object({
    concurrence: Joi.object({
      type: Joi.string().valid(...Object.values(OccurrenceType)),
      steps: Joi.number(),
    }),
    weekDay: Joi.object({
      value: Joi.string().valid(...Object.values(WeekDays)).optional(),
      ordinal: Joi.string().valid('first', 'second', 'third', 'fourth', 'fifth').optional(),
    }),
    time: Joi.object({
      hour: Joi.number().integer().min(0).max(23),
      minute: Joi.number().integer().min(0).max(59),
      timezone: Joi.string().optional(),
    }).optional(),
    endDate: Joi.date().optional(),
  }).optional(),
});

const updateBudgetSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().optional(),
  totalAmount: Joi.number().precision(2).positive().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  recurrence: Joi.object({
    concurrence: Joi.object({
      type: Joi.string().valid(...Object.values(OccurrenceType)),
      steps: Joi.number(),
    }),
    weekDay: Joi.string().valid(...Object.values(WeekDays)).optional(),
    time: Joi.object({
      hour: Joi.number().integer().min(0).max(23),
      minute: Joi.number().integer().min(0).max(59),
    }).optional(),
    endDate: Joi.date().optional(),
  }).optional(),
}).min(2);

export {
  createBudgetSchema,
  updateBudgetSchema,
};
