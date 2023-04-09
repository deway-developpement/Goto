import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { UserEntity } from '../../user/interfaces/user.entity';
import { HikeEntity } from '../../hike/interfaces/hike.entity';

@Entity('review')
@Unique(['user', 'hike'])
export class ReviewEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    rating: number;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', eager: true })
    user: UserEntity;

    @ManyToOne(() => HikeEntity, (hike) => hike.reviews, { onDelete: 'CASCADE', eager: true })
    hike: HikeEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
