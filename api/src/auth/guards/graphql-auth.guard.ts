import { Injectable, ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}

@Injectable()
export class GqlSkipFieldGuard extends AuthGuard('Empty') {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        ctx.getContext().ignoreError = true;
        return ctx.getContext().req;
    }

    handleRequest() {
        return null;
    }
}

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
});
