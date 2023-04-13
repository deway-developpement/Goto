import { CRUDResolver } from '@nestjs-query/query-graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { AlertService } from './alert.service';
import { CurrentUser, GqlAuthGuard } from '../auth/graphql-auth.guard';
import { AlertDTO } from './interfaces/alert.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@nestjs-query/query-graphql/node_modules/@nestjs-query/core';
import { AlertInput } from './interfaces/alert.input';
import { UserDTO } from '../user/interfaces/user.dto';
import { UnauthorizedError } from 'type-graphql';

const guards = [GqlAuthGuard];

@Resolver(() => AlertDTO)
export class AlertResolver extends CRUDResolver(AlertDTO, {
    read: { guards },
    create: { disabled: true },
    update: { disabled: true },
    delete: { disabled: true },
}) {
    constructor(@Inject(AlertService) readonly service: AlertService) {
        super(service);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => AlertDTO)
    async postAlert(
        @Args('input') query: AlertInput,
        @CurrentUser() user: UserDTO
    ): Promise<AlertDTO> {
        return this.service.create(query, user);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => AlertDTO)
    async deleteAlert(@Args('id') id: string, @CurrentUser() user: UserDTO): Promise<AlertDTO> {
        const alert = await this.service.repo.findOne({ where: { id }, relations: ['author'] });
        if (user.credidential < 2 && alert.author.id !== user.id) {
            throw new UnauthorizedError();
        }
        return this.service.deleteOne(id);
    }
}
