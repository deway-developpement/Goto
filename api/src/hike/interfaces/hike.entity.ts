import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    Unique,
    ManyToMany,
    OneToMany,
} from 'typeorm';
import { UserEntity } from '../../users/interfaces/user.entity';
import { Difficulty } from './difficulty.dto';
import { TagEntity } from '../../tags/interfaces/tag.entity';
import { PhotoEntity } from '../../photos/interfaces/photo.entity';

@Entity('hike')
@Unique(['name'])
export class HikeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    distance: number;

    @ManyToOne(() => UserEntity)
    owner: UserEntity;

    @Column()
    elevation: number;

    @Column()
    description: string;

    @Column('enum', {
        enum: Difficulty,
        default: Difficulty.EASY,
    })
    difficulty: Difficulty;

    @Column()
    duration: number;

    @Column()
    track: string;

    @ManyToMany(() => TagEntity, (tag) => tag.hikes)
    tags: TagEntity[];

    @OneToMany(() => PhotoEntity, (photo) => photo.hike, { cascade: ['remove'] })
    photos: PhotoEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
