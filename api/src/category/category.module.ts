import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
//import { HikeResolver } from './hike.resolver';
import { CategoryDTO } from './interfaces/category.dto';
import { CategoryEntity } from './interfaces/category.entity';

@Module({
    providers: [CategoryResolver, CategoryService],
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [NestjsQueryTypeOrmModule.forFeature([CategoryEntity])],
            services: [CategoryService],
            resolvers: [],
            dtos: [
                { DTOClass: CategoryDTO, CreateDTOClass: CategoryDTO, UpdateDTOClass: CategoryDTO },
            ],
        }),
    ],
    exports: [CategoryService],
})
export class CategoryModule {}
