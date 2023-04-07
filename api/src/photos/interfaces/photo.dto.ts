import {
    FilterableField,
    IDField,
    PagingStrategies,
    QueryOptions,
} from '@nestjs-query/query-graphql';
import { ObjectType, ID, HideField } from '@nestjs/graphql';
import { UserDTO } from '../../users/interfaces/user.dto';
import { HikeEntity } from '../../hike/interfaces/hike.entity';
import { TagDTO } from '../../tags/interfaces/tag.dto';

@ObjectType('photo')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
export class PhotoDTO {
    @IDField(() => ID)
    id!: string;

    @FilterableField(() => String)
    filename!: string;

    @HideField()
    user?: UserDTO;

    @HideField()
    hike?: HikeEntity;

    @HideField()
    tag?: TagDTO;

    @FilterableField(() => Date)
    createdAt!: Date;
}
