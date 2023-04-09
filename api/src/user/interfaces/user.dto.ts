import {
    FilterableField,
    IDField,
    PagingStrategies,
    QueryOptions,
    Relation,
    UnPagedRelation,
} from '@nestjs-query/query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { credidentialMiddleware, idMiddleware, pwdMiddleware } from '../../auth/auth.middleware';
import { PhotoDTO } from '../../photo/interfaces/photo.dto';

@ObjectType('User')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@UnPagedRelation('friends', () => UserDTO, { disableRemove: true, disableUpdate: true })
@Relation('avatar', () => PhotoDTO, { disableRemove: true, disableUpdate: true, nullable: true })
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

    @FilterableField(() => Date)
    createdAt!: Date;
}
