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
import { PointOfInterestEntity } from '../../pointOfInterest/interfaces/poi.entity';
import { ReviewEntity } from '../../review/interfaces/review.entity';
import { AlertEntity } from '../../alert/interfaces/alert.entity';
import { CategoryEntity } from '../../category/interfaces/category.entity';
import { PerformanceEntity } from '../../performance/interfaces/performance.entity';

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

    @Column({
        type: 'decimal',
        precision: 16,
        scale: 5,
    })
    latitude: number;

    @Column({
        type: 'decimal',
        precision: 16,
        scale: 5,
    })
    longitude: number;

    @ManyToMany(() => TagEntity, (tag) => tag.hikes, { onDelete: 'CASCADE' })
    tags: TagEntity[];

    @OneToMany(() => PhotoEntity, (photo) => photo.hike, { cascade: ['remove'] })
    photos: PhotoEntity[];

    @ManyToMany(() => PointOfInterestEntity, (poi) => poi.hikes, { onDelete: 'CASCADE' })
    pointsOfInterest: PointOfInterestEntity[];

    @OneToMany(() => ReviewEntity, (review) => review.hike, { cascade: ['remove'] })
    reviews: ReviewEntity[];

    @OneToMany(() => AlertEntity, (alert) => alert.hike, {
        cascade: ['remove'],
    })
    alerts: AlertEntity[];

    @ManyToOne(() => CategoryEntity, (category) => category.hikes, { onDelete: 'CASCADE' })
    category: CategoryEntity;

    @OneToMany(() => PerformanceEntity, (performance) => performance.hike, {
        cascade: ['remove'],
    })
    performances: PerformanceEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
