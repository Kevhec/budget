import Joi from 'joi';

const positiveInteger = Joi.number().positive();

const getObjectByUUID = Joi.object({
  id: Joi.string().guid().required(),
});

export {
  positiveInteger,
  getObjectByUUID,
};
