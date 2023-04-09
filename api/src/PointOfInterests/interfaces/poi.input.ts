import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUrl, Matches } from 'class-validator';

@InputType()
export class PointOfInterestInput {
    @Field(() => String)
    @IsString()
    @Matches(RegExp(/^[\S\W]{2,25}$/), { message: "Name don't follow the rules" })
    name: string;

    @Field(() => String)
    @IsString()
    description: string;

    @Field(() => Number)
    latitude: number;

    @Field(() => Number)
    longitude: number;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsUrl()
    url?: string;
}
