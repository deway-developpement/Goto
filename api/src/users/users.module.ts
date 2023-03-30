import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserEntity } from './interfaces/user.entity';
import { DataInit } from './user.init';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { UserDTO } from './interfaces/user.dto';

@Module({
    providers: [UserResolver, UserService, DataInit],
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [NestjsQueryTypeOrmModule.forFeature([UserEntity])],
            services: [UserService],
            resolvers: [],
            dtos: [{ DTOClass: UserDTO, CreateDTOClass: UserDTO, UpdateDTOClass: UserDTO }],
        }),
    ],
    exports: [UserService],
})
export class UsersModule {}
