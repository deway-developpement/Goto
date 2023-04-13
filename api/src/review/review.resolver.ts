import { CRUDResolver } from '@nestjs-query/query-graphql';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { CurrentUser, GqlAuthGuard } from '../auth/graphql-auth.guard';
import { ReviewDTO } from './interfaces/review.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@nestjs-query/query-graphql/node_modules/@nestjs-query/core';
import { ReviewInput } from './interfaces/review.input';
import { UserDTO } from '../user/interfaces/user.dto';

const guards = [GqlAuthGuard];

@Resolver(() => ReviewDTO)
export class ReviewResolver extends CRUDResolver(ReviewDTO, {
    read: { guards },
    create: { disabled: true },
    update: { disabled: true },
    delete: { disabled: true },
    enableTotalCount: true,
    enableAggregate: true,
}) {
    constructor(@Inject(ReviewService) readonly service: ReviewService) {
        super(service);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => ReviewDTO)
    async addReview(
        @Args('input') query: ReviewInput,
        @CurrentUser() user: UserDTO
    ): Promise<ReviewDTO> {
        return this.service.create(query, user);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => ReviewDTO)
    async updateReview(
        @Args('id') id: string,
        @Args('input') query: ReviewInput,
        @CurrentUser() user: UserDTO
    ): Promise<ReviewDTO> {
        return this.service.update(query, user);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => ReviewDTO)
    async deleteReview(@Args('id') id: string, @CurrentUser() user: UserDTO): Promise<ReviewDTO> {
        const review = await this.service.repo.findOne({ where: { id } });
        if (user.credidential < 2 || review?.user.id !== user.id) {
            throw new UnauthorizedException();
        }
        await this.service.repo.delete(id);
        return review;
    }
}
