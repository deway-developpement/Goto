import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { PhotoService } from './photo.service';
import { CurrentUser, GqlAuthGuard } from '../auth/guards/graphql-auth.guard';
import { PhotoDTO } from './interfaces/photo.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@nestjs-query/query-graphql/node_modules/@nestjs-query/core';
import { ObjType, PhotoInput } from './interfaces/photo.input';
import { UserDTO } from '../user/interfaces/user.dto';
import { AuthType } from '../auth/interface/auth.type';

@Resolver(() => PhotoDTO)
export class PhotoResolver {
    constructor(@Inject(PhotoService) readonly service: PhotoService) {}

    @UseGuards(GqlAuthGuard)
    @Mutation(() => PhotoDTO)
    async createPhoto(
        @Args('input') query: PhotoInput,
        @CurrentUser() user: UserDTO
    ): Promise<PhotoDTO> {
        if (
            user.credidential < AuthType.superAdmin &&
            !(query.objType === ObjType.USER || query.objId === user.id) // if not superAdmin, only allow to create photo for himself
        ) {
            throw new UnauthorizedException();
        }
        return this.service.create(query);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => PhotoDTO)
    async changeAvatar(
        @Args('input') query: PhotoInput,
        @CurrentUser() user: UserDTO
    ): Promise<PhotoDTO> {
        if (query.objType !== ObjType.USER || query.objId !== user.id) {
            throw new UnauthorizedException();
        }
        return this.service.changeAvatar(query, user.id);
    }
}
