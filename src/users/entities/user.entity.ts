import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    fullname!: string;

    @Column('text', {
        unique: true
    })
    email!: string;

    @Column('text')
    password!: string;

    @Column('text')
    phone!: string;

    @Column()
    role!: string;


}
