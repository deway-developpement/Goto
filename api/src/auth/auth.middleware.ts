import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { UnauthorizedError } from 'type-graphql';

export const pwdMiddleware: FieldMiddleware = async (ctx: MiddlewareContext, next: NextFn) => {
    const value = await next();

    const errorValue = 'Unauthorized'; //TODO: change this
    try {
        const id = ctx.context.req.user.id;
        const creditential = ctx.context.req.user.credidential;

        if (creditential >= 2 || (creditential >= 0 && ctx.source.id == id)) {
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
        const id = ctx.context.req.user.id;
        const creditential = ctx.context.req.user.credidential;

        if (creditential >= 2 || (creditential >= 0 && ctx.source.id == id)) {
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
        const id = ctx.context.req.user.id;
        const creditential = ctx.context.req.user.credidential;

        if (creditential >= 2 || (creditential >= 0 && ctx.source.id == id)) {
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
