import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { PointOfInterestResolver } from './poi.resolver';
import { PointOfInterestService } from './poi.service';
//import { HikeResolver } from './hike.resolver';
import { PointOfInterestDTO } from './interfaces/poi.dto';
import { PointOfInterestEntity } from './interfaces/poi.entity';

@Module({
    providers: [PointOfInterestResolver, PointOfInterestService],
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [NestjsQueryTypeOrmModule.forFeature([PointOfInterestEntity])],
            services: [PointOfInterestService],
            resolvers: [],
            dtos: [
                {
                    DTOClass: PointOfInterestDTO,
                    CreateDTOClass: PointOfInterestDTO,
                    UpdateDTOClass: PointOfInterestDTO,
                },
            ],
        }),
    ],
    exports: [PointOfInterestService],
})
export class PointOfInterestModule {}
