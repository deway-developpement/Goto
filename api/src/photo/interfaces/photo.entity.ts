import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Unique,
    ManyToOne,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { HikeEntity } from '../../hike/interfaces/hike.entity';
import { UserEntity } from '../../user/interfaces/user.entity';
import { TagEntity } from '../../tag/interfaces/tag.entity';
import { PointOfInterestEntity } from '../../pointOfInterest/interfaces/poi.entity';

@Entity('photo')
@Unique(['filename'])
export class PhotoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    filename: string;

    @ManyToOne(() => HikeEntity, (obj) => obj.photos, { onDelete: 'CASCADE' })
    hike?: HikeEntity;

    @OneToOne(() => UserEntity, (obj) => obj.avatar, { onDelete: 'CASCADE' })
    @JoinColumn()
    user?: UserEntity;

    @OneToOne(() => TagEntity, (obj) => obj.defaultPhoto, { onDelete: 'CASCADE' })
    @JoinColumn()
    tag?: TagEntity;

    @OneToOne(() => PointOfInterestEntity, (obj) => obj.photo, { onDelete: 'CASCADE' })
    @JoinColumn()
    pointOfInterest?: PointOfInterestEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
