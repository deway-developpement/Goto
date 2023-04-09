import { Module } from '@nestjs/common';
import { PhotoResolver } from './photo.resolver';
import { PhotoService } from './photo.service';
//import { HikeResolver } from './hike.resolver';
import { PhotoEntity } from './interfaces/photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { HikeModule } from '../hike/hikes.module';
import { TagModule } from '../tags/tags.module';
import { FilesModule } from '../files/files.module';

@Module({
    providers: [PhotoResolver, PhotoService],
    imports: [
        FilesModule,
        TypeOrmModule.forFeature([PhotoEntity]),
        UsersModule,
        HikeModule,
        TagModule,
    ],
})
export class PhotoModule {}
