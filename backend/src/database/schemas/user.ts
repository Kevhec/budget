import Joi from 'joi';

const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  birthday: Joi.date().required(),
  password: Joi.string()
    .pattern(/^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),
  repeatPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Las contraseñas deben coincidir',
    }),
}).with('password', 'repeatPassword');

const guestSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
});

export {
  userSchema,
  guestSchema,
};
