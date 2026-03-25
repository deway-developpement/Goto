import { QueryService } from '@ptc-org/nestjs-query-core';
import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointOfInterestEntity } from './interfaces/poi.entity';

@QueryService(PointOfInterestEntity)
export class PointOfInterestService extends TypeOrmQueryService<PointOfInterestEntity> {
    constructor(@InjectRepository(PointOfInterestEntity) repo: Repository<PointOfInterestEntity>) {
        super(repo);
    }
}
