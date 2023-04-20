import {
    FilterableField,
    FilterableUnPagedRelation,
    IDField,
    PagingStrategies,
    QueryOptions,
    Relation,
} from '@nestjs-query/query-graphql';
import { ObjectType, ID, Field } from '@nestjs/graphql';
import { HikeDTO } from '../../hike/interfaces/hike.dto';
import { PhotoDTO } from '../../photo/interfaces/photo.dto';

@ObjectType('PointOfInterest')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@FilterableUnPagedRelation('hikes', () => HikeDTO, {
    disableRemove: true,
    disableUpdate: true,
})
@Relation('photo', () => PhotoDTO, {
    nullable: true,
    disableRemove: true,
    disableUpdate: true,
})
export class PointOfInterestDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField(() => String)
    name!: string;

    @Field(() => String)
    description!: string;

    @FilterableField(() => Number)
    latitude!: number;

    @FilterableField(() => Number)
    longitude!: number;

    @Field(() => String, { nullable: true })
    url?: string;

    @FilterableField(() => Date)
    createdAt!: Date;
}
