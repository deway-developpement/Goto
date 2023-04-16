import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { FileType, FilesService } from './file/file.service';

@Injectable()
export class AppService {
    constructor(@Inject(FilesService) private readonly filesService: FilesService) {}

    getHello(): string {
        return 'Hello World!';
    }

    getFileStream(category: string, id: FileType): StreamableFile {
        return this.filesService.getFileStream(category, id);
    }
}
