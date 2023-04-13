import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReviewEntity } from './interfaces/review.entity';
import { HikeService } from '../hike/hike.service';
import { ReviewInput } from './interfaces/review.input';
import { UserDTO } from '../user/interfaces/user.dto';

@QueryService(ReviewEntity)
export class ReviewService extends TypeOrmQueryService<ReviewEntity> {
    constructor(
        @InjectRepository(ReviewEntity) repo: Repository<ReviewEntity>,
        @Inject(HikeService) private readonly hikeService: HikeService
    ) {
        super(repo);
    }

    async create(input: ReviewInput, user: UserDTO): Promise<ReviewEntity> {
        const hike = await this.hikeService.findById(input.hikeId);
        if (hike && user) {
            return this.repo.save({
                ...input,
                hike,
                user,
            });
        }
        throw new HttpException('Hike not found', HttpStatus.BAD_REQUEST);
    }

    async update(input: ReviewInput, user: UserDTO): Promise<ReviewEntity> {
        const hike = await this.hikeService.findById(input.hikeId);
        const review = await this.repo.findOne({
            where: {
                hike: hike,
                user: user,
            },
        });
        if (review) {
            return this.repo.save({
                ...review,
                ...input,
            });
        }
        throw new HttpException('Review not found', HttpStatus.BAD_REQUEST);
    }
}
