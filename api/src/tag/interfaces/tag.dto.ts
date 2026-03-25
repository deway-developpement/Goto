import {
    FilterableField,
    IDField,
    PagingStrategies,
    QueryOptions,
    UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { HikeDTO } from '../../hike/interfaces/hike.dto';

@ObjectType('Tag')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@UnPagedRelation('hikes', () => HikeDTO, {
    nullable: true,
})
export class TagDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField(() => String)
    name!: string;

    @FilterableField(() => Date)
    createdAt!: Date;
}
