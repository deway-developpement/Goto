import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToMany, JoinTable } from 'typeorm';
import { HikeEntity } from '../../hike/interfaces/hike.entity';

@Entity('tag')
@Unique(['name'])
export class TagEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => HikeEntity, (hike) => hike.tags)
    @JoinTable({ name: 'hikes_tags' })
    hikes: HikeEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
