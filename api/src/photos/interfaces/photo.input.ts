import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Stream } from 'stream';

export enum ObjType {
    HIKE,
    USER,
    TAG,
}

registerEnumType(ObjType, {
    name: 'ObjType',
});

export interface FileUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream;
}

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
