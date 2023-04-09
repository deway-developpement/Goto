import {
    FilterableField,
    FilterableRelation,
    IDField,
    PagingStrategies,
    QueryOptions,
} from '@nestjs-query/query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { UserDTO } from '../../user/interfaces/user.dto';
import { HikeDTO } from '../../hike/interfaces/hike.dto';

@ObjectType('Review')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@FilterableRelation('user', () => UserDTO, {
    disableRemove: true,
    disableUpdate: true,
    enableAggregate: false,
})
@FilterableRelation('hike', () => HikeDTO, {
    disableRemove: true,
    disableUpdate: true,
    enableAggregate: false,
})
export class ReviewDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField(() => Number)
    rating!: number;

    @FilterableField(() => Date)
    createdAt!: Date;
}
