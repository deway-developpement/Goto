import { Field, InputType } from '@nestjs/graphql';
import { Matches } from 'class-validator';

@InputType()
export class TagInput {
    @Field(() => String)
    @Matches(RegExp(/^[\S\W]{2,10}$/), { message: "Name don't follow the rules" })
    name: string;
}
