import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    ManyToMany,
    JoinTable,
    OneToOne,
} from 'typeorm';
import { PhotoEntity } from '../../photos/interfaces/photo.entity';

@Entity('user')
@Unique(['pseudo', 'publicKey'])
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column()
    readonly pseudo: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    publicKey: string;

    @Column()
    credidential: number;

    // friend relation M2M
    @ManyToMany(() => UserEntity, (user) => user.friends)
    @JoinTable({ name: 'users_friends' })
    friends?: UserEntity[];

    @OneToOne(() => PhotoEntity, (photo) => photo.user, { cascade: ['remove'] })
    avatar?: PhotoEntity;

    @Column({ nullable: true })
    readonly refresh_token?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
