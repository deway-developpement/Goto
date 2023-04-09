import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    Unique,
    ManyToMany,
    OneToMany,
} from 'typeorm';
import { UserEntity } from '../../user/interfaces/user.entity';
import { Difficulty } from './difficulty.dto';
import { TagEntity } from '../../tag/interfaces/tag.entity';
import { PhotoEntity } from '../../photo/interfaces/photo.entity';
import { PointOfInterestEntity } from '../../PointOfInterest/interfaces/poi.entity';

@Entity('hike')
@Unique(['name'])
export class HikeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    distance: number;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
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

    @ManyToMany(() => PointOfInterestEntity, (poi) => poi.hikes)
    pointsOfInterest: PointOfInterestEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
