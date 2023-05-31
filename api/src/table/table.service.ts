import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableEntity } from './interfaces/table.entity';
import { TableInput } from './interfaces/table.input';
import { UserEntity } from '../user/interfaces/user.entity';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HikeService } from '../hike/hike.service';

@QueryService(TableEntity)
export class TableService extends TypeOrmQueryService<TableEntity> {
    constructor(
        @InjectRepository(TableEntity) repo: Repository<TableEntity>,
        @Inject(HikeService) private readonly hikeService: HikeService
    ) {
        super(repo);
    }

    async create(query: TableInput, user: UserEntity): Promise<TableEntity> {
        const table = this.repo.create({ ...query, owner: user });
        return this.repo.save(table);
    }

    async addHikeToTable(tableId: string, hikeId: string): Promise<TableEntity> {
        const table = await this.repo.findOne({ where: { id: tableId }, relations: ['hikes'] });
        if (!table) throw new HttpException('Table not found', HttpStatus.NOT_FOUND);
        const hike = await this.hikeService.repo.findOne({ where: { id: hikeId } });
        if (!hike) throw new HttpException('Hike not found', HttpStatus.NOT_FOUND);
        this.addRelations('hikes', tableId, [hikeId]);
        return table;
    }
}
