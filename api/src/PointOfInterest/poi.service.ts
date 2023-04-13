import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointOfInterestEntity } from './interfaces/poi.entity';

@QueryService(PointOfInterestEntity)
export class PointOfInterestService extends TypeOrmQueryService<PointOfInterestEntity> {
    constructor(@InjectRepository(PointOfInterestEntity) repo: Repository<PointOfInterestEntity>) {
        super(repo);
    }
}
