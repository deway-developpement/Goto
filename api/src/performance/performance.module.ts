import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { PerfomanceResolver } from './performance.resolver';
import { PerfomanceService } from './performance.service';
//import { HikeResolver } from './hike.resolver';
import { PerformanceDTO } from './interfaces/performance.dto';
import { PerformanceEntity } from './interfaces/performance.entity';
import { FilesModule } from '../file/file.module';
import { HikeModule } from '../hike/hike.module';

@Module({
    providers: [PerfomanceResolver, PerfomanceService],
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [
                NestjsQueryTypeOrmModule.forFeature([PerformanceEntity]),
                HikeModule,
                FilesModule,
            ],
            services: [PerfomanceService],
            resolvers: [],
            dtos: [
                {
                    DTOClass: PerformanceDTO,
                    CreateDTOClass: PerformanceDTO,
                    UpdateDTOClass: PerformanceDTO,
                },
            ],
        }),
    ],
})
export class PerformanceModule {}
