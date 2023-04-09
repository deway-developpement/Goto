import { CRUDResolver } from '@nestjs-query/query-graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { PointOfInterestService } from './poi.service';
import { CurrentUser, GqlAuthGuard } from '../auth/graphql-auth.guard';
import { PointOfInterestDTO } from './interfaces/poi.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@nestjs-query/query-graphql/node_modules/@nestjs-query/core';
import { PointOfInterestEntity } from './interfaces/poi.entity';
import { PointOfInterestInput } from './interfaces/poi.input';
import { UserDTO } from '../users/interfaces/user.dto';
import { UnauthorizedError } from 'type-graphql';

const guards = [GqlAuthGuard];

@Resolver(() => PointOfInterestDTO)
export class PointOfInterestResolver extends CRUDResolver(PointOfInterestDTO, {
    read: { guards },
    create: { disabled: true },
    update: { disabled: true },
    delete: { disabled: true },
}) {
    constructor(@Inject(PointOfInterestService) readonly service: PointOfInterestService) {
        super(service);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => PointOfInterestDTO)
    async createPointOfInterest(
        @Args('input') query: PointOfInterestInput,
        @CurrentUser() user: UserDTO
    ): Promise<PointOfInterestDTO> {
        if (user.credidential < 2) {
            throw new UnauthorizedError();
        }
        return this.service.createOne(query as PointOfInterestEntity);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => PointOfInterestDTO)
    async deletePointOfInterest(
        @Args('id') id: string,
        @CurrentUser() user: UserDTO
    ): Promise<PointOfInterestDTO> {
        if (user.credidential < 2) {
            throw new UnauthorizedError();
        }
        return this.service.deleteOne(id);
    }
}
