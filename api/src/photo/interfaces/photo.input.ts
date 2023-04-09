import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from '../../file/interfaces/fileupload.type';

export enum ObjType {
    HIKE,
    USER,
    TAG,
}

registerEnumType(ObjType, {
    name: 'ObjType',
});

@InputType()
export class PhotoInput {
    @Field(() => String)
    @IsString()
    objId: string;

    @Field(() => ObjType)
    objType: ObjType;

    @Field(() => GraphQLUpload)
    file: Promise<FileUpload>;
}
