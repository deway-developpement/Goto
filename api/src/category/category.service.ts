import { QueryService } from '@ptc-org/nestjs-query-core';
import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './interfaces/category.entity';

@QueryService(CategoryEntity)
export class CategoryService extends TypeOrmQueryService<CategoryEntity> {
    constructor(@InjectRepository(CategoryEntity) repo: Repository<CategoryEntity>) {
        super(repo);
    }
}
