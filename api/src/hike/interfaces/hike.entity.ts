import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Hike')
export class HikeEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    distance: number;
}
