import { CRUDResolver } from '@nestjs-query/query-graphql';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CurrentUser, GqlAuthGuard } from '../auth/guards/graphql-auth.guard';
import { CategoryDTO } from './interfaces/category.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@nestjs-query/query-graphql/node_modules/@nestjs-query/core';
import { CategoryInput } from './interfaces/category.input';
import { UserDTO } from '../user/interfaces/user.dto';
import { AuthType } from '../auth/interface/auth.type';

const guards = [GqlAuthGuard];

@Resolver(() => CategoryDTO)
export class CategoryResolver extends CRUDResolver(CategoryDTO, {
    read: { guards },
    create: { disabled: true },
    update: { disabled: true },
    delete: { disabled: true },
}) {
    constructor(@Inject(CategoryService) readonly service: CategoryService) {
        super(service);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => CategoryDTO)
    async createCategory(
        @Args('input') query: CategoryInput,
        @CurrentUser() user: UserDTO
    ): Promise<CategoryDTO> {
        if (user.credidential < AuthType.superAdmin) {
            throw new UnauthorizedException();
        }
        return this.service.createOne(query);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => CategoryDTO)
    async deleteCategory(@Args('id') id: string, @CurrentUser() user: UserDTO): Promise<CategoryDTO> {
        if (user.credidential < AuthType.superAdmin) {
            throw new UnauthorizedException();
        }
        return this.service.deleteOne(id);
    }
}
