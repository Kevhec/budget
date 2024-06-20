import Joi from 'joi';

const positiveInteger = Joi.number().positive();

const getObjectById = Joi.object({
  id: positiveInteger.required(),
});

export {
  positiveInteger,
  getObjectById,
};
