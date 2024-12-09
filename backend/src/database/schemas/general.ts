import { CONCURRENCE_TYPE, DEFAULT_CONCURRENCES, WEEKDAYS } from '@/src/lib/constants';
import { z } from 'zod';

const positiveInteger = z.number().positive();

const getObjectByUUID = z.object({
  id: z.string().uuid(),
});

const getTokenUUID = z.object({
  token: z.string().uuid(),
});

const concurrenceSchema = z.object({
  default: z
    .enum(DEFAULT_CONCURRENCES),
  type: z
    .enum(CONCURRENCE_TYPE),
  steps: z
    .coerce
    .number()
    .int()
    .positive(),
  withEndDate: z
    .enum(['true', 'false']),
  endDate: z
    .date()
    .optional(),
  weekDay: z
    .enum(WEEKDAYS),
  time: z
    .date(),
  monthSelect: z
    .enum(['exact', 'ordinal']),
});

export {
  positiveInteger,
  getTokenUUID,
  getObjectByUUID,
  concurrenceSchema,
};
