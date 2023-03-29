import { Injectable } from '@nestjs/common';
import { MessageInput, FilterMessageInput } from './hike.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './interfaces/hike.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/user.entity';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
        private usersService: UsersService
    ) {}

    async create(input: MessageInput): Promise<Message> {
        const createMessageDto = {
            sender: await this.usersService.findOne({ id: input.sender }),
            content: input.content,
        };
        const createdMessage = this.messagesRepository.create(createMessageDto);
        await this.messagesRepository.insert(createdMessage);
        return createdMessage;
    }

    async newMessage(user: User, content: string): Promise<Message> {
        return this.create({
            sender: user._id,
            content,
        });
    }

    async findOne(id: string): Promise<Message> {
        return await this.messagesRepository.findOne({ relations: ['sender'], where: { _id: id } });
    }
    async findAll(filter: FilterMessageInput): Promise<Message[]> {
        return await this.messagesRepository.find({
            relations: ['sender'],
            where: filter || {},
            order: { date: 'ASC' },
        });
    }

    async delete(id: string): Promise<Message> {
        const msg = await this.findOne(id);
        if (!msg) {
            return null;
        }
        await this.messagesRepository.delete(id);
        return msg;
    }

    async update(id: string, content: string): Promise<Message> {
        await this.messagesRepository.update(id, { content: content });
        return await this.findOne(id);
    }
}
