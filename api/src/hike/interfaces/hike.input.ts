import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, Matches } from 'class-validator';

@InputType()
export class HikeInput {
    @Field(() => String)
    @Matches(RegExp(/^[\S\W]{2,10}$/), { message: "Name don't follow the rules" })
    name: string;

    @Field(() => Number)
    @IsNumber()
    distance: number;

    @Field(() => Number)
    @IsNumber()
    elevation: number;

    @Field(() => String)
    description: string;

    @Field(() => String)
    difficulty: string;
}
