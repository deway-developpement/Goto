import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './interfaces/user.entity';
import { DataInit } from './user.init';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [],
    providers: [UsersResolver, UsersService, DataInit],
    exports: [UsersService],
})
export class UsersModule {}
