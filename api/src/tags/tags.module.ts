import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';
//import { HikeResolver } from './hike.resolver';
import { TagDTO } from './interfaces/tag.dto';
import { TagEntity } from './interfaces/tag.entity';

@Module({
    providers: [TagResolver, TagService],
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [NestjsQueryTypeOrmModule.forFeature([TagEntity])],
            services: [TagService],
            resolvers: [],
            dtos: [{ DTOClass: TagDTO, CreateDTOClass: TagDTO, UpdateDTOClass: TagDTO }],
        }),
    ],
    exports: [TagService],
})
export class TagModule {}
