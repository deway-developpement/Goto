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
import { UserEntity } from '../../users/interfaces/user.entity';
import { TagEntity } from '../../tags/interfaces/tag.entity';

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

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
