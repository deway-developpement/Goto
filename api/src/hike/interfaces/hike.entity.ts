import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, ManyToMany } from 'typeorm';
import { UserEntity } from '../../users/interfaces/user.entity';
import { Difficulty } from './difficulty.dto';
import { TagEntity } from '../../tags/interfaces/tag.entity';

@Entity('hike')
@Unique(['name'])
export class HikeEntity {
    @PrimaryGeneratedColumn()
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

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
