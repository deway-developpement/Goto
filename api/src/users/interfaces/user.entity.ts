import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { pwdMiddleware, idMiddleware, credidentialMiddleware } from '../../auth/auth.middleware';

@Entity('users')
@Unique(['pseudo', 'publicKey'])
@ObjectType()
export class User {
    @Field(() => ID, { middleware: [idMiddleware] })
    @IsString()
    @IsNotEmpty()
    @PrimaryGeneratedColumn('uuid')
    readonly _id?: string;

    @Field(() => String, { description: 'Pseudo of the user' })
    @IsString()
    @IsNotEmpty()
    @Column()
    readonly pseudo: string;

    @Field(() => String, { description: 'E-mail of the user' })
    @IsEmail()
    @IsNotEmpty()
    @Column({ unique: true })
    email: string;

    @Field(() => String, { description: 'Password of the user', middleware: [pwdMiddleware] })
    @IsString()
    @IsNotEmpty()
    @Column()
    password: string;

    @Field(() => String, { description: 'Public key of the user' })
    @IsString()
    @IsNotEmpty()
    @Column()
    publicKey: string;

    @Field(() => Number, {
        description: 'access of the user : bin rwrw',
        middleware: [credidentialMiddleware],
    })
    @IsNotEmpty()
    @Column()
    credidential: number;

    @HideField()
    @Column({ nullable: true })
    readonly refresh_token: string;
}
