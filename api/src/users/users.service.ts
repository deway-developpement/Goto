import { Injectable } from '@nestjs/common';
import { FilterUserInput } from './user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './interfaces/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    connectedUsers = [];

    async create(createUserDto: User): Promise<User> {
        // generate a salt
        const salt = await genSalt(10);
        // hash the password with the salt
        createUserDto.password = await hash(createUserDto.password, salt);
        const createdUser = this.userRepository.create(createUserDto);
        await this.userRepository.insert(createdUser);
        return createdUser;
    }

    async newUser(createUserDto: any): Promise<User> {
        // check here if email isn't already used
        if (await this.userRepository.findOne({ where: { email: createUserDto.email } })) {
            throw new UnauthorizedException('Email already used');
        }
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
        const createdUser = this.userRepository.create(createUserDto as User);
        await this.userRepository.insert(createdUser);
        return createdUser;
    }

    async findOne(input: any, type = 'id'): Promise<User> {
        if (type == 'email') {
            return await this.userRepository.findOne({ where: { email: input } });
        }
        if (type == 'input') {
            return await this.userRepository.findOne({
                where: { pseudo: input.pseudo, publicKey: input.publicKey },
            });
        }
        return await this.userRepository.findOne({ where: { _id: input } });
    }
    async findAll(filter: FilterUserInput): Promise<User[]> {
        return await this.userRepository.find({
            where: filter || {}, //TODO correct filter format here
        });
    }

    async delete(id: string): Promise<User> {
        const user = await this.userRepository.findOne(id);
        await this.userRepository.delete(id);
        return user;
    }

    async update(id: string, input: any): Promise<User> {
        if (input.password) {
            const salt = await genSalt(10);
            input.password = await hash(input.password, salt);
        }
        let user = await this.userRepository.findOne(id);
        user = { ...user, ...input };
        await this.userRepository.update(id, user);
        return this.userRepository.findOne(id);
    }

    async addConnectedUser(user: User) {
        this.connectedUsers.push(user);
    }
    async removeConnectedUser(user: User) {
        this.connectedUsers = this.connectedUsers.filter(
            (connectedUser) => connectedUser._id != user._id
        );
    }

    async isConnected(id: string): Promise<boolean> {
        return this.connectedUsers.some((connectedUser) => connectedUser._id == id);
    }
}
