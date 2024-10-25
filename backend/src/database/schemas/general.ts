import { OccurrenceType, WeekDays } from '@/src/lib/types';
import Joi from 'joi';

const positiveInteger = Joi.number().positive();

const getObjectByUUID = Joi.object({
  id: Joi.string().guid().required(),
});

const recurrenceSchema = Joi.object({
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
});

export {
  positiveInteger,
  getObjectByUUID,
  recurrenceSchema,
};
