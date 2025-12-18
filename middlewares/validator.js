const Joi = require('joi');

const signupSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: ['com', 'net'] } })
        .min(6)
        .max(60)
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'string.min': 'Email must be at least 6 characters long',
            'string.max': 'Email must not exceed 60 characters',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(8)
        .max(30)
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&])'))
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.max': 'Password must not exceed 30 characters',
            'string.pattern.base':
                'Password must contain uppercase, lowercase, number, and special character',
            'any.required': 'Password is required'
        })
});
const signinSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: ['com', 'net'] } })
        .min(6)
        .max(60)
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'string.min': 'Email must be at least 6 characters long',
            'string.max': 'Email must not exceed 60 characters',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(8)
        .max(30)
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&])'))
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.max': 'Password must not exceed 30 characters',
            'string.pattern.base':
                'Password must contain uppercase, lowercase, number, and special character',
            'any.required': 'Password is required'
        })
});

module.exports = {
    signupSchema,
    signinSchema
};