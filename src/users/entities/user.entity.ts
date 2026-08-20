import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
        enum: ['ADMIN', 'USER', 'TECHNICIAN'],
        default: 'USER'
    })
    role!: string;

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
