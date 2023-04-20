import { UnauthorizedException } from '@nestjs/common';
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { AuthType } from './interface/auth.type';

export const fieldMiddleware: FieldMiddleware = async (ctx: MiddlewareContext, next: NextFn) => {
    const value = await next();

    const id = ctx.context.req.user?.id;
    const creditential = ctx.context.req.user?.credidential;

    if (
        creditential >= AuthType.superAdmin ||
        (creditential >= AuthType.user && ctx.source.id == id)
    ) {
        return value;
    } else if (ctx?.context?.ignoreError) {
        return value;
    }
    throw new UnauthorizedException("You don't have the right to access this field");
};
