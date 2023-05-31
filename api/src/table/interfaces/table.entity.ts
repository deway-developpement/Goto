import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Unique,
    ManyToMany,
    ManyToOne,
    JoinTable,
} from 'typeorm';
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

    @ManyToMany(() => HikeEntity, { onDelete: 'CASCADE' })
    @JoinTable({ name: 'tables_hikes' })
    hikes: HikeEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
