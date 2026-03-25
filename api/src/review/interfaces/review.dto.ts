import {
    FilterableField,
    FilterableRelation,
    IDField,
    PagingStrategies,
    QueryOptions,
} from '@ptc-org/nestjs-query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { UserDTO } from '../../user/interfaces/user.dto';
import { HikeDTO } from '../../hike/interfaces/hike.dto';

@ObjectType('Review')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@FilterableRelation('user', () => UserDTO)
@FilterableRelation('hike', () => HikeDTO)
export class ReviewDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField(() => Number)
    rating!: number;

    @FilterableField(() => Date)
    createdAt!: Date;
}
