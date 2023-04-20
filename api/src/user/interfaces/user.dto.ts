import {
    FilterableField,
    IDField,
    PagingStrategies,
    QueryOptions,
    Relation,
    UnPagedRelation,
} from '@nestjs-query/query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { fieldMiddleware } from '../../auth/auth.middleware';
import { PhotoDTO } from '../../photo/interfaces/photo.dto';

@ObjectType('User')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@UnPagedRelation('friends', () => UserDTO, { disableRemove: true, disableUpdate: true })
@Relation('avatar', () => PhotoDTO, { disableRemove: true, disableUpdate: true, nullable: true })
export class UserDTO {
    @IDField(() => ID, { middleware: [fieldMiddleware] })
    id!: string;

    @FilterableField()
    pseudo!: string;

    @FilterableField()
    email!: string;

    @FilterableField({ middleware: [fieldMiddleware] })
    password!: string;

    @FilterableField()
    publicKey!: string;

    @FilterableField({ middleware: [fieldMiddleware] })
    credidential!: number;

    @FilterableField(() => Date)
    createdAt!: Date;
}
