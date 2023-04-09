import { Module } from '@nestjs/common';
import { FilesService } from './files.service';

@Module({
    providers: [FilesService],
    imports: [],
    exports: [FilesService],
})
export class FilesModule {}
