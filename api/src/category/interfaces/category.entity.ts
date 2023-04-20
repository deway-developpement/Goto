import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, OneToMany } from 'typeorm';
import { HikeEntity } from '../../hike/interfaces/hike.entity';
import { PhotoEntity } from '../../photo/interfaces/photo.entity';

@Entity('category')
@Unique(['name'])
export class CategoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToOne(() => PhotoEntity, (photo) => photo.category, { cascade: ['remove'] })
    defaultPhoto?: PhotoEntity;

    @OneToMany(() => HikeEntity, (hike) => hike.category)
    hikes: HikeEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
