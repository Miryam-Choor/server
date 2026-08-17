// validators/validation.schemas.js

import Joi from 'joi';

// 1. update schema
export const bookSchema = Joi.object({
    code: Joi.number().integer().positive().required(),
    name: Joi.string().min(2).max(100).required(),
    category: Joi.string().min(2).required(),
    price: Joi.number().positive().precision(2).required()
});

// 2. Sign-up schema
export const userSignUpSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

// 3. Sign-in schema
export const userSignInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});