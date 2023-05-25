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
import { HikeConnectionDTO } from '../CustomScalar/hikeConnection/interface/hikeconnection.dto';
import { Int } from 'type-graphql';

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
    @Query(() => HikeConnectionDTO)
    async getHikeAround(
        @Args('lat') lat: number,
        @Args('lon') lon: number,
        @Args('distance', { description: 'Distance in kilometers', defaultValue: 50 })
        distance: number,
        @Args('search', { nullable: true }) search: string,
        @Args('limit', { type: () => Int }) limit: number,
        @Args('cursor', { defaultValue: '' }) cursor: string
    ): Promise<HikeConnectionDTO> {
        return this.service.findByDistance(lat, lon, distance, limit, cursor, search);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => HikeConnectionDTO)
    async getHikePopular(
        @Args('search', { nullable: true }) search: string,
        @Args('limit', { type: () => Int }) limit: number,
        @Args('cursor', { defaultValue: '' }) cursor: string
    ): Promise<HikeConnectionDTO> {
        return this.service.findPopular(limit, cursor, search);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => HikeConnectionDTO)
    async getHikeAlreadyDone(
        @CurrentUser() user: UserDTO,
        @Args('search', { nullable: true }) search: string,
        @Args('limit', { type: () => Int }) limit: number,
        @Args('cursor', { defaultValue: '' }) cursor: string
    ): Promise<HikeConnectionDTO> {
        return this.service.findAlreadyDone(user.id, limit, cursor, search);
    }

    @ResolveField(() => Number)
    async distanceFrom(
        @Args('lat') lat: number,
        @Args('lon') lon: number,
        @Parent() hike: HikeDTO
    ): Promise<number> {
        return this.service.computeDistance(hike, lat, lon);
    }

    @ResolveField(() => Boolean)
    async isLiked(@CurrentUser() user: UserDTO, @Parent() hike: HikeDTO): Promise<boolean> {
        return this.service.isLiked(user.id, hike.id);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => HikeDTO)
    async likeHike(@CurrentUser() user: UserDTO, @Args('id') id: string): Promise<HikeDTO> {
        return this.service.like(user, id);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => HikeDTO)
    async unlikeHike(@CurrentUser() user: UserDTO, @Args('id') id: string): Promise<HikeDTO> {
        return this.service.unlike(user, id);
    }
}
