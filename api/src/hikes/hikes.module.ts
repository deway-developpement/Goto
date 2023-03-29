import { Module } from '@nestjs/common';
import { MessagesResolver } from './hikes.resolver';
import { MessagesService } from './hikes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './interfaces/hike.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Message])],
    controllers: [],
    providers: [MessagesResolver, MessagesService],
    exports: [MessagesService],
})
export class MessagesModule {}
