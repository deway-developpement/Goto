import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './interfaces/user.entity';
import { PubSubModule } from '../pubsub/pubsub.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), PubSubModule],
    controllers: [],
    providers: [UsersResolver, UsersService],
    exports: [UsersService],
})
export class UsersModule {}
