import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { User } from '../../users/interfaces/user.entity';

@Entity('messages')
@ObjectType()
export class Message {
    @Field(() => ID)
    @IsString()
    @IsNotEmpty()
    @PrimaryGeneratedColumn('uuid')
    readonly _id?: string;

    @Field(() => User, { description: 'sender of the message' })
    @IsNotEmpty()
    @ManyToOne(() => User)
    readonly sender: User;

    @Field(() => String, { description: 'Content of the message' })
    @IsNotEmpty()
    @Column()
    readonly content: string;

    @Field(() => String, { description: 'Date of the message' })
    @IsNotEmpty()
    @IsDate()
    @CreateDateColumn()
    readonly date: Date;
}
