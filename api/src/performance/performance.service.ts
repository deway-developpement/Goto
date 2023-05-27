import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { UserEntity } from '../user/interfaces/user.entity';
import { PerformanceEntity } from './interfaces/performance.entity';
import { PerformanceInput } from './interfaces/performance.input';
import { FileType, FilesService } from '../file/file.service';
import { HikeService } from '../hike/hike.service';
import { DOMParser } from '@xmldom/xmldom';
import { Difficulty } from '../hike/interfaces/difficulty.dto';

@QueryService(PerformanceEntity)
export class PerfomanceService extends TypeOrmQueryService<PerformanceEntity> {
    constructor(
        @InjectRepository(PerformanceEntity) repo: Repository<PerformanceEntity>,
        @Inject(HikeService) private readonly hikeService: HikeService,
        @Inject(FilesService) private readonly filesService: FilesService
    ) {
        super(repo);
        this.correctData();
    }

    async create(perf: PerformanceInput, user: UserEntity): Promise<PerformanceEntity> {
        const { createReadStream, filename } = await perf.file;
        const filetype = filename.split('.').pop();
        if (filetype !== 'gpx') {
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

    addTimeTagToGPXFile(fileString, totalTime, startDate) {
        const doc = new DOMParser().parseFromString(fileString, 'text/xml');
        const trkpts = doc.getElementsByTagName('trkpt');
        const trkptsArray = Array.from(trkpts);

        let previousTime = startDate;
        trkptsArray.forEach((trkpt, index) => {
            const time = doc.createElement('time');
            time.textContent = previousTime.toISOString();
            const etime =
                previousTime.getTime() +
                ((totalTime - (previousTime.getTime() - startDate.getTime())) /
                    (trkptsArray.length - index)) *
                    (index === trkptsArray.length - 1 ? 1 + Math.random() * 0.2 : 1);
            previousTime = new Date(etime);
            trkpt.appendChild(time);
        });
        return doc.toString();
    }

    parseFile(fileString) {
        const doc = new DOMParser().parseFromString(fileString, 'text/xml');
        const trkpts = doc.getElementsByTagName('trkpt');
        const trkptsArray = Array.from(trkpts);

        return trkptsArray.map((trkpt) => {
            return {
                latitude: parseFloat(trkpt.getAttribute('lat')),
                longitude: parseFloat(trkpt.getAttribute('lon')),
                timestamp: new Date(trkpt.getElementsByTagName('time')[0]?.textContent || 0),
                elevation: parseInt(trkpt.getElementsByTagName('ele')[0]?.textContent || '0'),
            };
        });
    }

    distance2Coordonate(point1, point2) {
        return (
            6371 *
            2 *
            Math.asin(
                Math.sqrt(
                    Math.pow(
                        Math.sin(
                            ((point1.latitude * Math.PI) / 180 -
                                (point2.latitude * Math.PI) / 180) /
                                2
                        ),
                        2
                    ) +
                        Math.cos((point1.latitude * Math.PI) / 180) *
                            Math.cos((point2.latitude * Math.PI) / 180) *
                            Math.pow(
                                Math.sin(
                                    ((point1.longitude * Math.PI) / 180 -
                                        (point2.longitude * Math.PI) / 180) /
                                        2
                                ),
                                2
                            )
                )
            )
        );
    }

    performanceStats(points) {
        const stats: any = {
            distanceDeltas: points
                .map((point, index) => {
                    if (index === 0) return 0;
                    return this.distance2Coordonate(point, points[index - 1]);
                })
                .slice(1),
            timeDeltas: points
                .map((point, index) => {
                    if (index === 0) return 0;
                    return point.timestamp.getTime() - points[index - 1].timestamp.getTime();
                })
                .slice(1),
            elevationDeltas: points
                .map((point, index) => {
                    if (index === 0) return 0;
                    return point.elevation - points[index - 1].elevation;
                })
                .slice(1),
            speedDeltas: points
                .map((point, index) => {
                    if (index === 0) return 0;
                    return (
                        this.distance2Coordonate(point, points[index - 1]) /
                        ((point.timestamp.getTime() - points[index - 1].timestamp.getTime()) /
                            3600 /
                            1000) // in km/h
                    );
                })
                .slice(1),
        };
        stats.distance = stats.distanceDeltas.reduce((acc, curr) => acc + curr, 0);
        stats.time = stats.timeDeltas.reduce((acc, curr) => acc + curr, 0);
        stats.elevation = stats.elevationDeltas.reduce((acc, curr) => acc + Math.abs(curr), 0);
        stats.meanSpeed =
            stats.speedDeltas.reduce((acc, curr) => acc + curr, 0) / stats.speedDeltas.length;
        stats.theoricalMeanSpeed = stats.distance / (stats.time / 3600 / 1000);
        stats.maxSpeed = Math.max(...stats.speedDeltas);
        stats.minSpeed = Math.min(...stats.speedDeltas);
        return stats;
    }

    async correctData(): Promise<void> {
        const performances = await this.repo.find();
        performances.forEach(async (perf) => {
            const stream = createReadStream(join(process.cwd(), `./data/tracks/${perf.track}`));
            const fileString = await new Promise((resolve) => {
                let data = '';
                stream.on('data', (chunk) => {
                    data += chunk;
                });
                stream.on('end', () => {
                    resolve(data);
                });
            });
            const stats = this.performanceStats(this.parseFile(fileString));
            const rHike = await this.hikeService.repo.findOne({
                where: { difficulty: Difficulty.EASY },
            });
            rHike.distance = stats.distance;
            rHike.elevation = stats.elevation;
            const duration = this.hikeService.duration(rHike);
            const newFileString = this.addTimeTagToGPXFile(
                fileString,
                duration > 0.5 ? duration * 1000 * 3600 : 0.5 * 1000 * 3600,
                perf.date
            );
            const newStats = this.performanceStats(this.parseFile(newFileString));
            console.log(
                perf.date,
                perf.distance,
                newStats.distance,
                perf.duration,
                newStats.time / 1000 / 3600,
                duration,
                perf.elevation,
                newStats.elevation
            );
            this.filesService.overwriteFile(newFileString, perf.track, FileType.GPX);
            const newPerf = await this.repo.findOne({ where: { id: perf.id } });
            newPerf.distance = newStats.distance;
            newPerf.duration = newStats.time;
            newPerf.elevation = newStats.elevation;
            await this.repo.save(newPerf);
        });
    }
}
