import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    getFileStream(category: string, id: string): StreamableFile {
        // pipe file from local storage
        const file = createReadStream(join(process.cwd(), `./data/${category}/${id}`));
        return new StreamableFile(file);
    }
}
