import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    ManyToMany,
    JoinTable,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { PhotoEntity } from '../../photo/interfaces/photo.entity';
import { PerformanceEntity } from '../../performance/interfaces/performance.entity';
import { ReviewEntity } from '../../review/interfaces/review.entity';
import { HikeEntity } from '../../hike/interfaces/hike.entity';
import { TableEntity } from '../../table/interfaces/table.entity';

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
    @ManyToMany(() => UserEntity, (user) => user.friends, { onDelete: 'CASCADE' })
    @JoinTable({ name: 'users_friends' })
    friends?: UserEntity[];

    // performance relation O2M
    @OneToMany(() => PerformanceEntity, (performance) => performance.user, { cascade: ['remove'] })
    performances?: PerformanceEntity[];

    @OneToOne(() => PhotoEntity, (photo) => photo.user, { cascade: ['remove'] })
    avatar?: PhotoEntity;

    @OneToMany(() => ReviewEntity, (review) => review.user, { cascade: ['remove'] })
    reviews?: ReviewEntity[];

    @ManyToMany(() => HikeEntity, { onDelete: 'CASCADE' })
    @JoinTable({ name: 'users_likes' })
    likes?: HikeEntity[];

    @OneToMany(() => TableEntity, (table) => table.owner, { onDelete: 'CASCADE' })
    tables?: TableEntity[];

    @Column({ nullable: true })
    readonly refresh_token?: string;

    @Column({ nullable: true })
    public: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
