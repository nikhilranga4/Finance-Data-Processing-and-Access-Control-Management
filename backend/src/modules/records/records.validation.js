const Joi = require('joi');

const createRecordSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'Amount must be positive',
    'number.precision': 'Amount must have at most 2 decimal places',
    'any.required': 'Amount is required'
  }),
  type: Joi.string().valid('INCOME', 'EXPENSE').required().messages({
    'any.only': 'Type must be INCOME or EXPENSE',
    'any.required': 'Type is required'
  }),
  category: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Category must be at least 2 characters',
    'string.max': 'Category must be at most 50 characters',
    'any.required': 'Category is required'
  }),
  date: Joi.date().iso().required().messages({
    'date.format': 'Date must be in ISO format',
    'any.required': 'Date is required'
  }),
  notes: Joi.string().max(500).allow(null, '').optional()
});

const updateRecordSchema = Joi.object({
  amount: Joi.number().positive().precision(2).optional(),
  type: Joi.string().valid('INCOME', 'EXPENSE').optional(),
  category: Joi.string().min(2).max(50).optional(),
  date: Joi.date().iso().optional(),
  notes: Joi.string().max(500).allow(null, '').optional()
}).min(1);

const filterRecordSchema = Joi.object({
  type: Joi.string().valid('INCOME', 'EXPENSE').optional(),
  category: Joi.string().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  search: Joi.string().max(100).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

module.exports = { createRecordSchema, updateRecordSchema, filterRecordSchema };
