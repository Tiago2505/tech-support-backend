import { User } from "src/users/entities";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuditAction, AuditEntity } from "../enums";

@Entity()
export class AuditLog {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('enum',{
        enum: AuditAction
    })
    action!: AuditAction;
    
    @Column('enum', {
        enum: AuditEntity
    })
    entity!: AuditEntity;

    @ManyToOne(()=> User)
    @JoinColumn({name: 'performedById'})
    performedBy!: User;

    @Column()
    performedById!: number;

    @Column()
    affectedRecordId!: number;

    @CreateDateColumn()
    createdAt!: Date;


}
