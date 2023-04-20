import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/interfaces/user.entity';
import { HikeEntity } from './interfaces/hike.entity';
import { HikeInput } from './interfaces/hike.input';
import { Difficulty } from './interfaces/difficulty.dto';
import { TagService } from '../tag/tag.service';
import { FileType, FilesService } from '../file/file.service';
import { CategoryService } from '../category/category.service';
import { HikeDTO } from './interfaces/hike.dto';

@QueryService(HikeEntity)
export class HikeService extends TypeOrmQueryService<HikeEntity> {
    constructor(
        @InjectRepository(HikeEntity) repo: Repository<HikeEntity>,
        @Inject(TagService) private readonly tagService: TagService,
        @Inject(FilesService) private readonly filesService: FilesService,
        @Inject(CategoryService) private readonly categoryModule: CategoryService
    ) {
        super(repo);
    }

    async create(hike: HikeInput, user: UserEntity): Promise<HikeEntity> {
        const localfilename = await this.filesService.uploadFile(await hike.track, FileType.GPX);
        const tags = await Promise.all(
            hike.tagsId.map(async (tagId) => {
                const tag = await this.tagService.findById(tagId);
                if (!tag) {
                    throw new HttpException('Tag does not exist', HttpStatus.BAD_REQUEST);
                }
                return tag;
            })
        );
        const category = await this.categoryModule.findById(hike.categoryId).then((category) => {
            if (!category) {
                throw new HttpException('Category does not exist', HttpStatus.BAD_REQUEST);
            }
            return category;
        });
        const newHike = this.repo.create({
            ...hike,
            track: localfilename,
            owner: user,
            duration: 0,
            tags: tags,
            category: category,
        });
        newHike.duration = this.duration(newHike);
        return this.repo.save(newHike);
    }

    duration(hike: HikeEntity): number {
        // calculate duration from difficulty, distance and elevation gain
        const { difficulty, distance, elevation } = hike;
        const diffFactor =
            difficulty == Difficulty.EASY ? 1 : difficulty == Difficulty.MEDIUM ? 1.05 : 1.1;
        const walkingspeed = 4;
        const distanceTime = distance / walkingspeed;
        const ascentTime = elevation / 500;
        const elevationTime = ascentTime;
        const walkingTime =
            Math.max(distanceTime, elevationTime) + Math.min(distanceTime, elevationTime) * 0.5;
        const breakTime = walkingTime * 0.1;
        const totalTime = walkingTime * diffFactor + breakTime;
        // return time in hours at 30 minutes precision
        return Math.round(totalTime * 2) / 2;
    }

    async addTag(hikeId: string, tagId: string): Promise<HikeEntity> {
        const hike = await this.repo.findOne({ where: { id: hikeId } });
        const tag = await this.tagService.findById(tagId).then((tag) => {
            if (!tag) {
                throw new HttpException('Tag does not exist', HttpStatus.BAD_REQUEST);
            }
            return tag;
        });
        if (hike.tags?.includes(tag)) {
            throw new HttpException('Tag already exists', HttpStatus.BAD_REQUEST);
        } else if (!hike.tags) {
            hike.tags = [];
        }
        hike.tags.push(tag);
        return this.repo.save(hike);
    }

    async removeTag(hikeId: string, tagId: string): Promise<HikeEntity> {
        const hike = await this.repo.findOne({ where: { id: hikeId } });
        if (!hike.tags.map((tag) => tag.id).includes(tagId)) {
            throw new HttpException('Tag is not associated to the hike', HttpStatus.BAD_REQUEST);
        }
        hike.tags = hike.tags.filter((tag) => tag.id !== tagId);
        return this.repo.save(hike);
    }

    async findByDistance(
        latitude: number,
        longitude: number,
        distance: number
    ): Promise<HikeEntity[]> {
        //build query to find hikes within distance
        // the harvesine formula is used to calculate the distance between two points on a sphere
        // d = 2R × sin⁻¹(√[sin²((θ₂ - θ₁)/2) + cosθ₁ × cosθ₂ × sin²((φ₂ - φ₁)/2)]) where R is earth radius (6371 km), θ is latitude, φ is longitude
        const hikesId = await this.repo
            .createQueryBuilder('hikeQuery') // select all columns from hikeQuery
            .select('hike.id') // select id from hikeQuery
            .from(HikeEntity, 'hike')
            .where(
                '6371 * 2 * ASIN(SQRT(POWER(SIN((:latitude * PI()/180 - hike.latitude * PI()/180)/ 2), 2) + COS(:latitude * PI()/180) * COS(hike.latitude * PI()/180) * POWER(SIN((:longitude * PI()/180 - hike.longitude * PI()/180) / 2), 2))) < :distance',
                {
                    distance: distance,
                    latitude: latitude,
                    longitude: longitude,
                }
            )
            .getMany();
        // get all hikes from ids found
        return Promise.all(
            hikesId.map(async (hike) => {
                return await this.repo.findOne({ where: { id: hike.id } });
            })
        );
    }

    async computeDistance(hike: HikeDTO, latitude: number, longitude: number): Promise<number> {
        return (
            6371 *
            2 *
            Math.asin(
                Math.sqrt(
                    Math.pow(
                        Math.sin(
                            ((latitude * Math.PI) / 180 - (hike.latitude * Math.PI) / 180) / 2
                        ),
                        2
                    ) +
                        Math.cos((latitude * Math.PI) / 180) *
                            Math.cos((hike.latitude * Math.PI) / 180) *
                            Math.pow(
                                Math.sin(
                                    ((longitude * Math.PI) / 180 -
                                        (hike.longitude * Math.PI) / 180) /
                                        2
                                ),
                                2
                            )
                )
            )
        );
    }
}
