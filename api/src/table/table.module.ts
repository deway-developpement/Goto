import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { TableResolver } from './table.resolver';
import { TableService } from './table.service';
//import { HikeResolver } from './hike.resolver';
import { TableDTO } from './interfaces/table.dto';
import { TableEntity } from './interfaces/table.entity';
import { HikeModule } from '../hike/hike.module';

@Module({
    providers: [TableResolver, TableService],
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [NestjsQueryTypeOrmModule.forFeature([TableEntity]), HikeModule],
            services: [TableService],
            resolvers: [],
            dtos: [{ DTOClass: TableDTO, CreateDTOClass: TableDTO, UpdateDTOClass: TableDTO }],
        }),
    ],
    exports: [TableService],
})
export class TableModule {}
