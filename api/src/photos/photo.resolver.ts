import { Inject, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { PhotoService } from './photo.service';
import { CurrentUser, GqlAuthGuard } from '../auth/graphql-auth.guard';
import { PhotoDTO } from './interfaces/photo.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@nestjs-query/query-graphql/node_modules/@nestjs-query/core';
import { PhotoInput } from './interfaces/photo.input';
import { UserDTO } from '../users/interfaces/user.dto';
import { UnauthorizedError } from 'type-graphql';

@Resolver(() => PhotoDTO)
export class PhotoResolver {
    constructor(@Inject(PhotoService) readonly service: PhotoService) {}

    @UseGuards(GqlAuthGuard)
    @Mutation(() => PhotoDTO)
    async createPhoto(
        @Args('input') query: PhotoInput,
        @CurrentUser() user: UserDTO
    ): Promise<PhotoDTO> {
        if (user.credidential < 2) {
            throw new UnauthorizedError();
        }
        return this.service.create(query);
    }

    // @UseGuards(GqlAuthGuard)
    // @Mutation(() => PhotoDTO)
    // async removePhoto(@Args('id') id: string, @CurrentUser() user: UserDTO): Promise<PhotoDTO> {
    //     if (user.credidential < 2) {
    //         throw new UnauthorizedError();
    //     }
    //     return this.service.remove(id);
    // }
}
