import Joi from 'joi';

const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string(),
});

const updateCategorySchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string(),
  color: Joi.string(),
}).min(2);

export {
  createCategorySchema,
  updateCategorySchema,
};
