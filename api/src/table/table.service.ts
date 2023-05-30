import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableEntity } from './interfaces/table.entity';
import { TableInput } from './interfaces/table.input';
import { UserEntity } from '../user/interfaces/user.entity';

@QueryService(TableEntity)
export class TableService extends TypeOrmQueryService<TableEntity> {
    constructor(@InjectRepository(TableEntity) repo: Repository<TableEntity>) {
        super(repo);
    }

    async create(query: TableInput, user: UserEntity): Promise<TableEntity> {
        const table = this.repo.create({ ...query, owner: user });
        return this.repo.save(table);
    }
}
