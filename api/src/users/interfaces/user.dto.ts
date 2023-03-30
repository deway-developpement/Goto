import {
    FilterableField,
    IDField,
    PagingStrategies,
    QueryOptions,
    UnPagedRelation,
} from '@nestjs-query/query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { credidentialMiddleware, idMiddleware, pwdMiddleware } from '../../auth/auth.middleware';

@ObjectType('User')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@UnPagedRelation('friends', () => UserDTO, { disableRemove: true, disableUpdate: true })
export class UserDTO {
    @IDField(() => ID, { middleware: [idMiddleware] })
    id!: string;

    @FilterableField()
    pseudo!: string;

    @FilterableField()
    email!: string;

    @FilterableField({ middleware: [pwdMiddleware] })
    password!: string;

    @FilterableField()
    publicKey!: string;

    @FilterableField({ middleware: [credidentialMiddleware] })
    credidential!: number;
}
