import {
    FilterableField,
    IDField,
    PagingStrategies,
    QueryOptions,
} from '@nestjs-query/query-graphql';
import { ObjectType, ID, HideField } from '@nestjs/graphql';
import { UserDTO } from '../../user/interfaces/user.dto';
import { HikeEntity } from '../../hike/interfaces/hike.entity';
import { PointOfInterestDTO } from '../../pointOfInterest/interfaces/poi.dto';
import { CategoryDTO } from '../../category/interfaces/category.dto';

@ObjectType('Photo')
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
    category?: CategoryDTO;

    @HideField()
    pointOfInterest?: PointOfInterestDTO;

    @FilterableField(() => Date)
    createdAt!: Date;
}
