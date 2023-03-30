import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './interfaces/user.entity';
import { genSalt, hash } from 'bcrypt';
import { Connection } from 'typeorm';

@Injectable()
export class DataInit implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly connection: Connection
    ) {}

    async emptyTables() {
        console.log('Clearing database');
        // make a copy of the entities array
        const entities = this.connection.entityMetadatas.slice();
        let entity = null;
        do {
            entity = entities.shift();
            if (entity) {
                console.log('entity', entity.name);
                const repository = await this.connection.getRepository(entity.name);
                try {
                    const entries = await repository.find();
                    if (entries.length > 0) {
                        console.log('Clearing table', entity.name);
                        repository.remove(entries);
                    }
                } catch (e) {
                    console.log('Error while clearing table', entity.name, e);
                    entities.push(entity);
                }
            }
        } while (entity);
    }

    async onApplicationBootstrap() {
        // check if running in production
        if (process.env.NODE_ENV !== 'development') {
            return;
        }
        // remove everything in the database
        console.log('Clearing database');
        await this.emptyTables();
        const salt = await genSalt(10);
        await this.userRepository
            .save({
                pseudo: 'admin',
                email: 'admin@localhost',
                password: await hash('admin', salt),
                credidential: 8,
                publicKey: '00000',
            })
            .then(() => {
                console.log('Admin user created');
            });
    }
}
