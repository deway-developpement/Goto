import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './interfaces/category.entity';

@QueryService(CategoryEntity)
export class CategoryService extends TypeOrmQueryService<CategoryEntity> {
    constructor(@InjectRepository(CategoryEntity) repo: Repository<CategoryEntity>) {
        super(repo);
    }
}
