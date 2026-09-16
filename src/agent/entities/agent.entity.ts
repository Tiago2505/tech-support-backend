import { User } from "src/users/entities";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class AgentConversation{

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({name: 'userId'})
    user!: User;

    @Column()
    userId!: number;

    @Column()
    responseId!: string;


    @CreateDateColumn({
        type: 'timestamptz'
    })
    createdAt!: Date;

    @UpdateDateColumn({
        type: 'timestamptz'
    })
    updatedAt!: Date;


}