import { z } from 'zod';

const TYPES = ['expense', 'income'] as const;

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
    .enum(TYPES),
  budgetId: z
    .coerce
    .number()
    .int()
    .optional(),
  categoryId: z
    .coerce
    .number()
    .int()
    .optional(),
});

export default transactionSchema;
