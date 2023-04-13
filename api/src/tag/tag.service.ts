import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './interfaces/tag.entity';

@QueryService(TagEntity)
export class TagService extends TypeOrmQueryService<TagEntity> {
    constructor(@InjectRepository(TagEntity) repo: Repository<TagEntity>) {
        super(repo);
    }
}
