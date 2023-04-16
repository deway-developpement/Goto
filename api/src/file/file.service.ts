import {
    HttpException,
    HttpStatus,
    Injectable,
    StreamableFile,
    UnauthorizedException,
} from '@nestjs/common';
import { Worker } from 'snowflake-uuid';
import { FileUpload } from './interfaces/fileupload.type';
import { createReadStream, createWriteStream } from 'fs';
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
        if (mimetype in ['image/png', 'image/jpeg', 'image/jpg'] && type === FileType.IMAGE) {
            return this.worker.nextId().toString() + '.' + mimetype.split('/').pop();
        } else if (
            mimetype in ['application/gpx+xml', 'application/gpx'] &&
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
                .pipe(createWriteStream(join(process.cwd(), `./data/files/${localfilename}`)))
                .on('finish', () => resolve({}))
                .on('error', () => {
                    new HttpException('Could not save file', HttpStatus.BAD_REQUEST);
                });
        });
        return localfilename;
    }

    //TODO: delete file

    getFileStream(filename: string, type: FileType): StreamableFile {
        // check that the id is safe and the user isn't trying to access a file outside of the category
        if (filename.match(/^[0-9a-fA-F\-]{36}$/) && type.match(/^[a-zA-Z]+$/)) {
            const file = createReadStream(join(process.cwd(), `./data/${type}/${filename}`));
            return new StreamableFile(file);
        }
        // else throw error
        throw new UnauthorizedException("You don't have access to this file");
    }
}
