import { Module } from '@nestjs/common';
import { PhotoResolver } from './photo.resolver';
import { PhotoService } from './photo.service';
//import { HikeResolver } from './hike.resolver';
import { PhotoEntity } from './interfaces/photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { HikeModule } from '../hike/hike.module';
import { TagModule } from '../tag/tag.module';
import { FilesModule } from '../file/file.module';

@Module({
    providers: [PhotoResolver, PhotoService],
    imports: [
        FilesModule,
        TypeOrmModule.forFeature([PhotoEntity]),
        UserModule,
        HikeModule,
        TagModule,
    ],
})
export class PhotoModule {}
