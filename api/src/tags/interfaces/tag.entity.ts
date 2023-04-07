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
import { PhotoEntity } from '../../photos/interfaces/photo.entity';

@Entity('tag')
@Unique(['name'])
export class TagEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToOne(() => PhotoEntity, (photo) => photo.tag, { cascade: ['remove'] })
    defaultPhoto?: PhotoEntity;

    @ManyToMany(() => HikeEntity, (hike) => hike.tags)
    @JoinTable()
    hikes: HikeEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
