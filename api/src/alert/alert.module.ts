import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { AlertResolver } from './alert.resolver';
import { AlertService } from './alert.service';
//import { HikeResolver } from './hike.resolver';
import { AlertDTO } from './interfaces/alert.dto';
import { AlertEntity } from './interfaces/alert.entity';
import { HikeModule } from '../hike/hike.module';

@Module({
    providers: [AlertResolver, AlertService],
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [NestjsQueryTypeOrmModule.forFeature([AlertEntity]), HikeModule],
            services: [AlertService],
            resolvers: [],
            dtos: [
                {
                    DTOClass: AlertDTO,
                    CreateDTOClass: AlertDTO,
                    UpdateDTOClass: AlertDTO,
                },
            ],
        }),
    ],
    exports: [AlertService],
})
export class AlertModule {}
