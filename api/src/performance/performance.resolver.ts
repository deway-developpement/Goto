import { CRUDResolver } from '@nestjs-query/query-graphql';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { PerfomanceService } from './performance.service';
import { CurrentUser, GqlAuthGuard } from '../auth/guards/graphql-auth.guard';
import { PerformanceDTO } from './interfaces/performance.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@nestjs-query/query-graphql/node_modules/@nestjs-query/core';
import { PerformanceInput } from './interfaces/performance.input';
import { UserDTO } from '../user/interfaces/user.dto';

const guards = [GqlAuthGuard];

@Resolver(() => PerformanceDTO)
export class PerfomanceResolver extends CRUDResolver(PerformanceDTO, {
    read: { guards },
    create: { disabled: true },
    update: { disabled: true },
    delete: { disabled: true },
    enableTotalCount: true,
    enableAggregate: true,
}) {
    constructor(@Inject(PerfomanceService) readonly service: PerfomanceService) {
        super(service);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => PerformanceDTO)
    async createPerformance(
        @Args('input') query: PerformanceInput,
        @CurrentUser() user: UserDTO
    ): Promise<PerformanceDTO> {
        return this.service.create(query, user);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => PerformanceDTO)
    async deletePerformance(
        @Args('id') id: string,
        @CurrentUser() user: UserDTO
    ): Promise<PerformanceDTO> {
        const perf = await this.service.findById(id);
        if (perf.user !== user && user.credidential < 2) {
            throw new UnauthorizedException();
        }
        return this.service.deleteOne(id);
    }
}
