import { ObjectType, Field } from '@nestjs/graphql';
import { HikeDTO } from '../../../hike/interfaces/hike.dto';
import { PageInfoDTO } from '../../pageInfo/interface/pageinfo.dto';

@ObjectType('CustomHikeConnection')
export class HikeConnectionDTO {
    @Field(() => PageInfoDTO)
    pageInfo: PageInfoDTO;

    @Field(() => [HikeEdgeDTO])
    edges: HikeEdgeDTO[];

    @Field(() => Number)
    totalCount: number;
}

@ObjectType('CustomHikeEdge')
export class HikeEdgeDTO {
    @Field(() => String)
    cursor: string;

    @Field(() => HikeDTO)
    node: HikeDTO;
}
