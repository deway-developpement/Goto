import {
    FilterableField,
    IDField,
    PagingStrategies,
    QueryOptions,
    Relation,
} from '@nestjs-query/query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { HikeDTO } from '../../hike/interfaces/hike.dto';

@ObjectType('tag')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@Relation('hikes', () => HikeDTO, { nullable: true })
export class TagDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField(() => String)
    name!: string;

    @FilterableField(() => Date)
    createdAt!: Date;
}
