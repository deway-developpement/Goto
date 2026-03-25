import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { ReviewResolver } from './review.resolver';
import { ReviewService } from './review.service';
//import { HikeResolver } from './hike.resolver';
import { ReviewDTO } from './interfaces/review.dto';
import { ReviewEntity } from './interfaces/review.entity';
import { HikeModule } from '../hike/hike.module';

@Module({
    providers: [ReviewResolver, ReviewService],
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [NestjsQueryTypeOrmModule.forFeature([ReviewEntity]), HikeModule],
            services: [ReviewService],
            resolvers: [],
            dtos: [
                {
                    DTOClass: ReviewDTO,
                    CreateDTOClass: ReviewDTO,
                    UpdateDTOClass: ReviewDTO,
                },
            ],
        }),
    ],
})
export class ReviewModule {}
