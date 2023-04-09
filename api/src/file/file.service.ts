import { Injectable } from '@nestjs/common';
import { Worker } from 'snowflake-uuid';

@Injectable()
export class FilesService {
    worker = new Worker(0, 1, {
        workerIdBits: 5,
        datacenterIdBits: 5,
        sequenceBits: 12,
    });
}
