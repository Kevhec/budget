import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

function validateSchema(schema: Joi.ObjectSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate({ ...req.body, ...req.params });

    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    return next();
  };
}

export default validateSchema;
