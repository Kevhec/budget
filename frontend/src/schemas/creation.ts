import { z } from 'zod';
import concurrenceSchema from './concurrence';

const TRANSACTION_TYPES = ['expense', 'income'] as const;

const transactionSchema = z.object({
  description: z
    .string()
    .min(1, {
      message: 'La descripción no puede estar vacía',
    })
    .max(50, {
      message: 'La descripción no puede exceder 50 caracteres.',
    }),
  amount: z
    .coerce
    .number()
    .positive(),
  date: z
    .date()
    .optional(),
  type: z
    .enum(TRANSACTION_TYPES),
  budgetId: z
    .string()
    .uuid()
    .optional(),
  categoryId: z
    .string()
    .uuid()
    .optional(),
});

const budgetSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'El nombre debe tener por lo menos dos caracteres',
    })
    .max(50, {
      message: 'El nombre no debe superar los 50 caracteres',
    }),
  totalAmount: z
    .coerce
    .number()
    .positive(),
  startDate: z
    .date(),
  endDate: z
    .date(),
  testPicker: z
    .date(),
}).merge(concurrenceSchema);

export {
  transactionSchema,
  budgetSchema,
};
