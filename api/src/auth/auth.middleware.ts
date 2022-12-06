import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { UnauthorizedError } from 'type-graphql';

export const pwdMiddleware: FieldMiddleware = async (ctx: MiddlewareContext, next: NextFn) => {
    const value = await next();

    const errorValue = 'Unauthorized'; //TODO: change this
    try {
        const _id = ctx.context.req.user._id;
        const _creditential = ctx.context.req.user.credidential;

        if (_creditential > 3 || (_creditential > 0 && ctx.source._id == _id)) {
            return value;
        }

        return errorValue;
    } catch (e) {
        try {
            if (ctx.context.ignoreError) {
                return value;
            }
            throw new UnauthorizedError();
        } catch (e) {
            return errorValue;
        }
    }
};

export const idMiddleware: FieldMiddleware = async (ctx: MiddlewareContext, next: NextFn) => {
    const value = await next();

    const errorValue = 'Unauthorized';

    try {
        const _id = ctx.context.req.user._id;
        const _creditential = ctx.context.req.user.credidential;

        if (_creditential > 3 || (_creditential > 0 && ctx.source._id == _id)) {
            return value;
        }

        return errorValue;
    } catch (e) {
        try {
            if (ctx.context.ignoreError) {
                return value;
            }
            throw new UnauthorizedError();
        } catch (e) {
            return errorValue;
        }
    }
};

export const credidentialMiddleware: FieldMiddleware = async (
    ctx: MiddlewareContext,
    next: NextFn
) => {
    const value = await next();

    const errorValue = 0;

    try {
        const _id = ctx.context.req.user._id;
        const _creditential = ctx.context.req.user.credidential;

        if (_creditential > 3 || (_creditential > 0 && ctx.source._id == _id)) {
            return value;
        }

        return errorValue;
    } catch (e) {
        try {
            if (ctx.context.ignoreError) {
                return value;
            }
            throw new UnauthorizedError();
        } catch (e) {
            return errorValue;
        }
    }
};
