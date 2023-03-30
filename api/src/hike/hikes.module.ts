import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { HikeResolver } from './hike.resolver';
import { HikeService } from './hike.service';
//import { HikeResolver } from './hike.resolver';
import { HikeDTO } from './interfaces/hike.dto';
import { HikeEntity } from './interfaces/hike.entity';

@Module({
    providers: [HikeResolver],
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [NestjsQueryTypeOrmModule.forFeature([HikeEntity])],
            services: [HikeService],
            resolvers: [],
            dtos: [{ DTOClass: HikeDTO, CreateDTOClass: HikeDTO, UpdateDTOClass: HikeDTO }],
        }),
    ],
})
export class HikeModule {}
