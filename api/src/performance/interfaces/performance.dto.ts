import {
    FilterableField,
    FilterableRelation,
    IDField,
    PagingStrategies,
    QueryOptions,
} from '@ptc-org/nestjs-query-graphql';
import { ObjectType, ID, Field } from '@nestjs/graphql';
import { UserDTO } from '../../user/interfaces/user.dto';
import { HikeDTO } from '../../hike/interfaces/hike.dto';

@ObjectType('Performance')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@FilterableRelation('user', () => UserDTO)
@FilterableRelation('hike', () => HikeDTO, {
    enableTotalCount: true,
})
export class PerformanceDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField()
    date!: Date;

    @FilterableField()
    distance!: number;

    @FilterableField()
    elevation!: number;

    @FilterableField()
    duration!: number;

    @Field()
    track!: string;

    @FilterableField(() => Date)
    createdAt!: Date;
}
