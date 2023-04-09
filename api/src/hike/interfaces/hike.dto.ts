import {
    FilterableField,
    FilterableUnPagedRelation,
    IDField,
    PagingStrategies,
    QueryOptions,
    Relation,
    UnPagedRelation,
} from '@nestjs-query/query-graphql';
import { ObjectType, ID, Field } from '@nestjs/graphql';
import { UserDTO } from '../../users/interfaces/user.dto';
import { Difficulty } from './difficulty.dto';
import { TagDTO } from '../../tags/interfaces/tag.dto';
import { PhotoDTO } from '../../photos/interfaces/photo.dto';
import { PointOfInterestDTO } from '../../PointOfInterests/interfaces/poi.dto';

@ObjectType('Hike')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@Relation('owner', () => UserDTO, { disableRemove: true, disableUpdate: true })
@FilterableUnPagedRelation('tags', () => TagDTO, {
    nullable: true,
    disableRemove: true,
    disableUpdate: true,
    enableAggregate: false,
})
@UnPagedRelation('photos', () => PhotoDTO, {
    nullable: true,
    disableRemove: true,
    disableUpdate: true,
    enableAggregate: false,
})
@FilterableUnPagedRelation('pointsOfInterest', () => PointOfInterestDTO, {
    nullable: true,
    disableRemove: true,
    disableUpdate: true,
    enableAggregate: false,
    relationName: 'pointsOfInterest',
})
export class HikeDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField(() => String)
    name!: string;

    @FilterableField(() => Number)
    distance!: number;

    @FilterableField(() => Number)
    elevation!: number;

    @Field(() => String)
    description!: string;

    @FilterableField(() => Difficulty)
    difficulty!: Difficulty;

    @FilterableField(() => Number, { nullable: true })
    duration!: number;

    @Field(() => String)
    track!: string;

    @FilterableField(() => Date)
    createdAt!: Date;
}
