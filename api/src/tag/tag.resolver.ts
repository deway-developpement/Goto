import { CRUDResolver } from '@nestjs-query/query-graphql';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { CurrentUser, GqlAuthGuard } from '../auth/guards/graphql-auth.guard';
import { TagDTO } from './interfaces/tag.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@nestjs-query/query-graphql/node_modules/@nestjs-query/core';
import { TagEntity } from './interfaces/tag.entity';
import { TagInput } from './interfaces/tag.input';
import { UserDTO } from '../user/interfaces/user.dto';
import { AuthType } from '../auth/interface/auth.type';

const guards = [GqlAuthGuard];

@Resolver(() => TagDTO)
export class TagResolver extends CRUDResolver(TagDTO, {
    read: { guards },
    create: { disabled: true },
    update: { disabled: true },
    delete: { disabled: true },
}) {
    constructor(@Inject(TagService) readonly service: TagService) {
        super(service);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => TagDTO)
    async createTag(@Args('input') query: TagInput, @CurrentUser() user: UserDTO): Promise<TagDTO> {
        if (user.credidential < AuthType.superAdmin) {
            throw new UnauthorizedException();
        }
        return this.service.createOne(query as TagEntity);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => TagDTO)
    async deleteTag(@Args('id') id: string, @CurrentUser() user: UserDTO): Promise<TagDTO> {
        if (user.credidential < AuthType.superAdmin) {
            throw new UnauthorizedException();
        }
        return this.service.deleteOne(id);
    }
}
