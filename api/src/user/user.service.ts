import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './interfaces/user.entity';
import { BadRequestException } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { UserInput } from './interfaces/user.input';
import { QueryService } from '@nestjs-query/core';
import { AuthType } from '../auth/interface/auth.type';

@QueryService(UserEntity)
export class UserService extends TypeOrmQueryService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {
        super(userRepository);
    }

    async newUser(input: UserInput): Promise<UserEntity> {
        // create a new user
        const createUserDto = {
            ...input,
        } as UserEntity;
        createUserDto.credidential = AuthType.user;
        // generate a 4-char random unique code
        createUserDto.publicKey = Math.random()
            .toString(36)
            .toUpperCase()
            .substr(2, 5)
            .padStart(5, '0');
        // generate a salt
        const salt = await genSalt(10);
        // hash the password with the salt
        createUserDto.password = await hash(createUserDto.password, salt);
        await this.userRepository.insert(createUserDto).catch(() => {
            throw new BadRequestException('Email already exists');
        });
        return this.userRepository.findOne({ where: { email: createUserDto.email } });
    }

    async findByEmail(email: string): Promise<UserEntity> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findByPublic(pseudo: string, publicKey: string): Promise<UserEntity> {
        return this.userRepository.findOne({ where: { pseudo, publicKey } });
    }

    async delete(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id } });
        await this.userRepository.delete(id);
        return user;
    }

    async update(id: string, input: Partial<UserEntity>): Promise<UserEntity> {
        if (input.password) {
            const salt = await genSalt(10);
            input.password = await hash(input.password, salt);
        }
        await this.userRepository.update(id, {
            ...input,
        });
        return this.userRepository.findOne({ where: { id } });
    }

    async exists(email: string): Promise<boolean> {
        return !!(await this.userRepository.findOne({ where: { email } }));
    }

    async addFriend(id: string, friendId: string): Promise<UserEntity> {
        if (id === friendId) {
            throw new BadRequestException('You can not add yourself as a friend');
        }
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user.friends) {
            user.friends = [];
        }
        const friend = await this.userRepository.findOne({ where: { id: friendId } });
        if (!friend) {
            throw new BadRequestException('Friend not found');
        }
        user.friends.push(friend);
        return await this.userRepository.save(user);
    }

    async removeFriend(id: string, friendId: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user.friends) {
            user.friends = [];
        }
        const friend = await this.userRepository.findOne({ where: { id: friendId } });
        if (!friend || !user.friends.find((f) => f.id === friend?.id)) {
            throw new BadRequestException('Friend not found');
        }
        user.friends = user.friends.filter((f) => f.id !== friend.id);
        return await this.userRepository.save(user);
    }
}
