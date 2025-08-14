import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string()
    .min(1)
    .max(16)
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string()
    .min(1)
    .max(16)
    .pattern(/^\+?[1-9]\d{1,14}$/),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
}).min(1);
