import { InputType, Field, ID } from '@nestjs/graphql';
import { FilterableField } from '@nestjs-query/query-graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class MessageInput {
    @Field(() => ID, { description: 'sender of the message' })
    @IsNotEmpty()
    readonly sender: string;
    @Field(() => String, { description: 'Content of the message' })
    @IsString()
    @IsNotEmpty()
    readonly content: string;
}

@InputType()
export class UpdateMessageInput {
    @Field(() => ID, { description: 'sender of the message', nullable: true })
    readonly sender?: string;
    @Field(() => String, { description: 'Content of the message', nullable: true })
    readonly content?: string;
}

@InputType()
export class FilterMessageInput {
    @FilterableField(() => [ID], { description: 'id of the message', nullable: true })
    readonly _id?: [string];
    @FilterableField(() => [ID], { description: 'sender of the message', nullable: true })
    readonly sender?: [string];
    @FilterableField(() => [String], { description: 'Content of the message', nullable: true })
    readonly content?: [string];
    @FilterableField(() => [Date], { description: 'Date of the message', nullable: true })
    readonly date?: [Date];
}
