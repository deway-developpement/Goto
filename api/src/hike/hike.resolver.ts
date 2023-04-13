import { CRUDResolver } from '@nestjs-query/query-graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { HikeService } from './hike.service';
import { CurrentUser, GqlAuthGuard } from '../auth/graphql-auth.guard';
import { HikeDTO } from './interfaces/hike.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@nestjs-query/query-graphql/node_modules/@nestjs-query/core';
import { HikeInput } from './interfaces/hike.input';
import { UserDTO } from '../user/interfaces/user.dto';
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
    async deleteHike(@Args('id') id: string, @CurrentUser() user: UserDTO): Promise<HikeDTO> {
        const hike = await this.service.findById(id);
        if (hike.owner !== user && user.credidential < 2) {
            throw new UnauthorizedError();
        }
        return this.service.deleteOne(id);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [HikeDTO])
    async getHikeAround(
        @Args('lat') lat: number,
        @Args('lon') lon: number,
        @Args('distance', { description: 'Distance in kilometers', defaultValue: 50 })
        distance: number
    ): Promise<HikeDTO[]> {
        return this.service.findByDistance(lat, lon, distance);
    }
}
