import { User } from "src/users/entities";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VerificationCode {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    code!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column('date')
    expiresAt!: Date;

    @ManyToOne(()=>User)
    @JoinTable({name: 'userId'})
    user!: User;

    @Column()
    userId!: number;

    @Column('boolean', {
        default: false
    })
    used!: boolean;

}
