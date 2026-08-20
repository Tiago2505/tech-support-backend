import { User } from "src/users/entities";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AuditLog {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('enum',{
        enum: ['UPDATE', 'DELETE']
    })
    action!: string;
    
    @Column('enum', {
        enum: ['USER', 'TICKET']
    })
    entity!: string;

    @ManyToOne(()=> User)
    @JoinColumn({name: 'performedById'})
    performedBy!: User;

    @Column()
    performedById!: number;

    @ManyToOne(()=> User)
    @JoinColumn({name: 'affectedUserId'})
    affectedUser!: User;

    @Column()
    affectedUserId!: number;

    @CreateDateColumn()
    createdAt!: Date;


}
