import {
    FilterableField,
    IDField,
    PagingStrategies,
    QueryOptions,
} from '@nestjs-query/query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { pwdMiddleware } from '../../auth/auth.middleware';

@ObjectType('Hike')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
export class HikeDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField({ middleware: [pwdMiddleware] })
    name!: string;

    @FilterableField()
    distance!: number;
}
