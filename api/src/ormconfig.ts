import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { UserEntity } from './user/interfaces/user.entity';
import { HikeEntity } from './hike/interfaces/hike.entity';
import { PhotoEntity } from './photo/interfaces/photo.entity';
import { PointOfInterestEntity } from './pointOfInterest/interfaces/poi.entity';
import { PerformanceEntity } from './performance/interfaces/performance.entity';
import { ReviewEntity } from './review/interfaces/review.entity';
import { AlertEntity } from './alert/interfaces/alert.entity';
import { TagEntity } from './tag/interfaces/tag.entity';
import { CategoryEntity } from './category/interfaces/category.entity';
import { TableEntity } from './table/interfaces/table.entity';

config();

const configService = new ConfigService();

export default new DataSource({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: configService.get('DATABASE_USERNAME'),
    password: configService.get('DATABASE_PASSWORD'),
    database: 'Goto',
    entities: [
        UserEntity,
        HikeEntity,
        PhotoEntity,
        PointOfInterestEntity,
        PerformanceEntity,
        ReviewEntity,
        AlertEntity,
        TagEntity,
        CategoryEntity,
        ReviewEntity,
        TableEntity,
    ],
    migrations: ['migrations/**/*.ts'],
    synchronize: true,
});
