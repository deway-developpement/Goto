import {
    Resolver,
    Query,
    Mutation,
    Args,
    Subscription,
    ResolveField,
    Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
    UserInput,
    NewUserInput,
    FilterUserInput,
    SearchUserInput,
    UpdateUserInput,
} from './user.input';
import { User } from './interfaces/user.entity';
import {
    GqlAuthGuard,
    CurrentUser,
    GqlSkipFieldGuard,
    GqlSubdGuard,
} from '../auth/graphql-auth.guard';
import { UseGuards, UnauthorizedException, Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        @Inject('PUB_SUB') private readonly pubSub: PubSub
    ) {}

    @UseGuards(GqlAuthGuard)
    @Query(() => User, { nullable: true })
    async User(
        @Args('id', { type: () => String, nullable: true }) id: string,
        @Args('email', { type: () => String, nullable: true }) email: string,
        @Args('input', { type: () => SearchUserInput, nullable: true })
        input: any
    ): Promise<User> {
        if (id) {
            return this.usersService.findOne(id);
        }
        if (email) {
            return this.usersService.findOne(email, 'email');
        }
        if (input) {
            return this.usersService.findOne(input, 'input');
        }
        return null;
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => User, { nullable: true })
    async whoami(@CurrentUser() user: User): Promise<User> {
        return this.usersService.findOne(user._id);
    }

    @Query(() => Boolean)
    async exist(@Args('email', { type: () => String }) _email: string): Promise<boolean> {
        return (await this.usersService.findOne(_email, 'email')) != null;
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [User])
    async Users(@Args('filter', { nullable: true }) filter: FilterUserInput): Promise<User[]> {
        return this.usersService.findAll(filter);
    }

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

    @UseGuards(GqlSubdGuard)
    @Subscription(() => User)
    async connectedUser() {
        return this.pubSub.asyncIterator('connectedUser');
    }
}
