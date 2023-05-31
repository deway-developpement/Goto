import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString, Matches } from 'class-validator';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Difficulty } from './difficulty.dto';
import { FileUpload } from '../../file/interfaces/fileupload.type';

@InputType()
export class HikeInput {
    @Field(() => String)
    @Matches(RegExp(/^[\s\w:'?!$&%\-.]{2,25}$/), { message: "Name don't follow the rules" })
    name: string;

    @Field(() => String)
    @IsString()
    description: string;

    @Field(() => Difficulty)
    @IsString()
    difficulty: Difficulty;

    @Field(() => GraphQLUpload)
    track: Promise<FileUpload>;

    @Field(() => Number)
    @IsNumber()
    latitude: number;

    @Field(() => Number)
    @IsNumber()
    longitude: number;

    @Field(() => [String])
    tagsId: string[];

    @Field(() => String)
    @IsString()
    categoryId: string;
}
