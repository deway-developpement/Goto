import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { UserEntity } from '../user/interfaces/user.entity';
import { PerformanceEntity } from './interfaces/performance.entity';
import { PerformanceInput } from './interfaces/performance.input';
import { FilesService } from '../file/file.service';
import { HikeService } from '../hike/hike.service';

@QueryService(PerformanceEntity)
export class PerfomanceService extends TypeOrmQueryService<PerformanceEntity> {
    constructor(
        @InjectRepository(PerformanceEntity) repo: Repository<PerformanceEntity>,
        @Inject(HikeService) private readonly hikeService: HikeService,
        @Inject(FilesService) private readonly filesService: FilesService
    ) {
        super(repo);
    }

    async create(perf: PerformanceInput, user: UserEntity): Promise<PerformanceEntity> {
        const { createReadStream, filename } = await perf.file;
        const filetype = filename.split('.').pop();
        if (filetype !== 'gpx') {
            console.log(filetype);
            throw new HttpException('Only GPX files are allowed', HttpStatus.BAD_REQUEST);
        }
        const localfilename = this.filesService.worker.nextId().toString() + '.' + filetype;
        await new Promise(async (resolve) => {
            createReadStream()
                .pipe(createWriteStream(join(process.cwd(), `./data/tracks/${localfilename}`)))
                .on('finish', () => resolve({}))
                .on('error', () => {
                    new HttpException('Could not save image', HttpStatus.BAD_REQUEST);
                });
        });
        const newperf = this.repo.create({
            date: perf.date,
            duration: perf.duration,
            distance: perf.distance,
            elevation: perf.elevation,
            track: localfilename,
            user: user,
            hike: await this.hikeService.findById(perf.hikeId),
        } as PerformanceEntity);
        return await this.repo.save(newperf);
    }
}
