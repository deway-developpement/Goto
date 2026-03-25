import {
    FilterableField,
    IDField,
    KeySet,
    PagingStrategies,
    Relation,
    UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { fieldMiddleware } from '../../auth/auth.middleware';
import { PhotoDTO } from '../../photo/interfaces/photo.dto';
import { PerformanceDTO } from '../../performance/interfaces/performance.dto';
import { ReviewDTO } from '../../review/interfaces/review.dto';
import { HikeDTO } from '../../hike/interfaces/hike.dto';
import { TableDTO } from '../../table/interfaces/table.dto';

@ObjectType('User')
@KeySet(['id'])
@UnPagedRelation('friends', () => UserDTO, {
    pagingStrategy: PagingStrategies.NONE,
    enableAggregate: true,
    enableTotalCount: true,
})
@UnPagedRelation('performances', () => PerformanceDTO, {
    enableAggregate: true,
    enableTotalCount: true,
})
@Relation('avatar', () => PhotoDTO, { nullable: true })
@UnPagedRelation('reviews', () => ReviewDTO, {
    enableAggregate: true,
    enableTotalCount: true,
})
@UnPagedRelation('likes', () => HikeDTO, {
    enableAggregate: true,
    enableTotalCount: true,
    pagingStrategy: PagingStrategies.CURSOR,
})
@UnPagedRelation('tables', () => TableDTO, {
    enableAggregate: true,
    enableTotalCount: true,
})
export class UserDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField()
    pseudo!: string;

    @FilterableField()
    email!: string;

    @FilterableField({ middleware: [fieldMiddleware] })
    password!: string;

    @FilterableField()
    publicKey!: string;

    @FilterableField()
    credidential!: number;

    @FilterableField()
    public!: boolean;

    @FilterableField(() => Date)
    createdAt!: Date;
}
