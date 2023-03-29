import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
    UserInput,
    NewUserInput,
    SearchUserInput,
    UpdateUserInput,
    FilterUserInput,
} from './user.input';
import { User } from './interfaces/user.entity';
import { GqlAuthGuard, CurrentUser, GqlSkipFieldGuard } from '../auth/graphql-auth.guard';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import {
    Filter,
    GraphqlFilter,
    GraphqlLoader,
    GraphqlSorting,
    SortArgs,
    Sorting,
} from 'nestjs-graphql-tools';
import { Brackets } from 'typeorm';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(GqlAuthGuard)
    @Query(() => User, { nullable: true })
    async User(
        @Args('id', { type: () => String, nullable: true }) id: string,
        @Args('email', { type: () => String, nullable: true }) email: string,
        @Args('input', { type: () => SearchUserInput, nullable: true })
        input: any
    ): Promise<User> {
        return this.usersService.findOne({ id, email, input });
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => User, { nullable: true })
    async whoami(@CurrentUser() user: User): Promise<User> {
        return this.usersService.findOne({ id: user._id });
    }

    @Query(() => Boolean)
    async exist(@Args('email', { type: () => String }) _email: string): Promise<boolean> {
        return (await this.usersService.findOne({ email: _email })) != null;
    }

    // @UseGuards(GqlAuthGuard)
    // @Query(() => [User])
    // @GraphqlLoader()
    // async Users(): //@Filter(() => [User, FilterUserInput], { sqlAlias: 'u' }) where: Brackets,
    // //@Sorting(() => User, { sqlAlias: 'u' }) orderBy: SortArgs<User>
    // Promise<User[]> {
    //     //console.log(where);
    //     //return this.usersService.findAll(where, orderBy);
    // }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => User)
    async createUser(@Args('input') input: UserInput): Promise<User> {
        return this.usersService.create(input as User);
    }

    @UseGuards(GqlSkipFieldGuard)
    @Mutation(() => User)
    async newUser(@Args('input') input: NewUserInput): Promise<User> {
        return this.usersService.newUser(input);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => User, { nullable: true })
    async deleteUser(@CurrentUser() user: User, @Args('id') id: string): Promise<User> {
        if (user._id != id && user.credidential < 8) {
            throw new UnauthorizedException('You are not allowed to delete this user');
        }
        return this.usersService.delete(id);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => User, { nullable: true })
    async updateUser(
        @CurrentUser() user: User,
        @Args('id') id: string,
        @Args('input') input: UpdateUserInput
    ): Promise<User> {
        if (user._id != id && user.credidential < 8) {
            throw new UnauthorizedException('You are not allowed to update this user');
        }
        return this.usersService.update(id, input as User);
    }

    @ResolveField(() => Boolean)
    async isConnected(@Parent() user: User): Promise<boolean> {
        return await this.usersService.isConnected(user._id);
    }
}
