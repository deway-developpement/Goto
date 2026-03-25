import {
    FilterableField,
    IDField,
    PagingStrategies,
    QueryOptions,
    Relation,
    UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { HikeDTO } from '../../hike/interfaces/hike.dto';
import { UserDTO } from '../../user/interfaces/user.dto';

@ObjectType('Table')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@UnPagedRelation('hikes', () => HikeDTO, {
    nullable: true,
})
@Relation('owner', () => UserDTO, {
    nullable: true,
})
export class TableDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField(() => String)
    name!: string;

    @FilterableField(() => Date)
    createdAt!: Date;
}
