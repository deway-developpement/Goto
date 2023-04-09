import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CRUDResolver } from '@nestjs-query/query-graphql';
import { UserDTO } from './interfaces/user.dto';
import { UserInput, UserUpdateInput } from './interfaces/user.input';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@nestjs-query/query-graphql/node_modules/@nestjs-query/core';
import { Inject, UseGuards } from '@nestjs/common';
import { CurrentUser, GqlAuthGuard } from '../auth/graphql-auth.guard';

const guards = [GqlAuthGuard];

@Resolver(() => UserDTO)
export class UserResolver extends CRUDResolver(UserDTO, {
    read: { guards },
    create: { disabled: true },
    update: { disabled: true },
    delete: { disabled: true },
    enableTotalCount: true,
    enableAggregate: true,
}) {
    constructor(@Inject(UserService) private readonly usersService: UserService) {
        super(usersService);
    }

    @Mutation(() => UserDTO)
    async createUser(@Args('input') query: UserInput): Promise<UserDTO> {
        return this.usersService.newUser(query);
    }

    @Mutation(() => UserDTO)
    async updateUser(
        @Args('id') id: string,
        @Args('input') query: UserUpdateInput
    ): Promise<UserDTO> {
        return this.usersService.update(id, query);
    }

    @Query(() => Boolean)
    async exist(@Args('email', { type: () => String }) _email: string): Promise<boolean> {
        const user = await this.usersService.findByEmail(_email);
        return user !== null;
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => UserDTO)
    async whoami(@CurrentUser() user: UserDTO): Promise<UserDTO> {
        return this.usersService.findById(user.id);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserDTO)
    async addFriend(@Args('id') friendId: string, @CurrentUser() user: UserDTO): Promise<UserDTO> {
        return this.usersService.addFriend(user.id, friendId);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserDTO)
    async removeFriend(
        @Args('id') friendId: string,
        @CurrentUser() user: UserDTO
    ): Promise<UserDTO> {
        return this.usersService.removeFriend(user.id, friendId);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserDTO)
    async deleteAccount(@CurrentUser() user: UserDTO): Promise<UserDTO> {
        return this.usersService.delete(user.id);
    }
}
