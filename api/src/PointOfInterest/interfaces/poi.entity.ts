import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Unique,
    ManyToMany,
    JoinTable,
    OneToOne,
} from 'typeorm';
import { HikeEntity } from '../../hike/interfaces/hike.entity';
import { PhotoEntity } from '../../photo/interfaces/photo.entity';

@Entity('pointOfInterest')
@Unique(['name'])
export class PointOfInterestEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @Column({ nullable: true })
    url?: string;

    @ManyToMany(() => HikeEntity, (hike) => hike.pointsOfInterest)
    @JoinTable({ name: 'hikes_pointsOfInterest' })
    hikes: HikeEntity[];

    @OneToOne(() => PhotoEntity, (photo) => photo.pointOfInterest, { cascade: true })
    photo: PhotoEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
