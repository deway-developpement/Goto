import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { HikeResolver } from './hike.resolver';
import { HikeService } from './hike.service';
//import { HikeResolver } from './hike.resolver';
import { HikeDTO } from './interfaces/hike.dto';
import { HikeEntity } from './interfaces/hike.entity';
import { TagModule } from '../tag/tag.module';
import { FilesModule } from '../file/file.module';

@Module({
    providers: [HikeResolver, HikeService],
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [NestjsQueryTypeOrmModule.forFeature([HikeEntity]), TagModule, FilesModule],
            services: [HikeService],
            resolvers: [],
            dtos: [{ DTOClass: HikeDTO, CreateDTOClass: HikeDTO, UpdateDTOClass: HikeDTO }],
        }),
    ],
    exports: [HikeService],
})
export class HikeModule {}
