import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

function validateSchema(schema: z.Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { success, error } = schema.safeParse({ ...req.body, ...req.params, ...req.query });

    if (!success && error) {
      const errorMessages = error.errors.map((err) => err.message);
      return res.status(400).json(errorMessages);
    }

    return next();
  };
}

export default validateSchema;
