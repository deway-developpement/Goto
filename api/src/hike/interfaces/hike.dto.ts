import {
    FilterableField,
    IDField,
    PagingStrategies,
    QueryOptions,
    Relation,
} from '@nestjs-query/query-graphql';
import { ObjectType, ID, Field } from '@nestjs/graphql';
import { pwdMiddleware } from '../../auth/auth.middleware';
import { UserDTO } from '../../users/interfaces/user.dto';
import { Difficulty } from './difficulty.dto';

@ObjectType('Hike')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@Relation('owner', () => UserDTO, { disableRemove: true, disableUpdate: true })
export class HikeDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField({ middleware: [pwdMiddleware] })
    name!: string;

    @FilterableField(() => Number)
    distance!: number;

    @FilterableField(() => Number)
    elevation!: number;

    @Field(() => String)
    description!: string;

    @Field(() => Difficulty)
    difficulty!: Difficulty;

    @FilterableField(() => Date)
    createdAt!: Date;
}
