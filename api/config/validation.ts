import * as Joi from 'joi';

export const validationSchema = Joi.object({
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().required(),
    JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
    DATABASE_HOST: Joi.string().default('127.0.0.1'),
    DATABASE_PORT: Joi.number().port().default(3306),
    DATABASE_USERNAME: Joi.string().default('root'),
    DATABASE_PASSWORD: Joi.string().allow('').default('root'),
    DATABASE_NAME: Joi.string().default('Goto'),
    PORT: Joi.number().port().default(3000),
});
