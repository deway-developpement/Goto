import { CRUDResolver } from '@nestjs-query/query-graphql';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args, Query, ResolveField, Parent } from '@nestjs/graphql';
import { HikeService } from './hike.service';
import { CurrentUser, GqlAuthGuard } from '../auth/guards/graphql-auth.guard';
import { HikeDTO } from './interfaces/hike.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@nestjs-query/query-graphql/node_modules/@nestjs-query/core';
import { HikeInput } from './interfaces/hike.input';
import { UserDTO } from '../user/interfaces/user.dto';
import { AuthType } from '../auth/interface/auth.type';

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
        if (hike.owner !== user && user.credidential < AuthType.superAdmin) {
            throw new UnauthorizedException();
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

    @ResolveField(() => Number)
    async distanceFrom(
        @Args('lat') lat: number,
        @Args('lon') lon: number,
        @Parent() hike: HikeDTO
    ): Promise<number> {
        return this.service.computeDistance(hike, lat, lon);
    }
}
