import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToMany, JoinTable } from 'typeorm';
import { HikeEntity } from '../../hike/interfaces/hike.entity';

@Entity('tag')
@Unique(['name'])
export class TagEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @JoinTable({ name: 'hikes_tags' })
    @ManyToMany(() => HikeEntity, (hike) => hike.tags)
    hikes: HikeEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
