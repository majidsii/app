import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export default class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 10, unique: true, nullable: false })
    username: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ select: true, nullable: false })
    password: string;

    @Column({ length: 25, nullable: true })
    frist_name: string;

    @Column({ length: 25, nullable: true })
    last_name: string;

    @Column({ nullable: false })
    age: number;
}
