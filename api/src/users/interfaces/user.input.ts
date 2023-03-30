import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

@InputType()
export class UserInput {
    @Field(() => String, { description: 'Pseudo of the user' })
    @Matches(RegExp(/^\S{2,10}$/), { message: "Pseudo don't follow the rules" })
    readonly pseudo: string;

    @Field(() => String, { description: 'E-mail of the user' })
    @IsEmail()
    readonly email: string;

    @Field(() => String, { description: 'Password of the user' })
    @IsString()
    readonly password: string;
}

@InputType()
export class UserUpdateInput {
    @Field(() => String, { description: 'Pseudo of the user', nullable: true })
    @IsOptional()
    @Matches(RegExp(/^\S{2,10}$/), { message: "Pseudo don't follow the rules" })
    readonly pseudo?: string;

    @Field(() => String, { description: 'E-mail of the user', nullable: true })
    @IsOptional()
    @IsEmail()
    readonly email?: string;

    @Field(() => String, { description: 'Password of the user', nullable: true })
    @IsOptional()
    @IsString()
    readonly password?: string;
}
