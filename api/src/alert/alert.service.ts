import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertEntity } from './interfaces/alert.entity';
import { AlertInput } from './interfaces/alert.input';
import { UserDTO } from '../user/interfaces/user.dto';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HikeService } from '../hike/hike.service';

@QueryService(AlertEntity)
export class AlertService extends TypeOrmQueryService<AlertEntity> {
    constructor(
        @InjectRepository(AlertEntity) repo: Repository<AlertEntity>,
        @Inject(HikeService) private readonly hikeService: HikeService
    ) {
        super(repo);
    }

    async create(dto: AlertInput, user: UserDTO): Promise<AlertEntity> {
        const newAlert = new AlertEntity();
        newAlert.latitude = dto.latitude;
        newAlert.longitude = dto.longitude;
        newAlert.type = dto.type;
        newAlert.author = user;
        const hike = await this.hikeService.findById(dto.hikeId);
        if (!hike) {
            throw new HttpException('Hike not found', HttpStatus.BAD_REQUEST);
        }
        newAlert.hike = hike;
        return this.repo.save(newAlert);
    }
}
