import { Field, InputType } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from '../../file/interfaces/fileupload.type';
import { IsDate, IsNumber } from 'class-validator';

@InputType()
export class PerformanceInput {
    @Field()
    @IsDate()
    date: Date;

    @Field()
    @IsNumber()
    duration: number;

    @Field()
    @IsNumber()
    distance: number;

    @Field()
    @IsNumber()
    elevation: number;

    @Field(() => GraphQLUpload)
    file: FileUpload;

    @Field()
    hikeId: string;
}
