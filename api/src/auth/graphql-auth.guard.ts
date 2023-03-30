import {
    Injectable,
    ExecutionContext,
    createParamDecorator,
    UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

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

@Injectable()
export class GqlSubdGuard extends AuthGuard('Empty') {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        ctx.getContext().mysub = true;
        return ctx.getContext().req;
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = this.getRequest(context);
        if (req) {
            return true;
        }
        throw new UnauthorizedException();
    }
}

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
});
