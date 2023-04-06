import { Column, Entity, PrimaryGeneratedColumn, Unique, ManyToMany, JoinTable } from 'typeorm';

@Entity('users')
@Unique(['pseudo', 'publicKey'])
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column()
    readonly pseudo: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    publicKey: string;

    @Column()
    credidential: number;

    // friend relation M2M
    @ManyToMany(() => UserEntity, (user) => user.friends)
    @JoinTable()
    friends?: UserEntity[];

    @Column({ nullable: true })
    readonly refresh_token?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
