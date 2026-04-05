const Joi = require('joi');

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
  role: Joi.string().valid('VIEWER', 'ANALYST', 'ADMIN').optional()
}).min(1);

const createUserByAdminSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('VIEWER', 'ANALYST', 'ADMIN').optional().default('VIEWER'),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional().default('ACTIVE')
});

module.exports = { updateUserSchema, createUserByAdminSchema };
