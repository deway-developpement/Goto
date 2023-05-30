import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany, ManyToOne } from 'typeorm';
import { HikeEntity } from '../../hike/interfaces/hike.entity';
import { UserEntity } from '../../user/interfaces/user.entity';

@Entity('table')
@Unique(['name'])
export class TableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => UserEntity, (user) => user.tables, { cascade: ['remove'] })
    owner: UserEntity;

    @OneToMany(() => HikeEntity, (hike) => hike.category)
    hikes: HikeEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
