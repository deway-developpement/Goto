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
import { HikeConnectionDTO } from '../CustomScalar/hikeConnection/interface/hikeconnection.dto';
import { UserService } from '../user/user.service';

@QueryService(HikeEntity)
export class HikeService extends TypeOrmQueryService<HikeEntity> {
    constructor(
        @InjectRepository(HikeEntity) repo: Repository<HikeEntity>,
        @Inject(TagService) private readonly tagService: TagService,
        @Inject(FilesService) private readonly filesService: FilesService,
        @Inject(CategoryService) private readonly categoryModule: CategoryService,
        @Inject(UserService) private readonly userService: UserService
    ) {
        super(repo);
    }

    async create(hike: HikeInput, user: UserEntity): Promise<HikeEntity> {
        const { createReadStream } = await hike.track;
        // stream data to string
        const data: string = await new Promise((resolve, reject) => {
            const chunks = [];
            createReadStream()
                .on('data', (chunk) => chunks.push(chunk))
                .on('error', (err) => reject(err))
                .on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });
        const localfilename = await this.filesService.uploadFileFromString(data, FileType.GPX);
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

        // parse data to points
        const points = await this.filesService.parseFile(data);
        const stats = await this.filesService.trackStats(points);

        const newHike = this.repo.create({
            ...hike,
            track: localfilename,
            owner: user,
            duration: 0,
            tags: tags,
            category: category,
            distance: stats.distance,
            elevation: stats.elevation,
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
        distance: number,
        limit: number,
        cursor: string,
        search = '',
        difficulty = null
    ): Promise<HikeConnectionDTO> {
        const formula = `FLOOR(6371 * 2 * ASIN(SQRT(POWER(SIN((${latitude} * PI()/180 - hike.latitude * PI()/180)/ 2), 2) + COS(${latitude} * PI()/180) * COS(hike.latitude * PI()/180) * POWER(SIN((${longitude} * PI()/180 - hike.longitude * PI()/180) / 2), 2))))`;
        //build query to find hikes within distance
        // the harvesine formula is used to calculate the distance between two points on a sphere
        // d = 2R × sin⁻¹(√[sin²((θ₂ - θ₁)/2) + cosθ₁ × cosθ₂ × sin²((φ₂ - φ₁)/2)]) where R is earth radius (6371 km), θ is latitude, φ is longitude
        const query = await this.repo.manager
            .createQueryBuilder(HikeEntity, 'hike') // select all columns from hikeQuery
            .select(['hike.id', 'hike.latitude', 'hike.longitude'])
            .addSelect(formula, 'dist') // add distance column
            .where(`${formula} < :distance`, {
                distance: distance,
            })
            .orderBy('dist', 'ASC')
            .addOrderBy('id', 'ASC'); // order by id
        if (search !== '') {
            query.andWhere('lower(hike.name) LIKE :search', {
                search: `%${search.replace(' ', '%')}%`,
            });
        }
        if (difficulty !== null) {
            query.andWhere('hike.difficulty = :difficulty', { difficulty: difficulty });
        }

        const totalCount = await query.getCount(); // get total number of results

        const ascii = Buffer.from(cursor, 'base64').toString('ascii');
        const dataCursor =
            ascii !== ''
                ? JSON.parse(ascii)
                : {
                      distance: 0,
                      id: '',
                  }; // decode cursor

        const beforeExist = await query
            .clone()
            .andWhere(`(${formula} < :cursoDist OR (${formula} = :cursoDist AND hike.id <= :id))`, {
                cursoDist: dataCursor.distance,
                id: dataCursor.id,
            })
            .getExists(); // check if there is a hike before the cursor

        const hikesId = await query
            .andWhere(`(${formula} > :cursoDist OR (${formula} = :cursoDist AND hike.id > :id))`, {
                cursoDist: dataCursor.distance,
                id: dataCursor.id,
            })
            .limit(limit)
            .getMany(); // get all hikes id

        const numberOfResults = await query.getCount();
        // get all hikes from ids found
        const hikes = await Promise.all(
            hikesId.map(async (hike: any) => {
                const distanceFromCoords = Math.floor(
                    6371 *
                        2 *
                        Math.asin(
                            Math.sqrt(
                                Math.pow(
                                    Math.sin(
                                        ((latitude * Math.PI) / 180 -
                                            hike.latitude * (Math.PI / 180)) /
                                            2
                                    ),
                                    2
                                ) +
                                    Math.cos(latitude * (Math.PI / 180)) *
                                        Math.cos(hike.latitude * (Math.PI / 180)) *
                                        Math.pow(
                                            Math.sin(
                                                ((longitude * Math.PI) / 180 -
                                                    hike.longitude * (Math.PI / 180)) /
                                                    2
                                            ),
                                            2
                                        )
                            )
                        )
                );
                return {
                    cursor: Buffer.from(
                        JSON.stringify({
                            distance: distanceFromCoords,
                            id: hike.id,
                        })
                    ).toString('base64'), // encode cursor
                    ...(await this.repo.findOne({ where: { id: hike.id } })),
                };
            })
        );
        // return connection
        return {
            edges: [
                ...hikes.map((hike) => {
                    return {
                        node: hike,
                        cursor: hike.cursor, // cursor
                    };
                }),
            ],
            pageInfo: {
                hasNextPage: numberOfResults > limit,
                hasPreviousPage: beforeExist,
                startCursor: hikes.length > 0 ? hikes[0].cursor : '',
                endCursor: hikes.length > 0 ? hikes[hikes.length - 1].cursor : '',
            },
            totalCount,
        };
    }

    async findPopular(
        limit: number,
        cursor: string,
        search = '',
        difficulty = null
    ): Promise<HikeConnectionDTO> {
        //build query to find hikes that have an average rating of 4 or more
        const query = await this.repo.manager
            .createQueryBuilder(HikeEntity, 'hike') // select all columns from hikeQuery
            .select(['hike.id', 'hike.latitude', 'hike.longitude'])
            .leftJoin('hike.reviews', 'review')
            .groupBy('hike.id')
            .having('AVG(review.rating) >= 4')
            .orderBy('hike.id', 'ASC');
        if (search !== '') {
            query.andWhere('lower(hike.name) LIKE :search', { search: `%${search}%` });
        }
        if (difficulty !== null) {
            query.andWhere('hike.difficulty = :difficulty', { difficulty: difficulty });
        }
        const totalCount = (await query.getMany()).length; // get total number of results
        console.log(totalCount);

        const beforeExist = await query
            .clone()
            .andWhere('hike.id <= :cursor', { cursor: cursor })
            .getExists(); // check if there is a hike before the cursor
        const hikesId = await query
            .andWhere('hike.id > :cursor', { cursor: cursor })
            .limit(limit)
            .getMany(); // get all hikes id
        const numberOfResults = (await query.limit(limit + 1).getMany()).length;
        console.log(numberOfResults);
        // get all hikes from ids found
        const hikes = await Promise.all(
            hikesId.map(async (hike) => {
                return await this.repo.findOne({ where: { id: hike.id } });
            })
        );
        // return connection
        return {
            edges: [
                ...hikes.map((hike) => {
                    return {
                        node: hike,
                        cursor: hike.id,
                    };
                }),
            ],
            pageInfo: {
                hasNextPage: numberOfResults > limit,
                hasPreviousPage: beforeExist,
                startCursor: hikes.length > 0 ? hikes[0].id : '',
                endCursor: hikes.length > 0 ? hikes[hikes.length - 1].id : '',
            },
            totalCount,
        };
    }

    async findAlreadyDone(
        userId: string,
        limit: number,
        cursor: string,
        search = '',
        difficulty = null
    ): Promise<HikeConnectionDTO> {
        //build query to find hikes within distance
        // the harvesine formula is used to calculate the distance between two points on a sphere
        // d = 2R × sin⁻¹(√[sin²((θ₂ - θ₁)/2) + cosθ₁ × cosθ₂ × sin²((φ₂ - φ₁)/2)]) where R is earth radius (6371 km), θ is latitude, φ is longitude
        const query = await this.repo.manager
            .createQueryBuilder(HikeEntity, 'hike') // select all columns from hikeQuery
            .select(['hike.id'])
            .leftJoin('hike.performances', 'performance')
            .where('performance.userId = :userId', { userId: userId })
            .groupBy('hike.id')
            .having('COUNT(performance.id) > 0')
            .orderBy('hike.id', 'ASC');

        if (search !== '') {
            query.andWhere('lower(hike.name) LIKE :search', { search: `%${search}%` });
        }
        if (difficulty !== null) {
            query.andWhere('hike.difficulty = :difficulty', { difficulty: difficulty });
        }
        const totalCount = await query.getCount(); // get total number of results

        const beforeExist = await query
            .clone()
            .andWhere('hike.id <= :cursor', { cursor: cursor })
            .getExists(); // check if there is a hike before the cursor
        const hikesId = await query
            .andWhere('hike.id > :cursor', { cursor: cursor })
            .limit(limit)
            .getMany(); // get all hikes id
        const numberOfResults = await query.getCount();
        // get all hikes from ids found
        const hikes = await Promise.all(
            hikesId.map(async (hike) => {
                return await this.repo.findOne({ where: { id: hike.id } });
            })
        );
        // return connection
        return {
            edges: [
                ...hikes.map((hike) => {
                    return {
                        node: hike,
                        cursor: hike.id,
                    };
                }),
            ],
            pageInfo: {
                hasNextPage: numberOfResults > limit,
                hasPreviousPage: beforeExist,
                startCursor: hikes.length > 0 ? hikes[0].id : '',
                endCursor: hikes.length > 0 ? hikes[hikes.length - 1].id : '',
            },
            totalCount,
        };
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

    async isLiked(userId: string, hikeId: string): Promise<boolean> {
        const hike = await this.repo.findOne({ where: { id: hikeId } });
        if (!hike) {
            console.log('hike not found');
            throw new HttpException('Hike not found', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userService.repo.findOne({
            where: { id: userId },
            relations: ['likes'],
        });
        return user.likes.find((like) => like.id === hike.id) !== undefined;
    }

    async like(user: UserEntity, hikeId: string): Promise<HikeEntity> {
        const hike = await this.repo.findOne({ where: { id: hikeId } });
        if (!hike) {
            throw new HttpException('Hike not found', HttpStatus.BAD_REQUEST);
        }
        try {
            await this.userService.addRelations('likes', user.id, [hikeId]);
        } catch (err) {
            throw new HttpException('Hike already liked', HttpStatus.BAD_REQUEST);
        }
        return hike;
    }

    async unlike(user: UserEntity, hikeId: string): Promise<HikeEntity> {
        const hike = await this.userService.findRelation(HikeEntity, 'likes', user, {
            filter: { id: { eq: hikeId } },
        });
        if (!hike) {
            throw new HttpException('Hike not found or not liked', HttpStatus.BAD_REQUEST);
        }
        try {
            await this.userService.removeRelation('likes', user.id, hikeId);
        } catch (err) {
            throw new HttpException('Hike not liked', HttpStatus.BAD_REQUEST);
        }
        return hike;
    }
}
