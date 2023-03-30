import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './interfaces/user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { UserInput } from './interfaces/user.input';
import { QueryService } from '@nestjs-query/core';

@QueryService(UserEntity)
export class UserService extends TypeOrmQueryService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {
        super(userRepository);
    }

    async newUser(input: UserInput): Promise<UserEntity> {
        // check here if email isn't already used
        if (await this.userRepository.findOne({ where: { email: input.email } })) {
            throw new UnauthorizedException('Email already used');
        }
        // create a new user
        const createUserDto = {
            ...input,
        } as UserEntity;
        createUserDto.credidential = 1;
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
        const createdUser = this.userRepository.create(createUserDto as UserEntity);
        await this.userRepository.insert(createdUser);
        return createdUser;
    }

    async findById(id: string): Promise<UserEntity> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<UserEntity> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async findByPublic(pseudo: string, publicKey: string): Promise<UserEntity> {
        return await this.userRepository.findOne({ where: { pseudo, publicKey } });
    }

    async delete(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id } });
        await this.userRepository.delete(id);
        return user;
    }

    async update(id: string, input: Partial<UserEntity>): Promise<UserEntity> {
        const updateUserDto = {
            ...input,
            ...(await this.userRepository.findOne({ where: { id } })),
        } as UserEntity;
        if (input.password) {
            const salt = await genSalt(10);
            updateUserDto.password = await hash(input.password, salt);
        }
        return await this.userRepository.save({
            id,
            ...updateUserDto,
        });
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
}
