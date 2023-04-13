import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { AlertType } from './alert.type';

@InputType()
export class AlertInput {
    @Field(() => Number)
    @IsNumber()
    latitude: number;

    @Field(() => Number)
    @IsNumber()
    longitude: number;

    @Field(() => AlertType)
    type: AlertType;

    @Field(() => String)
    hikeId: string;
}
