import {
    FilterableField,
    FilterableRelation,
    IDField,
    PagingStrategies,
    QueryOptions,
} from '@nestjs-query/query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { HikeDTO } from '../../hike/interfaces/hike.dto';
import { UserDTO } from '../../user/interfaces/user.dto';
import { AlertType } from './alert.type';

@ObjectType('alert')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@FilterableRelation('hike', () => HikeDTO, {
    disableRemove: true,
    disableUpdate: true,
})
@FilterableRelation('author', () => UserDTO, {
    disableRemove: true,
    disableUpdate: true,
})
export class AlertDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField(() => Number)
    latitude!: number;

    @FilterableField(() => Number)
    longitude!: number;

    @FilterableField(() => AlertType)
    type!: AlertType;

    @FilterableField(() => Date)
    createdAt!: Date;
}
