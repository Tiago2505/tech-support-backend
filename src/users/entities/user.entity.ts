import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "../enums";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    fullname!: string;

    @Column('text')
    email!: string;

    @Column('text')
    password!: string;

    @Column('text')
    phone!: string;

    @Column('enum', {
        enum: UserRole,
        default: 'USER'
    })
    role!: UserRole;

    @Column('boolean', {
        default: true
    })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
