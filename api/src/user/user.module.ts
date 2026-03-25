import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserEntity } from './interfaces/user.entity';
import { DataCleanUp, DataInit } from './user.init';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { UserDTO } from './interfaces/user.dto';

@Module({
    providers: [UserResolver, UserService, DataInit, DataCleanUp],
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
export class UserModule {}
