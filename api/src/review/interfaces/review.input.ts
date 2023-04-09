import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class ReviewInput {
    @Field(() => Number)
    @IsInt({ message: 'Rating must be an integer' })
    rating: number;

    @Field(() => String)
    @IsString()
    hikeId: string;
}
