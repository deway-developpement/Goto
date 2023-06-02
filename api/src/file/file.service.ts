import {
    HttpException,
    HttpStatus,
    Injectable,
    StreamableFile,
    UnauthorizedException,
} from '@nestjs/common';
import { Worker } from 'snowflake-uuid';
import { FileUpload } from './interfaces/fileupload.type';
import { createReadStream, createWriteStream, existsSync, unlinkSync, writeFile } from 'fs';
import { join } from 'path';
import { Point, TrackStats } from './interfaces/point.type';
import { DOMParser } from '@xmldom/xmldom';

export enum FileType {
    IMAGE = 'photos',
    GPX = 'tracks',
}
@Injectable()
export class FilesService {
    worker = new Worker(0, 1, {
        workerIdBits: 5,
        datacenterIdBits: 5,
        sequenceBits: 12,
    });

    getFileName(mimetype: string, type: FileType): string {
        if (
            ['image/png', 'image/jpeg', 'image/jpg'].includes(mimetype) &&
            type === FileType.IMAGE
        ) {
            return this.worker.nextId().toString() + '.' + mimetype.split('/').pop();
        } else if (
            ['application/gpx+xml', 'application/gpx', 'application/octet-stream'].includes(
                mimetype
            ) &&
            type === FileType.GPX
        ) {
            return this.worker.nextId().toString() + '.gpx';
        }
        throw new HttpException('File type not allowed', HttpStatus.BAD_REQUEST);
    }

    async uploadFile(file: FileUpload, type: FileType): Promise<string> {
        const { createReadStream, mimetype } = file;
        const localfilename = this.getFileName(mimetype, type);
        await new Promise(async (resolve) => {
            createReadStream()
                .pipe(createWriteStream(join(process.cwd(), `./data/${type}/${localfilename}`)))
                .on('finish', () => resolve({}))
                .on('error', () => {
                    new HttpException('Could not save file', HttpStatus.BAD_REQUEST);
                });
        });
        return localfilename;
    }

    async uploadFileFromString(file: string, type: FileType): Promise<string> {
        const localfilename = this.getFileName('application/gpx+xml', type);
        await new Promise(async (resolve) => {
            writeFile(join(process.cwd(), `./data/${type}/${localfilename}`), file, (err) => {
                if (err) {
                    throw new HttpException('Could not save file', HttpStatus.BAD_REQUEST);
                }
                resolve({});
            });
        });
        return localfilename;
    }

    getFileStream(filename: string, type: FileType): StreamableFile {
        const path = join(process.cwd(), `./data/${type}/${filename}`);
        // check that the id is safe and the user isn't trying to access a file outside of the category
        if (path.match(/^[a-zA-Z\/]+[0-9]{16,20}.[a-zA-Z]{3,4}$/)) {
            // check that the file exists
            if (!existsSync(path)) {
                throw new HttpException('File not found', HttpStatus.NOT_FOUND);
            } else {
                try {
                    const file = createReadStream(path);
                    return new StreamableFile(file);
                } catch (e) {
                    console.log(e);
                    throw new HttpException('Error reading file', HttpStatus.BAD_REQUEST);
                }
            }
        }
        // else throw error
        throw new UnauthorizedException("You don't have access to this file");
    }

    deleteFile(filename: string, type: FileType): void {
        const path = join(process.cwd(), `./data/${type}/${filename}`);
        // check that the id is safe and the user isn't trying to access a file outside of the category
        if (path.match(/^[a-zA-Z\/]+[0-9]{16,20}.[a-zA-Z]{3,4}$/)) {
            console.log(path);
            // check that the file exists
            if (!existsSync(path)) {
                throw new HttpException('File not found', HttpStatus.NOT_FOUND);
            } else {
                try {
                    return unlinkSync(path);
                } catch (e) {
                    console.log(e);
                    throw new HttpException('Error deleting file', HttpStatus.BAD_REQUEST);
                }
            }
        }
        console.log('throwing error');
        // else throw error
        throw new UnauthorizedException("You don't have access to this file");
    }

    overwriteFile(content: string, filename: string, type: FileType) {
        const path = join(process.cwd(), `./data/${type}/${filename}`);
        writeFile(path, content, (err) => {
            if (err) {
                console.log(err);
                throw new HttpException('Error overwriting file', HttpStatus.BAD_REQUEST);
            }
        });
    }

    distance2Coordonate(point1: Point, point2: Point) {
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

    addTimeTagToGPXFile(fileString: string, totalTime: number, startDate: Date): string {
        const doc = new DOMParser().parseFromString(fileString, 'text/xml');
        const trkpts = doc.getElementsByTagName('trkpt');
        const trkptsArray = Array.from(trkpts);

        let previousTime = startDate;
        trkptsArray.forEach((trkpt, index) => {
            const elt = trkpt.getElementsByTagName('time');
            if (elt.length > 0) {
                return;
            } else {
                const time = doc.createElement('time');
                time.textContent = previousTime.toISOString();
                const etime =
                    previousTime.getTime() +
                    ((totalTime - (previousTime.getTime() - startDate.getTime())) /
                        (trkptsArray.length - index)) *
                        (index === trkptsArray.length - 1 ? 1 + Math.random() * 0.2 : 1);
                previousTime = new Date(etime);
                trkpt.appendChild(time);
            }
        });
        return doc.toString();
    }

    parseFile(fileString: string) {
        const doc = new DOMParser().parseFromString(fileString, 'text/xml');
        if (doc === null) {
            console.log('Could not parse GPX file', doc);
            throw new HttpException('Could not parse GPX file', HttpStatus.BAD_REQUEST);
        }
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

    trackStats(points: Point[]): TrackStats {
        const stats: Partial<TrackStats> = {
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
        stats.maxSpeed = Math.max(...stats.speedDeltas);
        stats.minSpeed = Math.min(...stats.speedDeltas);
        stats.latitude = points[0].latitude;
        stats.longitude = points[0].longitude;
        return stats as TrackStats;
    }
}
