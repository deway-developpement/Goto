import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('CustomPageInfo')
export class PageInfoDTO {
    @Field()
    hasNextPage: boolean;

    @Field()
    hasPreviousPage: boolean;

    @Field(() => String)
    startCursor: string;

    @Field(() => String)
    endCursor: string;
}
