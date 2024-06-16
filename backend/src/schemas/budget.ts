import Joi from 'joi';

const budgetSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  pageId: Joi.number().integer().positive().required(),
});

export default budgetSchema;
