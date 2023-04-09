import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, Matches } from 'class-validator';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Difficulty } from './difficulty.dto';
import { FileUpload } from '../../file/interfaces/fileupload.type';

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

    @Field(() => Difficulty)
    difficulty: Difficulty;

    @Field(() => GraphQLUpload)
    track: Promise<FileUpload>;

    @Field(() => [String])
    tagsId: string[];
}
