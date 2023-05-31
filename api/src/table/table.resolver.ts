import { CRUDResolver } from '@nestjs-query/query-graphql';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { TableService } from './table.service';
import { CurrentUser, GqlAuthGuard } from '../auth/guards/graphql-auth.guard';
import { TableDTO } from './interfaces/table.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@nestjs-query/query-graphql/node_modules/@nestjs-query/core';
import { TableInput } from './interfaces/table.input';
import { UserDTO } from '../user/interfaces/user.dto';
import { AuthType } from '../auth/interface/auth.type';

const guards = [GqlAuthGuard];

@Resolver(() => TableDTO)
export class TableResolver extends CRUDResolver(TableDTO, {
    read: { guards },
    create: { disabled: true },
    update: { disabled: true },
    delete: { disabled: true },
}) {
    constructor(@Inject(TableService) readonly service: TableService) {
        super(service);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => TableDTO)
    async createTable(
        @Args('input') query: TableInput,
        @CurrentUser() user: UserDTO
    ): Promise<TableDTO> {
        return this.service.create(query, user);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => TableDTO)
    async deleteTable(@Args('id') id: string, @CurrentUser() user: UserDTO): Promise<TableDTO> {
        const table = await this.service.repo.findOne({ where: { id }, relations: ['owner'] });
        if (user.credidential < AuthType.superAdmin && user.id !== table.owner.id) {
            throw new UnauthorizedException();
        }
        return this.service.deleteOne(id);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => TableDTO)
    async addHikeToTable(
        @Args('tableId') tableId: string,
        @Args('hikeId') hikeId: string,
        @CurrentUser() user: UserDTO
    ): Promise<TableDTO> {
        const table = await this.service.repo.findOne({
            where: { id: tableId },
            relations: ['owner'],
        });
        if (user.credidential < AuthType.superAdmin && user.id !== table.owner.id) {
            throw new UnauthorizedException();
        }
        return this.service.addHikeToTable(tableId, hikeId);
    }
}
