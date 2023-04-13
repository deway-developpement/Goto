import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { HikeEntity } from '../../hike/interfaces/hike.entity';
import { AlertType } from './alert.type';
import { UserEntity } from '../../user/interfaces/user.entity';

@Entity('alert')
export class AlertEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @Column()
    type: AlertType;

    @ManyToOne(() => HikeEntity, (hike) => hike.alerts)
    hike: HikeEntity;

    @ManyToOne(() => UserEntity)
    author: UserEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
