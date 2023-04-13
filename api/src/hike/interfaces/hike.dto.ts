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
import { UserDTO } from '../../user/interfaces/user.dto';
import { Difficulty } from './difficulty.dto';
import { TagDTO } from '../../tag/interfaces/tag.dto';
import { PhotoDTO } from '../../photo/interfaces/photo.dto';
import { PointOfInterestDTO } from '../../pointOfInterest/interfaces/poi.dto';
import { ReviewDTO } from '../../review/interfaces/review.dto';
import { AlertDTO } from '../../alert/interfaces/alert.dto';

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
@FilterableUnPagedRelation('reviews', () => ReviewDTO, {
    nullable: true,
    disableRemove: true,
    disableUpdate: true,
    enableAggregate: true,
})
@FilterableUnPagedRelation('alerts', () => AlertDTO, {
    nullable: true,
    disableRemove: true,
    disableUpdate: true,
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
