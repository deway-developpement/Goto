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
}
