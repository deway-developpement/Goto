import { Field, InputType } from '@nestjs/graphql';
import { IsString, Matches } from 'class-validator';

@InputType()
export class TagInput {
    @Field(() => String)
    @IsString()
    @Matches(RegExp(/^[\S\W]{2,25}$/), { message: "Name don't follow the rules" })
    name: string;
}
