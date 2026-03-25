import {
    FilterableField,
    IDField,
    PagingStrategies,
    QueryOptions,
    Relation,
} from '@ptc-org/nestjs-query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { HikeDTO } from '../../hike/interfaces/hike.dto';
import { PhotoDTO } from '../../photo/interfaces/photo.dto';

@ObjectType('Category')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@Relation('hikes', () => HikeDTO, {
    nullable: true,
})
@Relation('defaultPhoto', () => PhotoDTO, {
    nullable: true,
})
export class CategoryDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField(() => String)
    name!: string;

    @FilterableField(() => Date)
    createdAt!: Date;
}
