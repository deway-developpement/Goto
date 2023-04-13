import { Injectable, StreamableFile, UnauthorizedException } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    getFileStream(category: string, id: string): StreamableFile {
        // check that the id is safe and the user isn't trying to access a file outside of the category
        if (!id.match(/^[0-9a-fA-F\-]{36}$/)) {
            throw new UnauthorizedException();
        }
        // pipe file from local storage
        const file = createReadStream(join(process.cwd(), `./data/${category}/${id}`));
        return new StreamableFile(file);
    }
}
