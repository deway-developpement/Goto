import { Module } from '@nestjs/common';
import { PhotoResolver } from './photo.resolver';
import { PhotoService } from './photo.service';
//import { HikeResolver } from './hike.resolver';
import { PhotoEntity } from './interfaces/photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { HikeModule } from '../hike/hike.module';
import { FilesModule } from '../file/file.module';
import { CategoryModule } from '../category/category.module';
import { PointOfInterestModule } from '../pointOfInterest/poi.module';

@Module({
    providers: [PhotoResolver, PhotoService],
    imports: [
        TypeOrmModule.forFeature([PhotoEntity]),
        UserModule,
        PointOfInterestModule,
        HikeModule,
        CategoryModule,
        FilesModule,
    ],
})
export class PhotoModule {}
