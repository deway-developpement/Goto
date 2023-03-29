import { Injectable } from '@nestjs/common';
import { SearchUserInput } from './user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
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

    async findOne({
        email,
        input,
        id,
    }: {
        email?: string;
        input?: SearchUserInput;
        id?: string;
    }): Promise<User> {
        const filter = {};
        if (email) {
            filter['email'] = email;
        }
        if (id) {
            filter['_id'] = id;
        }
        if (input) {
            filter['pseudo'] = input?.pseudo;
            filter['publicKey'] = input?.publicKey;
        }
        return await this.userRepository.findOne({ where: filter, relations: ['friends'] });
    }

    async findAll(filter: Brackets, orderBy: any): Promise<User[]> {
        const qb = this.userRepository.createQueryBuilder('u').where(filter);
        const users = qb.getMany();
        console.log(users);
        return users;
    }

    async delete(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { _id: id } });
        await this.userRepository.delete(id);
        return user;
    }

    async update(id: string, input: any): Promise<User> {
        if (input.password) {
            const salt = await genSalt(10);
            input.password = await hash(input.password, salt);
        }
        let user = await this.userRepository.findOne({ where: { _id: id } });
        user = { ...user, ...input };
        await this.userRepository.update(id, user);
        return this.userRepository.findOne({ where: { _id: id } });
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
