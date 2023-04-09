import {
    FilterableField,
    IDField,
    PagingStrategies,
    QueryOptions,
    Relation,
    UnPagedRelation,
} from '@nestjs-query/query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { HikeDTO } from '../../hike/interfaces/hike.dto';
import { PhotoDTO } from '../../photo/interfaces/photo.dto';

@ObjectType('tag')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@UnPagedRelation('hikes', () => HikeDTO, {
    nullable: true,
    disableRemove: true,
    disableUpdate: true,
})
@Relation('defaultPhoto', () => PhotoDTO, {
    nullable: true,
    disableRemove: true,
    disableUpdate: true,
})
export class TagDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField(() => String)
    name!: string;

    @FilterableField(() => Date)
    createdAt!: Date;
}
