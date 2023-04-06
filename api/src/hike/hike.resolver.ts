import { CRUDResolver } from '@nestjs-query/query-graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args, ResolveField, Parent } from '@nestjs/graphql';
import { HikeService } from './hike.service';
import { CurrentUser, GqlAuthGuard } from '../auth/graphql-auth.guard';
import { HikeDTO } from './interfaces/hike.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@nestjs-query/query-graphql/node_modules/@nestjs-query/core';
import { HikeInput } from './interfaces/hike.input';
import { UserDTO } from '../users/interfaces/user.dto';
import { UnauthorizedError } from 'type-graphql';

const guards = [GqlAuthGuard];

@Resolver(() => HikeDTO)
export class HikeResolver extends CRUDResolver(HikeDTO, {
    read: { guards },
    create: { disabled: true },
    update: { disabled: true },
    delete: { disabled: true },
    enableTotalCount: true,
    enableAggregate: true,
}) {
    constructor(@Inject(HikeService) readonly service: HikeService) {
        super(service);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => HikeDTO)
    async createHike(
        @Args('input') query: HikeInput,
        @CurrentUser() user: UserDTO
    ): Promise<HikeDTO> {
        return this.service.create(query, user);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => HikeDTO)
    async addTagToHike(
        @Args('hikeId') hikeId: string,
        @Args('tagId') tagId: string
    ): Promise<HikeDTO> {
        return this.service.addTag(hikeId, tagId);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => HikeDTO)
    async removeTagFromHike(
        @Args('hikeId') hikeId: string,
        @Args('tagId') tagId: string
    ): Promise<HikeDTO> {
        return this.service.removeTag(hikeId, tagId);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => HikeDTO)
    async removeHike(@Args('id') id: string, @CurrentUser() user: UserDTO): Promise<HikeDTO> {
        const hike = await this.service.findOne(id);
        if (hike.owner !== user || user.credidential < 2) {
            throw new UnauthorizedError();
        }
        return this.service.remove(id);
    }

    @ResolveField(() => [String])
    async photos(@Parent() hike: HikeDTO): Promise<string[]> {
        //return this.service.getPhotos(hike);
        return [];
    }
}
