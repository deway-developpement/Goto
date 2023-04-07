import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { HikeResolver } from './hike.resolver';
import { HikeService } from './hike.service';
//import { HikeResolver } from './hike.resolver';
import { HikeDTO } from './interfaces/hike.dto';
import { HikeEntity } from './interfaces/hike.entity';
import { TagService } from '../tags/tag.service';
import { TagEntity } from '../tags/interfaces/tag.entity';

@Module({
    providers: [HikeResolver, HikeService],
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [
                NestjsQueryTypeOrmModule.forFeature([HikeEntity]),
                NestjsQueryTypeOrmModule.forFeature([TagEntity]),
            ],
            services: [HikeService, TagService],
            resolvers: [],
            dtos: [{ DTOClass: HikeDTO, CreateDTOClass: HikeDTO, UpdateDTOClass: HikeDTO }],
        }),
    ],
    exports: [HikeService],
})
export class HikeModule {}
